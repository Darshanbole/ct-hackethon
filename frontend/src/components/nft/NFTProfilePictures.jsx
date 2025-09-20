import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Image,
  Wallet,
  Check,
  X,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  Loader2,
  AlertCircle,
  Star
} from 'lucide-react';

const NFTProfilePictures = ({ user, onNFTSelect, isOpen, onClose }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [walletConnected, setWalletConnected] = useState(false);
  const [error, setError] = useState(null);

  // Mock NFT data
  const mockNFTs = [
    {
      id: '1',
      name: 'Crypto Punk #1234',
      collection: 'CryptoPunks',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
      contract: '0x...',
      tokenId: '1234',
      rarity: 'Rare',
      traits: [
        { trait_type: 'Background', value: 'Blue' },
        { trait_type: 'Eyes', value: 'Laser' },
        { trait_type: 'Mouth', value: 'Smile' }
      ],
      floor_price: '45.5 ETH',
      last_sale: '50.2 ETH',
      blockchain: 'Ethereum',
      verified: true
    },
    {
      id: '2',
      name: 'Bored Ape #5678',
      collection: 'Bored Ape Yacht Club',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      contract: '0x...',
      tokenId: '5678',
      rarity: 'Epic',
      traits: [
        { trait_type: 'Fur', value: 'Golden' },
        { trait_type: 'Eyes', value: 'Bloodshot' },
        { trait_type: 'Hat', value: 'Beanie' }
      ],
      floor_price: '32.1 ETH',
      last_sale: '35.8 ETH',
      blockchain: 'Ethereum',
      verified: true
    },
    {
      id: '3',
      name: 'Azuki #9876',
      collection: 'Azuki',
      image: 'https://images.unsplash.com/photo-1635321593217-40050ad13c74?w=400&h=400&fit=crop',
      contract: '0x...',
      tokenId: '9876',
      rarity: 'Common',
      traits: [
        { trait_type: 'Type', value: 'Human' },
        { trait_type: 'Hair', value: 'Black' },
        { trait_type: 'Clothing', value: 'Kimono' }
      ],
      floor_price: '8.2 ETH',
      last_sale: '9.1 ETH',
      blockchain: 'Ethereum',
      verified: true
    },
    {
      id: '4',
      name: 'Doodle #3456',
      collection: 'Doodles',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
      contract: '0x...',
      tokenId: '3456',
      rarity: 'Uncommon',
      traits: [
        { trait_type: 'Background', value: 'Purple' },
        { trait_type: 'Body', value: 'Green' },
        { trait_type: 'Face', value: 'Happy' }
      ],
      floor_price: '12.5 ETH',
      last_sale: '13.2 ETH',
      blockchain: 'Ethereum',
      verified: true
    },
    {
      id: '5',
      name: 'Shardeum NFT #123',
      collection: 'Shardeum Genesis',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop',
      contract: '0x...',
      tokenId: '123',
      rarity: 'Legendary',
      traits: [
        { trait_type: 'Background', value: 'Cosmic' },
        { trait_type: 'Element', value: 'Lightning' },
        { trait_type: 'Power', value: 'Max' }
      ],
      floor_price: '2.5 SHM',
      last_sale: '3.1 SHM',
      blockchain: 'Shardeum',
      verified: true
    },
    {
      id: '6',
      name: 'Web3 Builder #789',
      collection: 'Web3 Builders',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
      contract: '0x...',
      tokenId: '789',
      rarity: 'Rare',
      traits: [
        { trait_type: 'Role', value: 'Developer' },
        { trait_type: 'Language', value: 'Solidity' },
        { trait_type: 'Experience', value: 'Senior' }
      ],
      floor_price: '1.8 ETH',
      last_sale: '2.2 ETH',
      blockchain: 'Ethereum',
      verified: true
    }
  ];

  useEffect(() => {
    if (isOpen) {
      checkWalletConnection();
    }
  }, [isOpen]);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          loadNFTs();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setLoading(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletConnected(true);
          await loadNFTs();
        }
      } catch (error) {
        setError('Failed to connect wallet. Please try again.');
        console.error('Error connecting wallet:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
    }
  };

  const loadNFTs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to fetch NFTs
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call an NFT API like:
      // - OpenSea API
      // - Alchemy NFT API
      // - Moralis API
      // - Your own indexer
      
      setNfts(mockNFTs);
    } catch (error) {
      setError('Failed to load NFTs. Please try again.');
      console.error('Error loading NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNFTSelect = (nft) => {
    setSelectedNFT(nft);
  };

  const confirmNFTSelection = () => {
    if (selectedNFT && onNFTSelect) {
      onNFTSelect(selectedNFT);
      onClose();
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': 'bg-gray-500',
      'Uncommon': 'bg-green-500',
      'Rare': 'bg-blue-500',
      'Epic': 'bg-purple-500',
      'Legendary': 'bg-yellow-500'
    };
    return colors[rarity] || 'bg-gray-500';
  };

  const getCollections = () => {
    const collections = [...new Set(nfts.map(nft => nft.collection))];
    return collections;
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = collectionFilter === 'all' || nft.collection === collectionFilter;
    return matchesSearch && matchesCollection;
  }).sort((a, b) => {
    if (sortBy === 'recent') return b.id.localeCompare(a.id);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'collection') return a.collection.localeCompare(b.collection);
    if (sortBy === 'rarity') {
      const rarityOrder = { 'Legendary': 5, 'Epic': 4, 'Rare': 3, 'Uncommon': 2, 'Common': 1 };
      return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    }
    return 0;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Choose NFT Profile Picture
          </DialogTitle>
          <DialogDescription>
            Select an NFT from your wallet to use as your profile picture
          </DialogDescription>
        </DialogHeader>

        {!walletConnected ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Connect your wallet to view and select from your NFT collection
            </p>
            <Button onClick={connectWallet} disabled={loading} className="gap-2">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              Connect MetaMask
            </Button>
            {error && (
              <div className="flex items-center gap-2 mt-4 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search NFTs</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or collection..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <Label>Collection</Label>
                  <Select value={collectionFilter} onValueChange={setCollectionFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Collections</SelectItem>
                      {getCollections().map(collection => (
                        <SelectItem key={collection} value={collection}>
                          {collection}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-32">
                  <Label>Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="collection">Collection</SelectItem>
                      <SelectItem value="rarity">Rarity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedNFT && (
                <Card className="border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedNFT.image} />
                        <AvatarFallback>NFT</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{selectedNFT.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedNFT.collection}</p>
                        <Badge className={`${getRarityColor(selectedNFT.rarity)} text-white`}>
                          {selectedNFT.rarity}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedNFT(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button onClick={confirmNFTSelection}>
                          <Check className="h-4 w-4 mr-2" />
                          Use as Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Separator />

            {/* NFTs Grid */}
            <ScrollArea className="h-96">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="aspect-square w-full" />
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredNFTs.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredNFTs.map((nft) => (
                    <motion.div
                      key={nft.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedNFT?.id === nft.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleNFTSelect(nft)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={nft.image}
                            alt={nft.name}
                            className="aspect-square w-full object-cover"
                          />
                          {nft.verified && (
                            <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                              <Check className="h-3 w-3" />
                            </Badge>
                          )}
                          <Badge 
                            className={`absolute top-2 left-2 ${getRarityColor(nft.rarity)} text-white`}
                          >
                            {nft.rarity}
                          </Badge>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold truncate">{nft.name}</h4>
                          <p className="text-xs text-muted-foreground truncate mb-2">
                            {nft.collection}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Floor</span>
                            <span className="font-medium">{nft.floor_price}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No NFTs found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              )}

              {error && (
                <div className="flex items-center justify-center gap-2 py-8 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </ScrollArea>

            {/* Stats */}
            {!loading && nfts.length > 0 && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredNFTs.length} of {nfts.length} NFTs</span>
                <Button variant="ghost" size="sm" onClick={loadNFTs}>
                  Refresh Collection
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NFTProfilePictures;