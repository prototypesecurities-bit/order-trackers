import React from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText } from 'lucide-react';
import { Shipment } from '../types/shipment';

interface PDFGeneratorProps {
  shipment: Shipment;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ shipment }) => {
  const generateAWBPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;

    // Draw border around entire document
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Header section with APX logo and AIRWAY BILL
    let yPos = 25;
    
    // APX Logo section (left side)
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200); // Blue for A and P
    doc.text('A', 15, yPos);
    doc.text('P', 35, yPos);
    doc.setTextColor(255, 165, 0); // Orange for X
    doc.text('X', 55, yPos);
    
    // Airplane icon representation
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(20);
    doc.text('✈', 75, yPos - 5);
    
    // Tagline
    doc.setTextColor(0, 100, 200);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.text('Delivering the best', 15, yPos + 10);
    
    doc.setTextColor(220, 20, 60); // Red
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INT. COURIER & CARGO', 15, yPos + 22);

    // AIRWAY BILL title (right side)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AIRWAY BILL', pageWidth - 80, yPos);

    // Barcode representation and consignment number
    yPos += 15;
    doc.setFontSize(8);
    doc.text('||||||||||||||||||||||||||||||||', pageWidth - 80, yPos);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(shipment.consignmentNo, pageWidth - 80, yPos + 10);

    yPos = 70;

    // Main information table
    const tableStartY = yPos;
    const leftColWidth = (pageWidth - 2 * margin) / 2;
    const rightColWidth = (pageWidth - 2 * margin) / 2;
    const rowHeight = 12;

    // Table structure matching the screenshot
    const tableData = [
      { left: "Shipper's Name", leftValue: shipment.shipperName, right: "Consignee Name", rightValue: shipment.consigneeName },
      { left: "Address", leftValue: `${shipment.shipperCity},${shipment.shipperCountry}`, right: "", rightValue: shipment.consigneeAddress },
      { left: "Shipper Email", leftValue: shipment.shipperEmail, right: "", rightValue: `${shipment.consigneeCity}, ${shipment.consigneeCountry}` },
      { left: "City Nr NTN/CNC", leftValue: shipment.cityNrNtnCnc || shipment.shipperPostalCode, right: "Zip Code", rightValue: shipment.zipCode || "000" },
      { left: "Shrepers", leftValue: shipment.shrepers || shipment.shipperPostalCode, right: "City", rightValue: shipment.consigneeCity },
      { left: "Product Det", leftValue: shipment.productDet || shipment.shipperReference, right: "", rightValue: "" }
    ];

    // Draw table rows
    tableData.forEach((row, index) => {
      const currentY = tableStartY + (index * rowHeight);
      
      // Draw horizontal lines
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      // Draw vertical line in middle
      doc.line(margin + leftColWidth, currentY, margin + leftColWidth, currentY + rowHeight);
      
      // Left column
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(row.left, margin + 2, currentY + 8);
      doc.setFont('helvetica', 'normal');
      doc.text(row.leftValue, margin + 50, currentY + 8);
      
      // Right column
      if (row.right) {
        doc.setFont('helvetica', 'bold');
        doc.text(row.right, margin + leftColWidth + 2, currentY + 8);
      }
      if (row.rightValue) {
        doc.setFont('helvetica', 'normal');
        doc.text(row.rightValue, margin + leftColWidth + 50, currentY + 8);
      }
    });

    // Bottom line of main table
    const tableEndY = tableStartY + (tableData.length * rowHeight);
    doc.line(margin, tableEndY, pageWidth - margin, tableEndY);

    // Package details section
    yPos = tableEndY + 10;
    
    // Package details table
    const packageTableY = yPos;
    const colWidths = [25, 25, 35, 25, 25, 35, 20];
    let xPos = margin;

    // Headers
    const headers = ['Pieces', 'Weight', 'Volumetric', 'Dimension', 'Service', 'Fragile', 'Declared Value'];
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    headers.forEach((header, i) => {
      doc.rect(xPos, packageTableY, colWidths[i], 10);
      doc.text(header, xPos + 2, packageTableY + 7);
      xPos += colWidths[i];
    });

    // Values row
    xPos = margin;
    const values = [
      shipment.pieces,
      `${shipment.weight} KG`,
      `${shipment.volumetric || shipment.totalVolumetricWeight} KG`,
      shipment.dimension || '',
      shipment.service,
      shipment.fragile ? 'Yes' : 'No',
      shipment.declaredValue || '0.00'
    ];

    doc.setFont('helvetica', 'normal');
    values.forEach((value, i) => {
      doc.rect(xPos, packageTableY + 10, colWidths[i], 10);
      doc.text(value, xPos + 2, packageTableY + 17);
      xPos += colWidths[i];
    });

    // Description section
    yPos = packageTableY + 25;
    doc.rect(margin, yPos, pageWidth - 2 * margin, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(shipment.description || 'GENTS SHIRTS,LADIES BAGS AND ARTIFICIAL CHAIN', margin + 2, yPos + 8);
    doc.text('CHAIN', margin + 2, yPos + 12);

    // QR Code section (right side)
    const qrX = pageWidth - 60;
    const qrY = packageTableY + 10;
    doc.rect(qrX, qrY, 25, 25);
    
    // QR code pattern (simplified representation)
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if ((i + j) % 2 === 0) {
          doc.rect(qrX + 2 + (i * 4), qrY + 2 + (j * 4), 3, 3, 'F');
        }
      }
    }
    
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('Scan to Track', qrX, qrY + 30);

    // Note section
    yPos += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTE: PLEASE DO NOT ACCEPT, IF THE SHIPMENT IS NOT INTACT.', margin, yPos + 15);

    // Save the PDF
    doc.save(`awb-${shipment.consignmentNo}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Airway Bill (AWB)</h2>
            <p className="text-gray-600">Official shipping document</p>
          </div>
        </div>
        <button
          onClick={generateAWBPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Download className="w-5 h-5" />
          Download AWB
        </button>
      </div>
      
      {/* AWB Preview */}
      <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
        <div className="flex justify-between items-start mb-6">
          {/* APX Logo Section */}
          <div className="flex items-center gap-2">
            <div className="text-4xl font-bold">
              <span className="text-blue-600">A</span>
              <span className="text-blue-600">P</span>
              <span className="text-orange-500">X</span>
              <span className="text-gray-400 ml-2">✈</span>
            </div>
            <div className="ml-2">
              <div className="text-blue-600 italic text-sm">Delivering the best</div>
              <div className="text-red-600 font-bold text-sm">INT. COURIER & CARGO</div>
            </div>
          </div>
          
          {/* Airway Bill Title and Barcode */}
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">AIRWAY BILL</h1>
            <div className="font-mono text-lg">||||||||||||||||||||||||||||||||</div>
            <div className="font-bold text-xl">{shipment.consignmentNo}</div>
          </div>
        </div>

        {/* Main Information Table */}
        <div className="border border-gray-400 mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 w-1/4">Shipper's Name</td>
                <td className="border-r border-gray-400 p-2 w-1/4">{shipment.shipperName}</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 w-1/4">Consignee Name</td>
                <td className="p-2 w-1/4">{shipment.consigneeName}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">Address</td>
                <td className="border-r border-gray-400 p-2">{shipment.shipperCity},{shipment.shipperCountry}</td>
                <td className="border-r border-gray-400 p-2 bg-gray-100"></td>
                <td className="p-2">{shipment.consigneeAddress}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">Shipper Email</td>
                <td className="border-r border-gray-400 p-2">{shipment.shipperEmail}</td>
                <td className="border-r border-gray-400 p-2 bg-gray-100"></td>
                <td className="p-2">{shipment.consigneeCity}, {shipment.consigneeCountry}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">City Nr NTN/CNC</td>
                <td className="border-r border-gray-400 p-2">{shipment.cityNrNtnCnc}</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">Zip Code</td>
                <td className="p-2">{shipment.zipCode}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">Shrepers</td>
                <td className="border-r border-gray-400 p-2">{shipment.shrepers}</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">City</td>
                <td className="p-2">{shipment.consigneeCity}</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100">Product Det</td>
                <td className="border-r border-gray-400 p-2">{shipment.productDet}</td>
                <td className="border-r border-gray-400 p-2 bg-gray-100"></td>
                <td className="p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Package Details Table */}
        <div className="border border-gray-400 mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 text-center">Pieces</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 text-center">Weight</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 text-center">Volumetric</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 text-center">Dimension</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 text-center">Service</td>
                <td className="border-r border-gray-400 p-2 font-bold bg-gray-100 text-center">Fragile</td>
                <td className="p-2 font-bold bg-gray-100 text-center">Declared Value</td>
              </tr>
              <tr className="border-t border-gray-400">
                <td className="border-r border-gray-400 p-2 text-center">{shipment.pieces}</td>
                <td className="border-r border-gray-400 p-2 text-center">{shipment.weight} KG</td>
                <td className="border-r border-gray-400 p-2 text-center">{shipment.volumetric || shipment.totalVolumetricWeight} KG</td>
                <td className="border-r border-gray-400 p-2 text-center">{shipment.dimension}</td>
                <td className="border-r border-gray-400 p-2 text-center">{shipment.service}</td>
                <td className="border-r border-gray-400 p-2 text-center">{shipment.fragile ? 'Yes' : 'No'}</td>
                <td className="p-2 text-center">{shipment.declaredValue}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Description Section */}
        <div className="border border-gray-400 p-3 mb-4 min-h-[40px]">
          <div className="text-sm">{shipment.description}</div>
        </div>

        {/* QR Code and Note Section */}
        <div className="flex justify-between items-end">
          <div className="text-sm font-bold">
            NOTE: PLEASE DO NOT ACCEPT, IF THE SHIPMENT IS NOT INTACT.
          </div>
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-gray-400 flex items-center justify-center mb-1">
              <div className="text-xs">QR</div>
            </div>
            <div className="text-xs">Scan to Track</div>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Consignment Number:</span>
            <span className="font-mono font-bold ml-2">{shipment.consignmentNo}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <span className="ml-2 font-semibold">{shipment.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFGenerator;