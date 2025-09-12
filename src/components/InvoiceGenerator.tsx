import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText, Edit, Save, X, Plus } from 'lucide-react';
import { Shipment, InvoiceItem } from '../types/shipment';

interface InvoiceGeneratorProps {
  shipment: Shipment;
  onClose: () => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ shipment, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableItems, setEditableItems] = useState<InvoiceItem[]>(shipment.invoiceItems);

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setEditableItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      if (field === 'quantity' || field === 'price') {
        updated[index].total = updated[index].quantity * updated[index].price;
      }
      
      return updated;
    });
  };

  const addItem = () => {
    setEditableItems(prev => [...prev, { description: '', code: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    if (editableItems.length > 1) {
      setEditableItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const generateInvoicePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Draw border around entire document
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    let yPos = 25;

    // Header section with Air Waybill Number and Invoice Type
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('AIR WAYBILL NUMBER:', margin, yPos);
    doc.text(shipment.consignmentNo, margin + 60, yPos);
    
    // Invoice type on the right
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.invoiceType, pageWidth - margin - 50, yPos, { align: 'right' });

    yPos += 20;

    // Main information table - Shipper's and Receiver's Details
    doc.setLineWidth(0.5);
    
    // Header row
    doc.rect(margin, yPos, (pageWidth - 2 * margin) / 2, 15);
    doc.rect(margin + (pageWidth - 2 * margin) / 2, yPos, (pageWidth - 2 * margin) / 2, 15);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("SHIPPER'S DETAILS", margin + 5, yPos + 10);
    doc.text("RECEIVER'S DETAILS", margin + (pageWidth - 2 * margin) / 2 + 5, yPos + 10);

    yPos += 15;

    // Shipper details rows
    const shipperDetails = [
      { label: 'Name:', value: shipment.shipperName },
      { label: 'Address:', value: `${shipment.shipperAddress}` },
      { label: 'Country:', value: `${shipment.shipperCity}` },
      { label: 'Phone:', value: `${shipment.shipperCountry}` },
      { label: '', value: shipment.shipperPhone || '03138574510' }
    ];

    const receiverDetails = [
      { label: 'Name:', value: shipment.consigneeName },
      { label: 'Address:', value: shipment.consigneeAddress },
      { label: 'City:', value: shipment.consigneeCity },
      { label: 'Country:', value: shipment.consigneeCountry },
      { label: 'Phone:', value: shipment.consigneePhone }
    ];

    // Draw shipper and receiver details
    for (let i = 0; i < Math.max(shipperDetails.length, receiverDetails.length); i++) {
      const rowHeight = 12;
      
      // Left column (Shipper)
      doc.rect(margin, yPos, (pageWidth - 2 * margin) / 2, rowHeight);
      if (shipperDetails[i]) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(shipperDetails[i].label, margin + 3, yPos + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(shipperDetails[i].value, margin + 25, yPos + 8);
      }
      
      // Right column (Receiver)
      doc.rect(margin + (pageWidth - 2 * margin) / 2, yPos, (pageWidth - 2 * margin) / 2, rowHeight);
      if (receiverDetails[i]) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(receiverDetails[i].label, margin + (pageWidth - 2 * margin) / 2 + 3, yPos + 8);
        doc.setFont('helvetica', 'normal');
        doc.text(receiverDetails[i].value, margin + (pageWidth - 2 * margin) / 2 + 25, yPos + 8);
      }
      
      yPos += rowHeight;
    }

    yPos += 10;

    // Product Details Section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PRODUCT DETAILS', margin, yPos);
    yPos += 15;

    // Product details table
    const tableHeaders = ['S. No.', 'Particulars / Item Description', 'HS Code', 'Unit of Measure', 'Quantity', 'Unit Price (USD)'];
    const colWidths = [20, 70, 25, 30, 25, 35];
    let xPos = margin;

    // Draw table headers
    doc.setFillColor(240, 240, 240);
    tableHeaders.forEach((header, i) => {
      doc.rect(xPos, yPos, colWidths[i], 12, 'F');
      doc.rect(xPos, yPos, colWidths[i], 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(header, xPos + 2, yPos + 8);
      xPos += colWidths[i];
    });

    yPos += 12;

    // Draw table rows
    doc.setFont('helvetica', 'normal');
    editableItems.forEach((item, index) => {
      xPos = margin;
      const rowHeight = 12;
      
      // Draw row borders
      colWidths.forEach(width => {
        doc.rect(xPos, yPos, width, rowHeight);
        xPos += width;
      });
      
      // Fill row data
      xPos = margin;
      doc.text((index + 1).toString(), xPos + 2, yPos + 8);
      xPos += colWidths[0];
      doc.text(item.description, xPos + 2, yPos + 8);
      xPos += colWidths[1];
      doc.text(item.code, xPos + 2, yPos + 8);
      xPos += colWidths[2];
      doc.text('pieces', xPos + 2, yPos + 8);
      xPos += colWidths[3];
      doc.text(item.quantity.toString(), xPos + 2, yPos + 8);
      xPos += colWidths[4];
      doc.text(item.price.toFixed(2), xPos + 2, yPos + 8);
      
      yPos += rowHeight;
    });

    // WPX ITEMS row
    xPos = margin;
    const wpxRowHeight = 12;
    doc.rect(xPos, yPos, colWidths[0] + colWidths[1], wpxRowHeight);
    doc.setFont('helvetica', 'bold');
    doc.text('WPX ITEMS', xPos + 2, yPos + 8);
    
    xPos += colWidths[0] + colWidths[1];
    doc.rect(xPos, yPos, colWidths[2], wpxRowHeight);
    doc.text(`Total weight ${shipment.weight || '7.000'} KG (+ca)`, xPos + 2, yPos + 8);
    
    xPos += colWidths[2] + colWidths[3] + colWidths[4];
    doc.rect(xPos, yPos, colWidths[5], wpxRowHeight);
    const totalAmount = editableItems.reduce((sum, item) => sum + item.total, 0);
    doc.text(totalAmount.toFixed(2), xPos + 2, yPos + 8);

    yPos += wpxRowHeight + 20;

    // Undertaking section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('UNDERTAKING', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const undertakingText1 = `I under sign Undertake full responsibility of my parcel # ${shipment.consignmentNo}. I do not contain any contraband items, Narcotics or if IATA Restricted items, and assure that my parcel contents, and declared value and proof of payment is true.`;
    const undertakingText2 = 'In case of any declarations or discrepancy and any Duty/Taxes at the destination, if nr topaid by the consignee, or is subject to the sole responsibility of under sign.';
    
    const splitText1 = doc.splitTextToSize(undertakingText1, pageWidth - 2 * margin);
    const splitText2 = doc.splitTextToSize(undertakingText2, pageWidth - 2 * margin);
    
    doc.text(splitText1, margin, yPos);
    yPos += splitText1.length * 5 + 10;
    doc.text(splitText2, margin, yPos);

    // Save the PDF
    doc.save(`invoice-${shipment.consignmentNo}.pdf`);
  };

  const totalAmount = editableItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Invoice Generator</h2>
            <p className="text-gray-600">Air Waybill Number: {shipment.consignmentNo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? 'Save Changes' : 'Edit Invoice'}
          </button>
          <button
            onClick={generateInvoicePDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Preview matching the screenshot format */}
      <div className="bg-white border-2 border-gray-800 rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="grid grid-cols-2 border-b-2 border-gray-800">
          <div className="border-r-2 border-gray-800 p-4">
            <div className="font-bold text-sm">AIR WAYBILL NUMBER: {shipment.consignmentNo}</div>
          </div>
          <div className="p-4 text-right">
            <div className="font-bold text-lg">{shipment.invoiceType}</div>
          </div>
        </div>

        {/* Shipper's and Receiver's Details */}
        <div className="grid grid-cols-2 border-b-2 border-gray-800">
          <div className="border-r-2 border-gray-800 p-4">
            <div className="font-bold text-sm mb-2 bg-gray-100 p-2">SHIPPER'S DETAILS</div>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Name:</span> {shipment.shipperName}</div>
              <div><span className="font-medium">Address:</span> {shipment.shipperAddress}</div>
              <div><span className="font-medium">Country:</span> {shipment.shipperCity}</div>
              <div><span className="font-medium">Phone:</span> {shipment.shipperCountry}</div>
              <div className="ml-12">{shipment.shipperPhone || '03138574510'}</div>
            </div>
          </div>
          <div className="p-4">
            <div className="font-bold text-sm mb-2 bg-gray-100 p-2">RECEIVER'S DETAILS</div>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Name:</span> {shipment.consigneeName}</div>
              <div><span className="font-medium">Address:</span> {shipment.consigneeAddress}</div>
              <div><span className="font-medium">City:</span> {shipment.consigneeCity}</div>
              <div><span className="font-medium">Country:</span> {shipment.consigneeCountry}</div>
              <div><span className="font-medium">Phone:</span> {shipment.consigneePhone}</div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="border-b-2 border-gray-800">
          <div className="font-bold text-sm p-4 bg-gray-100">PRODUCT DETAILS</div>
          
          {/* Product Details Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">S. No.</th>
                  <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">Particulars / Item Description</th>
                  <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">HS Code</th>
                  <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">Unit of Measure</th>
                  <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">Quantity</th>
                  <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">Unit Price (USD)</th>
                  {isEditing && (
                    <th className="border border-gray-400 px-3 py-2 text-xs font-bold text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {editableItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-3 py-2 text-sm text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-400 px-3 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="GENTS SHIRTS"
                        />
                      ) : (
                        <span className="text-sm">{item.description}</span>
                      )}
                    </td>
                    <td className="border border-gray-400 px-3 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.code}
                          onChange={(e) => handleItemChange(index, 'code', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="62052000"
                        />
                      ) : (
                        <span className="text-sm">{item.code}</span>
                      )}
                    </td>
                    <td className="border border-gray-400 px-3 py-2 text-sm text-center">
                      pieces
                    </td>
                    <td className="border border-gray-400 px-3 py-2 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                        />
                      ) : (
                        <span className="text-sm">{item.quantity}</span>
                      )}
                    </td>
                    <td className="border border-gray-400 px-3 py-2 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                        />
                      ) : (
                        <span className="text-sm">{item.price.toFixed(2)}</span>
                      )}
                    </td>
                    {isEditing && (
                      <td className="border border-gray-400 px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={editableItems.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                
                {/* WPX ITEMS Row */}
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 px-3 py-2 font-bold text-sm" colSpan={2}>
                    WPX ITEMS
                  </td>
                  <td className="border border-gray-400 px-3 py-2 text-sm">
                    Total weight {shipment.weight || '7.000'} KG (+ca)
                  </td>
                  <td className="border border-gray-400 px-3 py-2"></td>
                  <td className="border border-gray-400 px-3 py-2"></td>
                  <td className="border border-gray-400 px-3 py-2 text-center font-bold">
                    {totalAmount.toFixed(2)}
                  </td>
                  {isEditing && <td className="border border-gray-400 px-3 py-2"></td>}
                </tr>
              </tbody>
            </table>
          </div>

          {isEditing && (
            <div className="p-4 border-t">
              <button
                onClick={addItem}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>
          )}
        </div>

        {/* Undertaking Section */}
        <div className="p-4">
          <div className="font-bold text-sm mb-3">UNDERTAKING</div>
          <div className="text-xs leading-relaxed space-y-2">
            <p>
              I under sign Undertake full responsibility of my parcel # {shipment.consignmentNo}. I do not contain any contraband items, Narcotics or if IATA Restricted items, and assure that my parcel contents, and declared value and proof of payment is true.
            </p>
            <p>
              In case of any declarations or discrepancy and any Duty/Taxes at the destination, if nr topaid by the consignee, or is subject to the sole responsibility of under sign.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
        >
          Close
        </button>
        <button
          onClick={generateInvoicePDF}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;