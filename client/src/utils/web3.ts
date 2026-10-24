export const BSC_TESTNET_CONFIG = {
  chainId: '0x61', // 97 in hex
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/'],
  contracts: {
    tenDollarCore: '0xa8A184Be78cAa345EeDC1c6A07cc0E7FB72E8D9f',
    usdtTestnet: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
  },
};

/**
 * Switch or add BSC Testnet (Chain ID 97) in user's Web3 wallet
 */
export async function switchToBscTestnet(): Promise<boolean> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    console.warn('No Web3 wallet extension found (e.g. MetaMask). Using simulated BSC Testnet.');
    return false;
  }

  try {
    // Try to switch to BSC Testnet
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_TESTNET_CONFIG.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // Error 4902 means the chain has not been added to MetaMask yet
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BSC_TESTNET_CONFIG.chainId,
              chainName: BSC_TESTNET_CONFIG.chainName,
              nativeCurrency: BSC_TESTNET_CONFIG.nativeCurrency,
              rpcUrls: BSC_TESTNET_CONFIG.rpcUrls,
              blockExplorerUrls: BSC_TESTNET_CONFIG.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add BSC Testnet to wallet:', addError);
        return false;
      }
    }
    console.error('Failed to switch to BSC Testnet:', switchError);
    return false;
  }
}

/**
 * Check if MetaMask is already connected without popping modal
 */
export async function getConnectedAccount(): Promise<string | null> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) return null;
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts && accounts.length > 0) {
      return accounts[0];
    }
    return null;
  } catch (e) {
    console.error('Failed to get connected account', e);
    return null;
  }
}

/**
 * Fetch real BNB balance for connected account
 */
export async function getBnbBalance(address: string): Promise<number> {
  const ethereum = (window as any).ethereum;
  if (!ethereum || !address) return 0;
  try {
    const hexBalance = await ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    const wei = BigInt(hexBalance);
    const bnb = Number(wei) / 1e18;
    return parseFloat(bnb.toFixed(4));
  } catch (e) {
    console.warn('Failed to fetch BNB balance', e);
    return 0;
  }
}

/**
 * Connect real Web3 wallet if available
 */
export async function connectWeb3Wallet(): Promise<string | null> {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    return null;
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      await switchToBscTestnet();
      return accounts[0];
    }
    return null;
  } catch (error) {
    console.error('User rejected wallet connection:', error);
    return null;
  }
}
