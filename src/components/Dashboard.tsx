import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, ShoppingCart, Users, TrendingUp, Plus, FileText, Download } from 'lucide-react';
import StockManager from './stock/StockManager';
import SalesManager from './sales/SalesManager';
import BuyersManager from './buyers/BuyersManager';
import ExportManager from './export/ExportManager';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalStock: 0,
    totalSales: 0,
    totalBuyers: 0,
    lowStockItems: 0
  });

  useEffect(() => {
    // Apply user's color scheme
    if (user.colorScheme) {
      document.documentElement.style.setProperty('--primary-color', user.colorScheme.primary);
      document.documentElement.style.setProperty('--secondary-color', user.colorScheme.secondary);
    }
    
    updateStats();
  }, [user]);

  const updateStats = () => {
    const stockData = JSON.parse(localStorage.getItem(`stock_${user.id}`) || '[]');
    const salesData = JSON.parse(localStorage.getItem(`sales_${user.id}`) || '[]');
    const buyersData = JSON.parse(localStorage.getItem(`buyers_${user.id}`) || '[]');

    const totalStockValue = stockData.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
    const totalSalesValue = salesData.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const lowStockItems = stockData.filter(item => item.quantity <= 5).length;

    setStats({
      totalStock: totalStockValue,
      totalSales: totalSalesValue,
      totalBuyers: buyersData.length,
      lowStockItems
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">StockFlow Pro</h1>
                <p className="text-sm text-gray-500">{user.businessName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="buyers">Buyers</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Stock Value"
                value={`$${stats.totalStock.toLocaleString()}`}
                icon={Package}
                color="text-blue-600"
                subtitle="Current inventory value"
              />
              <StatCard
                title="Total Sales"
                value={`$${stats.totalSales.toLocaleString()}`}
                icon={TrendingUp}
                color="text-green-600"
                subtitle="All-time sales"
              />
              <StatCard
                title="Total Buyers"
                value={stats.totalBuyers}
                icon={Users}
                color="text-purple-600"
                subtitle="Registered customers"
              />
              <StatCard
                title="Low Stock Alert"
                value={stats.lowStockItems}
                icon={ShoppingCart}
                color="text-red-600"
                subtitle="Items below 5 units"
              />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab('stock')}
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                  >
                    <Plus className="h-6 w-6" />
                    Add New Stock
                  </Button>
                  <Button
                    onClick={() => setActiveTab('sales')}
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    Record Sale
                  </Button>
                  <Button
                    onClick={() => setActiveTab('export')}
                    className="h-20 flex flex-col gap-2"
                    variant="outline"
                  >
                    <Download className="h-6 w-6" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Account Information</h3>
                    <div className="mt-2 space-y-1 text-sm text-blue-800">
                      <p><strong>Business:</strong> {user.businessName}</p>
                      <p><strong>Owner:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Theme:</strong> {user.colorScheme.name}</p>
                      <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <StockManager userId={user.id} onUpdate={updateStats} />
          </TabsContent>

          <TabsContent value="sales">
            <SalesManager userId={user.id} onUpdate={updateStats} />
          </TabsContent>

          <TabsContent value="buyers">
            <BuyersManager userId={user.id} />
          </TabsContent>

          <TabsContent value="export">
            <ExportManager userId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;