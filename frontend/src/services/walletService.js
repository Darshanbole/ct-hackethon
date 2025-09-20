import { ethers } from 'ethers';
import Web3 from 'web3';
import CryptoJS from 'crypto-js';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.web3 = null;
    this.account = null;
    this.networkId = null;
  }

  // Initialize Web3 connection
  async initializeWeb3() {
    try {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        this.provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        // Fallback to mock provider for demo
        this.initializeMockProvider();
      }
      return true;
    } catch (error) {
      console.error('Error initializing Web3:', error);
      this.initializeMockProvider();
      return false;
    }
  }

  // Initialize mock provider for demo purposes
  initializeMockProvider() {
    // Create mock provider for demo
    this.provider = {
      getNetwork: () => Promise.resolve({ chainId: 1, name: 'homestead' }),
      getBalance: () => Promise.resolve(ethers.parseEther('2.45')),
      getTransactionCount: () => Promise.resolve(42),
    };
    
    this.web3 = {
      eth: {
        getAccounts: () => Promise.resolve(['0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E']),
        getBalance: () => Promise.resolve('2450000000000000000'),
        getTransactionCount: () => Promise.resolve(42),
      }
    };
    
    this.account = '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E';
  }

  // Connect to wallet
  async connectWallet() {
    try {
      await this.initializeWeb3();
      
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        this.account = accounts[0];
        this.signer = await this.provider.getSigner();
        
        // Get network information
        const network = await this.provider.getNetwork();
        this.networkId = network.chainId;
        
        return {
          success: true,
          account: this.account,
          networkId: this.networkId
        };
      } else {
        // Mock connection for demo
        this.account = '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E';
        this.networkId = 1;
        
        return {
          success: true,
          account: this.account,
          networkId: this.networkId
        };
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Disconnect wallet
  disconnectWallet() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.networkId = null;
    return { success: true };
  }

  // Get account balance
  async getBalance(address = null) {
    try {
      const accountAddress = address || this.account;
      if (!accountAddress) return '0';
      
      if (this.provider && this.provider.getBalance) {
        const balance = await this.provider.getBalance(accountAddress);
        return ethers.formatEther(balance);
      } else {
        // Mock balance for demo
        return '2.45';
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Get transaction history (mock data for demo)
  async getTransactionHistory(address = null) {
    // In a real app, this would fetch from blockchain or indexer
    return [
      {
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E',
        to: '0x1234567890123456789012345678901234567890',
        value: '0.5',
        timestamp: Date.now() - 86400000,
        status: 'confirmed',
        type: 'send'
      },
      {
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0x9876543210987654321098765432109876543210',
        to: '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E',
        value: '1.2',
        timestamp: Date.now() - 172800000,
        status: 'confirmed',
        type: 'receive'
      }
    ];
  }

  // Send transaction
  async sendTransaction(to, amount, currency = 'ETH') {
    try {
      if (!this.signer && !this.account) {
        throw new Error('Wallet not connected');
      }

      // For demo purposes, we'll simulate the transaction
      if (!window.ethereum) {
        // Mock transaction for demo
        const mockTx = {
          hash: '0x' + Math.random().toString(16).substr(2, 64),
          from: this.account,
          to: to,
          value: amount,
          status: 'pending',
          timestamp: Date.now()
        };
        
        // Simulate network delay
        setTimeout(() => {
          mockTx.status = 'confirmed';
        }, 3000);
        
        return {
          success: true,
          transaction: mockTx
        };
      }

      // Real transaction (when MetaMask is available)
      const tx = {
        to: to,
        value: ethers.parseEther(amount.toString()),
        gasLimit: 21000,
      };

      const transaction = await this.signer.sendTransaction(tx);
      await transaction.wait();

      return {
        success: true,
        transaction: {
          hash: transaction.hash,
          from: this.account,
          to: to,
          value: amount,
          status: 'confirmed'
        }
      };
    } catch (error) {
      console.error('Error sending transaction:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate wallet address (for demo)
  generateWalletAddress() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  }

  // Encrypt private key
  encryptPrivateKey(privateKey, password) {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  }

  // Decrypt private key
  decryptPrivateKey(encryptedPrivateKey, password) {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Validate Ethereum address
  isValidAddress(address) {
    return ethers.isAddress(address);
  }

  // Get network name
  getNetworkName(chainId) {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      137: 'Polygon Mainnet',
      80001: 'Polygon Mumbai',
      56: 'BSC Mainnet',
      97: 'BSC Testnet'
    };
    return networks[chainId] || 'Unknown Network';
  }

  // Switch network
  async switchNetwork(chainId) {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        this.networkId = chainId;
        return { success: true };
      }
      return { success: false, error: 'MetaMask not available' };
    } catch (error) {
      console.error('Error switching network:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current network
  async getCurrentNetwork() {
    try {
      if (this.provider) {
        const network = await this.provider.getNetwork();
        return {
          chainId: Number(network.chainId),
          name: this.getNetworkName(Number(network.chainId))
        };
      }
      return { chainId: 1, name: 'Ethereum Mainnet' };
    } catch (error) {
      console.error('Error getting network:', error);
      return { chainId: 1, name: 'Ethereum Mainnet' };
    }
  }

  // Format amount for display
  formatAmount(amount, decimals = 4) {
    return parseFloat(amount).toFixed(decimals);
  }

  // Convert Wei to Ether
  weiToEther(wei) {
    return ethers.formatEther(wei);
  }

  // Convert Ether to Wei
  etherToWei(ether) {
    return ethers.parseEther(ether.toString());
  }
}

// Create singleton instance
const walletService = new WalletService();

export default walletService;