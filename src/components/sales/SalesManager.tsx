
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const SalesManager = ({ userId, onUpdate }) => {
  const [salesData, setSalesData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [buyersData, setBuyersData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    pricePerUnit: '',
    buyerName: '',
    buyerLocation: '',
    buyerPhone: '',
    buyerEmail: ''
  });

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = () => {
    const sales = JSON.parse(localStorage.getItem(`sales_${userId}`) || '[]');
    const stock = JSON.parse(localStorage.getItem(`stock_${userId}`) || '[]');
    const buyers = JSON.parse(localStorage.getItem(`buyers_${userId}`) || '[]');
    
    setSalesData(sales);
    setStockData(stock);
    setBuyersData(buyers);
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

    // Auto-fill price when product is selected
    if (name === 'productId') {
      const selectedProduct = stockData.find(item => item.id.toString() === value);
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          pricePerUnit: selectedProduct.sellingPrice.toString()
        }));
      }
    }
  };

  const handleBuyerSelect = (buyerName) => {
    const buyer = buyersData.find(b => b.name === buyerName);
    if (buyer) {
      setFormData(prev => ({
        ...prev,
        buyerName: buyer.name,
        buyerLocation: buyer.location || '',
        buyerPhone: buyer.phone || '',
        buyerEmail: buyer.email || ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.quantity || !formData.pricePerUnit) {
      toast.error('Please fill in required fields');
      return;
    }

    const selectedProduct = stockData.find(item => item.id.toString() === formData.productId);
    const quantity = parseInt(formData.quantity);
    const pricePerUnit = parseFloat(formData.pricePerUnit);

    if (quantity > selectedProduct.quantity) {
      toast.error('Insufficient stock quantity');
      return;
    }

    // Create sale record
    const newSale = {
      id: Date.now(),
      productId: parseInt(formData.productId),
      productName: selectedProduct.productName,
      category: selectedProduct.category,
      quantity,
      unit: selectedProduct.unit,
      pricePerUnit,
      totalPrice: quantity * pricePerUnit,
      buyerName: formData.buyerName,
      buyerLocation: formData.buyerLocation,
      buyerPhone: formData.buyerPhone,
      buyerEmail: formData.buyerEmail,
      saleDate: new Date().toISOString()
    };

    // Update stock quantity
    const updatedStock = stockData.map(item => {
      if (item.id.toString() === formData.productId) {
        return { ...item, quantity: item.quantity - quantity };
      }
      return item;
    });

    // Save buyer if not exists
    if (formData.buyerName && !buyersData.find(b => b.name === formData.buyerName)) {
      const newBuyer = {
        id: Date.now(),
        name: formData.buyerName,
        location: formData.buyerLocation,
        phone: formData.buyerPhone,
        email: formData.buyerEmail,
        createdAt: new Date().toISOString()
      };
      const updatedBuyers = [...buyersData, newBuyer];
      setBuyersData(updatedBuyers);
      localStorage.setItem(`buyers_${userId}`, JSON.stringify(updatedBuyers));
    }

    // Save data
    const updatedSales = [...salesData, newSale];
    setSalesData(updatedSales);
    setStockData(updatedStock);
    localStorage.setItem(`sales_${userId}`, JSON.stringify(updatedSales));
    localStorage.setItem(`stock_${userId}`, JSON.stringify(updatedStock));
    
    // Reset form
    setFormData({
      productId: '',
      quantity: '',
      pricePerUnit: '',
      buyerName: '',
      buyerLocation: '',
      buyerPhone: '',
      buyerEmail: ''
    });
    
    setShowAddForm(false);
    onUpdate();
    toast.success('Sale recorded successfully');
  };

  const handleDelete = (id) => {
    const updatedSales = salesData.filter(sale => sale.id !== id);
    setSalesData(updatedSales);
    localStorage.setItem(`sales_${userId}`, JSON.stringify(updatedSales));
    onUpdate();
    toast.success('Sale deleted');
  };

  const filteredSales = salesData.filter(sale => {
    return sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sale.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sale.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalSalesValue = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
          <p className="text-gray-600">Record and track your sales transactions</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {/* Record Sale Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product/Service *</Label>
                <Select onValueChange={(value) => handleSelectChange('productId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {stockData.filter(item => item.quantity > 0).map(item => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.productName} (Available: {item.quantity} {item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit *</Label>
                <Input
                  id="pricePerUnit"
                  name="pricePerUnit"
                  type="number"
                  step="0.01"
                  value={formData.pricePerUnit}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  value={(parseFloat(formData.quantity || '0') * parseFloat(formData.pricePerUnit || '0')).toFixed(2)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name</Label>
                <div className="relative">
                  <Input
                    id="buyerName"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    placeholder="Enter buyer name"
                    list="buyers-list"
                  />
                  <datalist id="buyers-list">
                    {buyersData.map(buyer => (
                      <option key={buyer.id} value={buyer.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerLocation">Buyer Location</Label>
                <Input
                  id="buyerLocation"
                  name="buyerLocation"
                  value={formData.buyerLocation}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Buyer Phone</Label>
                <Input
                  id="buyerPhone"
                  name="buyerPhone"
                  value={formData.buyerPhone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Buyer Email</Label>
                <Input
                  id="buyerEmail"
                  name="buyerEmail"
                  type="email"
                  value={formData.buyerEmail}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Record Sale</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
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
              placeholder="Search by product, buyer, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Sales Summary</h3>
              <p className="text-sm text-gray-600">Total transactions: {filteredSales.length}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                ${totalSalesValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sales Records ({filteredSales.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/Unit</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{sale.productName}</TableCell>
                    <TableCell>{sale.category}</TableCell>
                    <TableCell>{sale.quantity} {sale.unit}</TableCell>
                    <TableCell>${sale.pricePerUnit.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">${sale.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sale.buyerName || 'N/A'}</div>
                        {sale.buyerPhone && (
                          <div className="text-sm text-gray-500">{sale.buyerPhone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(sale.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSales.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No sales records found. Record your first sale to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManager;