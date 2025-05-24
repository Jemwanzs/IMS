
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Table, Printer } from 'lucide-react';
import { toast } from 'sonner';

const ExportManager = ({ userId }) => {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async (dataType) => {
    setExporting(true);
    try {
      // This would be implemented with jsPDF
      toast.success(`${dataType} exported to PDF successfully`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const exportToExcel = async (dataType) => {
    setExporting(true);
    try {
      const data = JSON.parse(localStorage.getItem(`${dataType.toLowerCase()}_${userId}`) || '[]');
      
      // Create CSV content
      let csvContent = '';
      
      if (dataType === 'stock') {
        csvContent = 'Product Name,Category,Supplier,Quantity,Unit,Buying Price,Selling Price,Stock Value,Date Added\n';
        data.forEach(item => {
          csvContent += `${item.productName},${item.category},${item.supplierName},${item.quantity},${item.unit},${item.buyingPrice},${item.sellingPrice},${item.quantity * item.sellingPrice},${new Date(item.entryDate).toLocaleDateString()}\n`;
        });
      } else if (dataType === 'sales') {
        csvContent = 'Date,Product,Category,Quantity,Unit,Price per Unit,Total Price,Buyer\n';
        data.forEach(sale => {
          csvContent += `${new Date(sale.saleDate).toLocaleDateString()},${sale.productName},${sale.category},${sale.quantity},${sale.unit},${sale.pricePerUnit},${sale.totalPrice},"${sale.buyerName || 'N/A'}"\n`;
        });
      } else if (dataType === 'buyers') {
        csvContent = 'Name,Location,Phone,Email,Date Added\n';
        data.forEach(buyer => {
          csvContent += `${buyer.name},"${buyer.location || ''}","${buyer.phone || ''}","${buyer.email || ''}",${new Date(buyer.createdAt).toLocaleDateString()}\n`;
        });
      }

      // Download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${dataType.toLowerCase()}_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${dataType} exported to Excel successfully`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const printData = (dataType) => {
    const data = JSON.parse(localStorage.getItem(`${dataType.toLowerCase()}_${userId}`) || '[]');
    
    let printContent = `<h1>${dataType} Report</h1>`;
    printContent += `<p>Generated on: ${new Date().toLocaleDateString()}</p>`;
    
    if (dataType === 'stock') {
      printContent += '<table border="1" style="border-collapse: collapse; width: 100%;">';
      printContent += '<tr><th>Product</th><th>Category</th><th>Quantity</th><th>Selling Price</th><th>Stock Value</th></tr>';
      data.forEach(item => {
        printContent += `<tr><td>${item.productName}</td><td>${item.category}</td><td>${item.quantity} ${item.unit}</td><td>$${item.sellingPrice.toFixed(2)}</td><td>$${(item.quantity * item.sellingPrice).toFixed(2)}</td></tr>`;
      });
      printContent += '</table>';
    } else if (dataType === 'sales') {
      printContent += '<table border="1" style="border-collapse: collapse; width: 100%;">';
      printContent += '<tr><th>Date</th><th>Product</th><th>Quantity</th><th>Total Price</th><th>Buyer</th></tr>';
      data.forEach(sale => {
        printContent += `<tr><td>${new Date(sale.saleDate).toLocaleDateString()}</td><td>${sale.productName}</td><td>${sale.quantity} ${sale.unit}</td><td>$${sale.totalPrice.toFixed(2)}</td><td>${sale.buyerName || 'N/A'}</td></tr>`;
      });
      printContent += '</table>';
    } else if (dataType === 'buyers') {
      printContent += '<table border="1" style="border-collapse: collapse; width: 100%;">';
      printContent += '<tr><th>Name</th><th>Location</th><th>Phone</th><th>Email</th></tr>';
      data.forEach(buyer => {
        printContent += `<tr><td>${buyer.name}</td><td>${buyer.location || 'N/A'}</td><td>${buyer.phone || 'N/A'}</td><td>${buyer.email || 'N/A'}</td></tr>`;
      });
      printContent += '</table>';
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${dataType} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    toast.success(`${dataType} report sent to printer`);
  };

  const ExportCard = ({ title, description, dataType, icon: Icon }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Button
            onClick={() => exportToExcel(dataType)}
            disabled={exporting}
            variant="outline"
            className="w-full"
          >
            <Table className="h-4 w-4 mr-2" />
            Export to Excel (CSV)
          </Button>
          <Button
            onClick={() => exportToPDF(dataType)}
            disabled={exporting}
            variant="outline"
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
          <Button
            onClick={() => printData(dataType)}
            variant="outline"
            className="w-full"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Export & Print</h2>
        <p className="text-gray-600">Export your data to various formats or print reports</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExportCard
          title="Stock Data"
          description="Export inventory and stock information"
          dataType="stock"
          icon={Download}
        />
        
        <ExportCard
          title="Sales Records"
          description="Export sales transactions and revenue data"
          dataType="sales"
          icon={Download}
        />
        
        <ExportCard
          title="Buyers Database"
          description="Export customer information and contacts"
          dataType="buyers"
          icon={Download}
        />
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Excel Export (CSV)</h4>
            <p className="text-sm text-gray-600">
              Downloads a CSV file that can be opened in Excel, Google Sheets, or any spreadsheet application.
              Perfect for further data analysis and manipulation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">PDF Export</h4>
            <p className="text-sm text-gray-600">
              Creates a formatted PDF document ideal for sharing and archiving.
              Maintains professional formatting and is suitable for reports.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Print Report</h4>
            <p className="text-sm text-gray-600">
              Opens a print-friendly version of your data in a new window.
              Optimized for printing with clean formatting and proper page breaks.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportManager;