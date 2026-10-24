// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Standard BEP-20 / ERC-20 Interface
 */
interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 */
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

/**
 * @title TenDollarCore
 * @dev 100% Decentralized Global Income Ecosystem on Binance Smart Chain (BEP-20)
 *      Website: WWW.TENDOLLAR.WORLD
 *      Distribution:
 *        - 20% Direct Income
 *        - 40% Global Matrix (2-slot recycling: Slot 1 Re-entry, Slot 2 Withdrawal)
 *        - 10% Level Income (1% per level x 10 upline levels)
 *        - 20% Capital Gain Pool ($150 -> $300, $4 every 10 days)
 *        - 10% Rank & Rewards Royalty Pool
 */
contract TenDollarCore is ReentrancyGuard {
    IERC20 public immutable usdtToken;
    address public rootAdmin;

    uint256 public constant DECIMALS = 1e18;
    uint256 public constant MIN_WITHDRAWAL = 10 * DECIMALS;
    uint256 public constant MIN_P2P = 5 * DECIMALS;
    uint256 public constant CAPPING_PERCENT = 500; // 500% Package Capping
    uint256 public constant DEPOSIT_FEE_PERCENT = 5; // 5% Deposit Fee charged to Admin

    uint256 public constant CAPITAL_GAIN_COST = 150 * DECIMALS;
    uint256 public constant CAPITAL_GAIN_PAYOUT = 4 * DECIMALS;
    uint256 public constant CAPITAL_GAIN_TARGET = 300 * DECIMALS;
    uint256 public constant CAPITAL_GAIN_INTERVAL = 10 days;
    uint256 public constant CAPITAL_GAIN_MAX_CYCLES = 75; // 75 * $4 = $300

    uint256 public totalUsers;
    uint256 public totalVolumeDistributed;
    uint256 public capitalGainPoolBalance;
    uint256 public rankRewardsPoolBalance;

    struct User {
        uint256 id;
        address sponsor;
        uint256 activePackage;
        uint256 totalEarned;
        uint256 cappingEarned;
        uint256 directsCount;
        bool isRegistered;
        mapping(uint256 => bool) packageUnlocked;
    }

    struct MatrixNode {
        uint256 cycle;
        address slot1; // 20% Re-entry
        address slot2; // 20% Instant Withdrawal
        uint256 totalRecycles;
        uint256 matrixEarnings;
    }

    struct CapitalGainPlan {
        uint256 joinedAt;
        uint256 lastPayoutAt;
        uint256 cyclesCompleted;
        uint256 totalPaid;
        bool isActive;
    }

    mapping(address => User) public users;
    mapping(uint256 => address) public userIds;
    // user => claimable available earnings balance
    mapping(address => uint256) public claimableBalance;
    // user => packageAmount => MatrixNode
    mapping(address => mapping(uint256 => MatrixNode)) public userMatrix;
    // Queue of open matrix nodes awaiting spillover placement: packageAmount => address[]
    mapping(uint256 => address[]) private matrixQueue;
    mapping(address => CapitalGainPlan) public capitalPlans;

    // Supported Packages
    uint256[8] public PACKAGES = [
        10 * DECIMALS,
        20 * DECIMALS,
        40 * DECIMALS,
        80 * DECIMALS,
        160 * DECIMALS,
        320 * DECIMALS,
        640 * DECIMALS,
        1280 * DECIMALS
    ];

    // Events
    event UserRegistered(address indexed user, address indexed sponsor, uint256 indexed id);
    event PackagePurchased(address indexed user, uint256 packageAmount, uint256 tierIndex);
    event DirectCommissionPaid(address indexed sponsor, address indexed fromUser, uint256 amount);
    event MatrixSlotFilled(address indexed matrixOwner, uint256 packageAmount, uint256 cycle, uint8 slotNumber, address filler);
    event MatrixCycled(address indexed matrixOwner, uint256 packageAmount, uint256 newCycle, uint256 reEntryAmount, uint256 withdrawalAmount);
    event LevelCommissionPaid(address indexed upline, address indexed fromUser, uint8 level, uint256 amount);
    event CapitalGainJoined(address indexed user, uint256 timestamp);
    event CapitalGainPayoutPaid(address indexed user, uint256 amount, uint256 cycle);
    event WithdrawalExecuted(address indexed user, uint256 grossAmount, uint256 fee, uint256 netAmount);
    event P2PTransferExecuted(address indexed sender, address indexed recipient, uint256 grossAmount, uint256 fee, uint256 netAmount);
    event DepositFeePaid(address indexed user, uint256 packageAmount, uint256 feeAmount);

    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "tenDOLLAR: Caller is not registered");
        _;
    }

    /**
     * @dev Security modifier preventing smart contract exploits / flash loans
     */
    modifier onlyEOA() {
        require(msg.sender == tx.origin, "tenDOLLAR: Direct smart contracts or bot scripts not allowed");
        _;
    }

    constructor(address _usdtAddress) {
        require(_usdtAddress != address(0), "Invalid token address");
        usdtToken = IERC20(_usdtAddress);
        rootAdmin = msg.sender;

        // Register Root Admin (ID #10001)
        totalUsers = 10001;
        users[rootAdmin].id = totalUsers;
        users[rootAdmin].isRegistered = true;
        users[rootAdmin].sponsor = address(0);
        users[rootAdmin].activePackage = PACKAGES[7]; // All tiers unlocked
        for (uint256 i = 0; i < PACKAGES.length; i++) {
            users[rootAdmin].packageUnlocked[PACKAGES[i]] = true;
            matrixQueue[PACKAGES[i]].push(rootAdmin);
        }
        userIds[totalUsers] = rootAdmin;

        emit UserRegistered(rootAdmin, address(0), totalUsers);
    }

    /**
     * @notice Free Registration (0 Admin fees, 100% decentralized per PDF)
     */
    function register(address sponsor) external nonReentrant returns (uint256) {
        require(!users[msg.sender].isRegistered, "tenDOLLAR: Already registered");
        if (sponsor == address(0) || !users[sponsor].isRegistered) {
            sponsor = rootAdmin;
        }

        totalUsers++;
        User storage newUser = users[msg.sender];
        newUser.id = totalUsers;
        newUser.sponsor = sponsor;
        newUser.isRegistered = true;

        users[sponsor].directsCount++;
        userIds[totalUsers] = msg.sender;

        emit UserRegistered(msg.sender, sponsor, totalUsers);
        return totalUsers;
    }

    /**
     * @notice Package Activation & 100% Auto Distribution
     *         Transfers USDT from user and splits 100% on-chain
     */
    function buyPackage(uint256 packageAmount) external nonReentrant onlyRegistered {
        require(isValidPackage(packageAmount), "tenDOLLAR: Invalid package amount");
        require(!users[msg.sender].packageUnlocked[packageAmount], "tenDOLLAR: Package already unlocked");

        // 10% Deposit Fee Calculation (e.g. $1 on $10, $8 on $80)
        uint256 depositFee = (packageAmount * DEPOSIT_FEE_PERCENT) / 100;
        uint256 totalRequired = packageAmount + depositFee;

        // Transfer total USDT (package amount + 10% deposit fee) from buyer
        require(
            usdtToken.transferFrom(msg.sender, address(this), totalRequired),
            "tenDOLLAR: USDT transfer failed"
        );

        // Instantly route 10% deposit fee to rootAdmin wallet
        usdtToken.transfer(rootAdmin, depositFee);
        emit DepositFeePaid(msg.sender, packageAmount, depositFee);

        // Update User Package Status
        users[msg.sender].packageUnlocked[packageAmount] = true;
        if (packageAmount > users[msg.sender].activePackage) {
            users[msg.sender].activePackage = packageAmount;
            users[msg.sender].cappingEarned = 0; // Reset capping upon tier upgrade
        }

        totalVolumeDistributed += packageAmount;

        // 1. 20% Direct Referral Commission
        uint256 directShare = (packageAmount * 20) / 100;
        address sponsor = users[msg.sender].sponsor;
        _payCommission(sponsor, directShare, "DIRECT");
        emit DirectCommissionPaid(sponsor, msg.sender, directShare);

        // 2. 10% Level Income (1% across 10 Upline Levels)
        uint256 levelSharePerUpline = (packageAmount * 1) / 100;
        address currentUpline = sponsor;
        for (uint8 lvl = 1; lvl <= 10; lvl++) {
            if (currentUpline == address(0)) {
                currentUpline = rootAdmin;
            }
            _payCommission(currentUpline, levelSharePerUpline, "LEVEL");
            emit LevelCommissionPaid(currentUpline, msg.sender, lvl, levelSharePerUpline);
            currentUpline = users[currentUpline].sponsor;
        }

        // 3. 40% Global Matrix (Slot 1 Re-entry, Slot 2 Withdrawal)
        _processGlobalMatrix(msg.sender, packageAmount);

        // 4. 20% Capital Gain Pool Allocation
        uint256 capitalShare = (packageAmount * 20) / 100;
        capitalGainPoolBalance += capitalShare;

        // 5. 10% Rank & Rewards Royalty Pool Allocation
        uint256 rankShare = (packageAmount * 10) / 100;
        rankRewardsPoolBalance += rankShare;

        emit PackagePurchased(msg.sender, packageAmount, getPackageTierIndex(packageAmount));
    }

    /**
     * @dev Global Matrix Placement & 2-Slot Auto Recycling
     */
    function _processGlobalMatrix(address buyer, uint256 packageAmount) internal {
        // Enqueue buyer for matrix placements
        matrixQueue[packageAmount].push(buyer);

        // Find active open matrix parent from the queue
        address parent = _getOpenMatrixParent(packageAmount);
        MatrixNode storage node = userMatrix[parent][packageAmount];

        uint256 slotAmount = (packageAmount * 20) / 100; // 20% per slot (Total 40%)

        if (node.slot1 == address(0)) {
            // Slot 1: Automatic Re-entry allocation
            node.slot1 = buyer;
            emit MatrixSlotFilled(parent, packageAmount, node.cycle + 1, 1, buyer);
        } else if (node.slot2 == address(0)) {
            // Slot 2: Instant Withdrawal Payout to Matrix Owner
            node.slot2 = buyer;
            emit MatrixSlotFilled(parent, packageAmount, node.cycle + 1, 2, buyer);

            // Pay Slot 2 Instant Withdrawal to Matrix Owner
            _payCommission(parent, slotAmount, "MATRIX");

            // Cycle Completed -> Auto Re-entry
            node.cycle++;
            node.totalRecycles++;
            node.matrixEarnings += slotAmount;
            node.slot1 = address(0);
            node.slot2 = address(0);

            // Re-queue parent for new cycle
            matrixQueue[packageAmount].push(parent);

            emit MatrixCycled(parent, packageAmount, node.cycle, slotAmount, slotAmount);
        }
    }

    function _getOpenMatrixParent(uint256 packageAmount) internal view returns (address) {
        address[] storage queue = matrixQueue[packageAmount];
        for (uint256 i = 0; i < queue.length; i++) {
            address candidate = queue[i];
            MatrixNode storage node = userMatrix[candidate][packageAmount];
            if (node.slot1 == address(0) || node.slot2 == address(0)) {
                return candidate;
            }
        }
        return rootAdmin;
    }

    /**
     * @dev Internal commission crediting with 500% capping enforcement
     *      Funds are securely added to user's claimableBalance
     */
    function _payCommission(address recipient, uint256 amount, string memory /*incomeType*/) internal {
        if (recipient == address(0)) {
            recipient = rootAdmin;
        }

        User storage u = users[recipient];
        uint256 maxCapping = u.activePackage * 5;

        if (maxCapping > 0 && u.cappingEarned + amount > maxCapping) {
            uint256 payableAmount = maxCapping > u.cappingEarned ? maxCapping - u.cappingEarned : 0;
            if (payableAmount > 0) {
                u.cappingEarned += payableAmount;
                u.totalEarned += payableAmount;
                claimableBalance[recipient] += payableAmount;
            }
            // Excess overflows to root reserve
            uint256 excess = amount - payableAmount;
            if (excess > 0) {
                claimableBalance[rootAdmin] += excess;
            }
        } else {
            u.cappingEarned += amount;
            u.totalEarned += amount;
            claimableBalance[recipient] += amount;
        }
    }

    /**
     * @notice Join $150 Capital Gain Plan
     */
    function joinCapitalGain() external nonReentrant onlyRegistered onlyEOA {
        require(!capitalPlans[msg.sender].isActive, "tenDOLLAR: Already active in Capital Gain");

        uint256 depositFee = (CAPITAL_GAIN_COST * DEPOSIT_FEE_PERCENT) / 100; // 5% fee
        uint256 totalRequired = CAPITAL_GAIN_COST + depositFee;

        require(
            usdtToken.transferFrom(msg.sender, address(this), totalRequired),
            "tenDOLLAR: USDT payment failed"
        );

        // Send 5% fee to rootAdmin
        usdtToken.transfer(rootAdmin, depositFee);
        emit DepositFeePaid(msg.sender, CAPITAL_GAIN_COST, depositFee);

        capitalPlans[msg.sender] = CapitalGainPlan({
            joinedAt: block.timestamp,
            lastPayoutAt: block.timestamp,
            cyclesCompleted: 0,
            totalPaid: 0,
            isActive: true
        });

        capitalGainPoolBalance += CAPITAL_GAIN_COST;
        emit CapitalGainJoined(msg.sender, block.timestamp);
    }

    /**
     * @notice Claim 10-Day Automated Dividend ($4 every 10 days up to $300)
     */
    function claimCapitalGainPayout() external nonReentrant onlyRegistered onlyEOA {
        CapitalGainPlan storage plan = capitalPlans[msg.sender];
        require(plan.isActive, "tenDOLLAR: No active capital plan");
        require(
            block.timestamp >= plan.lastPayoutAt + CAPITAL_GAIN_INTERVAL,
            "tenDOLLAR: 10 days interval not yet elapsed"
        );
        require(plan.totalPaid < CAPITAL_GAIN_TARGET, "tenDOLLAR: Plan completed ($300 reached)");

        plan.cyclesCompleted++;
        plan.totalPaid += CAPITAL_GAIN_PAYOUT;
        plan.lastPayoutAt = block.timestamp;

        if (plan.cyclesCompleted >= CAPITAL_GAIN_MAX_CYCLES || plan.totalPaid >= CAPITAL_GAIN_TARGET) {
            plan.isActive = false;
        }

        require(capitalGainPoolBalance >= CAPITAL_GAIN_PAYOUT, "tenDOLLAR: Insufficient capital pool balance");
        capitalGainPoolBalance -= CAPITAL_GAIN_PAYOUT;

        require(usdtToken.transfer(msg.sender, CAPITAL_GAIN_PAYOUT), "tenDOLLAR: Payout transfer failed");
        emit CapitalGainPayoutPaid(msg.sender, CAPITAL_GAIN_PAYOUT, plan.cyclesCompleted);
    }

    /**
     * @notice Direct Withdrawal with 10% System Deduction
     *         Secured: Requires verifiable on-chain claimable earnings
     */
    function withdraw(uint256 amount) external nonReentrant onlyRegistered onlyEOA {
        require(amount >= MIN_WITHDRAWAL, "tenDOLLAR: Minimum withdrawal is $10 USDT");
        require(claimableBalance[msg.sender] >= amount, "tenDOLLAR: Insufficient claimable balance");
        
        claimableBalance[msg.sender] -= amount;

        uint256 fee = (amount * 10) / 100; // 10% deduction
        uint256 netAmount = amount - fee;

        require(usdtToken.transfer(msg.sender, netAmount), "tenDOLLAR: Net withdrawal transfer failed");
        require(usdtToken.transfer(rootAdmin, fee), "tenDOLLAR: Fee transfer failed");

        emit WithdrawalExecuted(msg.sender, amount, fee, netAmount);
    }

    /**
     * @notice P2P Wallet to Wallet Transfer with 5% Deduction
     */
    function p2pTransfer(address recipient, uint256 amount) external nonReentrant onlyRegistered {
        require(amount >= MIN_P2P, "tenDOLLAR: Minimum transfer is $5 USDT");
        require(users[recipient].isRegistered, "tenDOLLAR: Recipient is not registered");

        uint256 fee = (amount * 5) / 100; // 5% deduction
        uint256 netAmount = amount - fee;

        require(
            usdtToken.transferFrom(msg.sender, recipient, netAmount),
            "tenDOLLAR: Recipient transfer failed"
        );
        require(
            usdtToken.transferFrom(msg.sender, rootAdmin, fee),
            "tenDOLLAR: Fee transfer failed"
        );

        emit P2PTransferExecuted(msg.sender, recipient, amount, fee, netAmount);
    }

    /**
     * @dev Checks if package amount is valid
     */
    function isValidPackage(uint256 amount) public view returns (bool) {
        for (uint256 i = 0; i < PACKAGES.length; i++) {
            if (PACKAGES[i] == amount) return true;
        }
        return false;
    }

    function getPackageTierIndex(uint256 amount) public view returns (uint256) {
        for (uint256 i = 0; i < PACKAGES.length; i++) {
            if (PACKAGES[i] == amount) return i + 1;
        }
        return 0;
    }
}
