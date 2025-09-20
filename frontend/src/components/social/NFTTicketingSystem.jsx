import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Users, 
  Coins, 
  Star,
  Clock,
  Shield,
  Plus,
  ShoppingCart,
  Gift,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const NFTTicketingSystem = ({ userWallet }) => {
  const [events, setEvents] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // Create event form state
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    price: '',
    totalSupply: '',
    category: 'Conference'
  });

  const EVENT_CATEGORIES = ['Conference', 'Concert', 'Workshop', 'Meetup', 'Sports', 'Art', 'Gaming'];

  useEffect(() => {
    loadEvents();
    if (userWallet) {
      loadMyTickets();
    }
  }, [userWallet]);

  const loadEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/nft-tickets/list');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const loadMyTickets = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/nft-tickets/my-tickets?wallet=${userWallet}`);
      if (response.ok) {
        const data = await response.json();
        setMyTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Failed to load my tickets:', error);
    }
  };

  const createEvent = async () => {
    if (!eventForm.name || !eventForm.price || !eventForm.totalSupply) return;

    setIsLoading(true);
    try {
      const eventDateTime = new Date(`${eventForm.date}T${eventForm.time}`).toISOString();
      
      const response = await fetch('http://localhost:5000/api/nft-tickets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventForm.name,
          description: eventForm.description,
          venue: eventForm.venue,
          event_date: eventDateTime,
          price: parseFloat(eventForm.price),
          total_supply: parseInt(eventForm.totalSupply),
          creator_wallet: userWallet,
          category: eventForm.category
        })
      });

      if (response.ok) {
        setShowCreateDialog(false);
        setEventForm({
          name: '',
          description: '',
          venue: '',
          date: '',
          time: '',
          price: '',
          totalSupply: '',
          category: 'Conference'
        });
        await loadEvents();
        alert('Event created successfully!');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseTicket = async (eventId, price) => {
    if (!userWallet) {
      alert('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Send payment transaction
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: userWallet,
          to: '0x742d35Cc6b3c8D21C04A7b7D7A4DA1E5CF1A9D2E', // Event creator or platform wallet
          value: (price * Math.pow(10, 18)).toString(16), // Convert to wei
          gas: '21000'
        }]
      });

      // Record ticket purchase
      const response = await fetch('http://localhost:5000/api/nft-tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          buyer_wallet: userWallet,
          transaction_hash: transactionHash,
          amount_paid: price
        })
      });

      if (response.ok) {
        await loadEvents();
        await loadMyTickets();
        alert('Ticket purchased successfully! NFT will be minted shortly.');
      }
    } catch (error) {
      console.error('Failed to purchase ticket:', error);
      alert('Failed to purchase ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            NFT Event Ticketing
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover events, purchase NFT tickets with crypto, and own unique digital collectibles
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Ticket className="w-4 h-4 mr-2" />
              {events.length} Events Available
            </Badge>
            {userWallet && (
              <Badge variant="outline" className="px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                {myTickets.length} My Tickets
              </Badge>
            )}
          </div>
          
          {userWallet && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div>
                    <Label>Event Name</Label>
                    <Input
                      value={eventForm.name}
                      onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                      placeholder="Web3 Conference 2025"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      placeholder="Brief description of your event"
                      className="resize-none"
                    />
                  </div>
                  <div>
                    <Label>Venue</Label>
                    <Input
                      value={eventForm.venue}
                      onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                      placeholder="Convention Center / Virtual"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={eventForm.time}
                        onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ticket Price (ETH)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={eventForm.price}
                        onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                        placeholder="0.1"
                      />
                    </div>
                    <div>
                      <Label>Total Tickets</Label>
                      <Input
                        type="number"
                        value={eventForm.totalSupply}
                        onChange={(e) => setEventForm({...eventForm, totalSupply: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={createEvent}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {isLoading ? 'Creating...' : 'Create Event'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 h-full">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {event.category || 'Event'}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {event.remaining_supply}/{event.total_supply}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">
                    {event.event_name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {event.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.event_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {formatTime(event.event_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-bold">{event.price} ETH</span>
                    </div>
                    
                    {event.remaining_supply > 0 ? (
                      <Button
                        onClick={() => purchaseTicket(event.id, event.price)}
                        disabled={isLoading || !userWallet}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy Ticket
                      </Button>
                    ) : (
                      <Badge variant="secondary">Sold Out</Badge>
                    )}
                  </div>

                  {event.creator_wallet === userWallet && (
                    <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                      <Trophy className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-700">Your Event</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500">Be the first to create an NFT ticketed event!</p>
          </motion.div>
        )}

        {/* My Tickets Section */}
        {userWallet && myTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  My NFT Tickets ({myTickets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          NFT Ticket
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Shield className="w-3 h-3" />
                          Verified
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{ticket.event_name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{ticket.venue}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(ticket.event_date)} at {formatTime(ticket.event_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NFTTicketingSystem;