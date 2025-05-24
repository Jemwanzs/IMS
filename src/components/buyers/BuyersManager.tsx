import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Trash2, Users, Edit } from 'lucide-react';
import { toast } from 'sonner';

const BuyersManager = ({ userId }) => {
  const [buyersData, setBuyersData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadBuyersData();
  }, [userId]);

  const loadBuyersData = () => {
    const data = JSON.parse(localStorage.getItem(`buyers_${userId}`) || '[]');
    setBuyersData(data);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to check if a buyer with the same email or phone already exists
  const checkBuyerExists = (phone, email) => {
    // If both phone and email are empty, don't check
    if (!phone && !email) return false;
    
    return buyersData.some(buyer => {
      // If editing existing buyer, exclude it from the check
      if (editingBuyer && buyer.id === editingBuyer.id) return false;
      
      // Check for matching phone or email (if provided)
      const phoneMatch = phone && buyer.phone && buyer.phone === phone;
      const emailMatch = email && buyer.email && buyer.email.toLowerCase() === email.toLowerCase();
      
      return phoneMatch || emailMatch;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Buyer name is required');
      return;
    }

    // Check if either phone or email is provided for validation
    if (!formData.phone && !formData.email) {
      toast.warning('Please provide either a phone number or email for identification');
      return;
    }

    // Check for duplicate phone or email
    if (checkBuyerExists(formData.phone, formData.email)) {
      toast.error('A buyer with this phone number or email already exists');
      return;
    }

    if (editingBuyer) {
      // Update existing buyer
      const updatedBuyers = buyersData.map(buyer =>
        buyer.id === editingBuyer.id ? { ...buyer, ...formData } : buyer
      );
      setBuyersData(updatedBuyers);
      localStorage.setItem(`buyers_${userId}`, JSON.stringify(updatedBuyers));
      toast.success('Buyer updated successfully');
      setEditingBuyer(null);
    } else {
      // Add new buyer
      const newBuyer = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };

      const updatedBuyers = [...buyersData, newBuyer];
      setBuyersData(updatedBuyers);
      localStorage.setItem(`buyers_${userId}`, JSON.stringify(updatedBuyers));
      toast.success('Buyer added successfully');
    }
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      phone: '',
      email: ''
    });
    
    setShowAddForm(false);
  };

  const handleEdit = (buyer) => {
    setEditingBuyer(buyer);
    setFormData({
      name: buyer.name,
      location: buyer.location || '',
      phone: buyer.phone || '',
      email: buyer.email || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    const updatedBuyers = buyersData.filter(buyer => buyer.id !== id);
    setBuyersData(updatedBuyers);
    localStorage.setItem(`buyers_${userId}`, JSON.stringify(updatedBuyers));
    toast.success('Buyer deleted');
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingBuyer(null);
    setFormData({
      name: '',
      location: '',
      phone: '',
      email: ''
    });
  };

  const filteredBuyers = buyersData.filter(buyer => {
    return buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (buyer.location && buyer.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
           (buyer.phone && buyer.phone.includes(searchTerm)) ||
           (buyer.email && buyer.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Buyers Management</h2>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Buyer
        </Button>
      </div>

      {/* Add/Edit Buyer Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBuyer ? 'Edit Buyer' : 'Add New Buyer'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Buyer Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter buyer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">
                  {editingBuyer ? 'Update Buyer' : 'Add Buyer'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search buyers by name, location, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buyers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Buyers Database ({filteredBuyers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuyers.map((buyer) => (
                  <TableRow key={buyer.id}>
                    <TableCell className="font-medium">{buyer.name}</TableCell>
                    <TableCell>{buyer.location || 'N/A'}</TableCell>
                    <TableCell>{buyer.phone || 'N/A'}</TableCell>
                    <TableCell>{buyer.email || 'N/A'}</TableCell>
                    <TableCell>{new Date(buyer.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(buyer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(buyer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredBuyers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No buyers found. Add your first buyer to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuyersManager;   