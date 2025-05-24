import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';

const categories = [
  'Drinks', 'Food', 'Electronics', 'Repair', 'Hair', 
  'Clothes', 'Shoes', 'Motor Vehicles', 'General Service', 'Others'
];

const units = ['kg', 'litres', 'Number'];

const StockManager = ({ userId, onUpdate }) => {
  const [stockData, setStockData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    supplierName: '',
    supplierPhone: '',
    supplierEmail: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    unit: 'Number'
  });

  useEffect(() => {
    loadStockData();
  }, [userId]);

  const loadStockData = () => {
    const data = JSON.parse(localStorage.getItem(`stock_${userId}`) || '[]');
    setStockData(data);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.category || !formData.supplierName || 
        !formData.buyingPrice || !formData.sellingPrice || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newStock = {
      id: Date.now(),
      ...formData,
      buyingPrice: parseFloat(formData.buyingPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      entryDate: new Date().toISOString()
    };

    const updatedStock = [...stockData, newStock];
    setStockData(updatedStock);
    localStorage.setItem(`stock_${userId}`, JSON.stringify(updatedStock));
    
    // Reset form
    setFormData({
      productName: '',
      category: '',
      supplierName: '',
      supplierPhone: '',
      supplierEmail: '',
      buyingPrice: '',
      sellingPrice: '',
      quantity: '',
      unit: 'Number'
    });
    
    setShowAddForm(false);
    onUpdate();
    toast.success('Stock item added successfully');
  };

  const handleDelete = (id) => {
    const updatedStock = stockData.filter(item => item.id !== id);
    setStockData(updatedStock);
    localStorage.setItem(`stock_${userId}`, JSON.stringify(updatedStock));
    onUpdate();
    toast.success('Stock item deleted');
  };

  const filteredStock = stockData.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stock Management</h2>
          <p className="text-gray-600">Manage your inventory and track stock levels</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stock
        </Button>
      </div>

      {/* Add Stock Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Stock Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product/Service Name *</Label>
                <Input
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => handleSelectChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name *</Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleInputChange}
                  placeholder="Enter supplier name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierPhone">Supplier Phone</Label>
                <Input
                  id="supplierPhone"
                  name="supplierPhone"
                  value={formData.supplierPhone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierEmail">Supplier Email</Label>
                <Input
                  id="supplierEmail"
                  name="supplierEmail"
                  type="email"
                  value={formData.supplierEmail}
                  onChange={handleInputChange}
                  placeholder="Enter email (optional)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyingPrice">Buying Price *</Label>
                <Input
                  id="buyingPrice"
                  name="buyingPrice"
                  type="number"
                  step="0.01"
                  value={formData.buyingPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price *</Label>
                <Input
                  id="sellingPrice"
                  name="sellingPrice"
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="flex-1"
                    required
                  />
                  <Select onValueChange={(value) => handleSelectChange('unit', value)} defaultValue="Number">
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Add Stock Item</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by product or supplier name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-categories">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Stock Items ({filteredStock.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Buy Price</TableHead>
                  <TableHead>Sell Price</TableHead>
                  <TableHead>Stock Value</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.map((item) => (
                  <TableRow key={item.id} className={item.quantity <= 5 ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.supplierName}</div>
                        {item.supplierPhone && (
                          <div className="text-sm text-gray-500">{item.supplierPhone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={item.quantity <= 5 ? 'text-red-600 font-semibold' : ''}>
                        {item.quantity} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>${item.buyingPrice.toFixed(2)}</TableCell>
                    <TableCell>${item.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.sellingPrice).toFixed(2)}</TableCell>
                    <TableCell>{new Date(item.entryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredStock.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No stock items found. Add your first stock item to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockManager;