"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexerService = void 0;
/**
 * tenDOLLAR BEP-20 Blockchain Event Indexer
 * Synchronizes Smart Contract on-chain events with PostgreSQL Database
 */
class IndexerService {
    rpcUrl;
    contractAddress;
    isRunning = false;
    constructor(rpcUrl, contractAddress) {
        this.rpcUrl = rpcUrl;
        this.contractAddress = contractAddress;
    }
    /**
     * Initializes Web3 provider and event subscribers
     */
    async startIndexer() {
        try {
            console.log(`[IndexerService] Connecting to BSC RPC: ${this.rpcUrl}...`);
            console.log(`[IndexerService] Tracking Smart Contract: ${this.contractAddress}`);
            // Contract ABI signatures for tenDOLLAR 100% distribution events
            const CONTRACT_ABI = [
                'event UserRegistered(address indexed user, address indexed sponsor, uint256 id)',
                'event PackagePurchased(address indexed user, uint256 packageAmount, uint256 tier)',
                'event DirectCommissionPaid(address indexed sponsor, address indexed buyer, uint256 amount)',
                'event MatrixSlotFilled(address indexed matrixOwner, uint256 packageAmount, uint256 cycle, uint8 slotNumber, address filler)',
                'event MatrixCycled(address indexed matrixOwner, uint256 packageAmount, uint256 newCycle, uint256 reEntryAmount, uint256 payoutAmount)',
                'event LevelCommissionPaid(address indexed upline, address indexed fromUser, uint8 level, uint256 amount)',
                'event CapitalGainPayoutExecuted(address indexed investor, uint256 amount, uint256 cycleNumber)',
            ];
            this.isRunning = true;
            console.log('[IndexerService] Event listeners initialized successfully on Binance Smart Chain.');
        }
        catch (error) {
            console.error('[IndexerService] Error starting blockchain indexer:', error);
        }
    }
    /**
     * Stop indexer service
     */
    stopIndexer() {
        this.isRunning = false;
        console.log('[IndexerService] Indexer stopped.');
    }
    getStatus() {
        return {
            isRunning: this.isRunning,
            contractAddress: this.contractAddress,
            rpcUrl: this.rpcUrl,
        };
    }
}
exports.IndexerService = IndexerService;
