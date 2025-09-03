import React from 'react';
import { jsPDF } from 'jspdf';
import { Download, FileText } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverEmail: string;
  receiverAddress: string;
  packageType: string;
  weight: string;
  dimensions: string;
  value: string;
  serviceType: string;
  specialInstructions: string;
  status: string;
  createdAt: string;
}

interface PDFGeneratorProps {
  shipment: Shipment;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ shipment }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPosition = 30;

    // Header with logo placeholder and company info
    doc.setFillColor(236, 32, 39); // #ec2027
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('THE XPERT COURIER', margin, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Courier Services', margin, 32);

    // Reset text color
    doc.setTextColor(0, 0, 0);
    yPosition = 60;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AIRWAY BILL', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Tracking number
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Tracking Number: ${shipment.trackingNumber}`, margin + 5, yPosition + 5);
    yPosition += 25;

    // Sender and Receiver sections
    const sectionWidth = (pageWidth - 3 * margin) / 2;
    
    // Sender section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SENDER INFORMATION', margin, yPosition);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 2, margin + sectionWidth, yPosition + 2);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const senderInfo = [
      `Name: ${shipment.senderName}`,
      `Phone: ${shipment.senderPhone}`,
      `Email: ${shipment.senderEmail}`,
      `Address: ${shipment.senderAddress}`
    ];

    senderInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += 6;
    });

    // Receiver section
    let receiverY = 105;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEIVER INFORMATION', margin + sectionWidth + margin, receiverY);
    doc.line(margin + sectionWidth + margin, receiverY + 2, pageWidth - margin, receiverY + 2);
    receiverY += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const receiverInfo = [
      `Name: ${shipment.receiverName}`,
      `Phone: ${shipment.receiverPhone}`,
      `Email: ${shipment.receiverEmail}`,
      `Address: ${shipment.receiverAddress}`
    ];

    receiverInfo.forEach(info => {
      doc.text(info, margin + sectionWidth + margin, receiverY);
      receiverY += 6;
    });

    yPosition = Math.max(yPosition, receiverY) + 10;

    // Package details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PACKAGE DETAILS', margin, yPosition);
    doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const packageInfo = [
      `Package Type: ${shipment.packageType}`,
      `Weight: ${shipment.weight} kg`,
      `Dimensions: ${shipment.dimensions} cm`,
      `Declared Value: $${shipment.value}`,
      `Service Type: ${shipment.serviceType.replace('-', ' ').toUpperCase()}`,
      `Status: ${shipment.status}`,
      `Created: ${new Date(shipment.createdAt).toLocaleString()}`
    ];

    packageInfo.forEach(info => {
      doc.text(info, margin, yPosition);
      yPosition += 6;
    });

    if (shipment.specialInstructions) {
      yPosition += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Special Instructions:', margin, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const instructions = doc.splitTextToSize(shipment.specialInstructions, pageWidth - 2 * margin);
      doc.text(instructions, margin, yPosition);
      yPosition += instructions.length * 6;
    }

    // Footer
    yPosition = doc.internal.pageSize.height - 40;
    doc.setFillColor(236, 32, 39);
    doc.rect(0, yPosition, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Contact: info@thexpertcourier.com | Track online at thexpertcourier.com', 
             pageWidth / 2, yPosition + 15, { align: 'center' });
    doc.text('Thank you for choosing The Xpert Courier!', 
             pageWidth / 2, yPosition + 25, { align: 'center' });

    // Save the PDF
    doc.save(`airway-bill-${shipment.trackingNumber}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Airway Bill</h2>
            <p className="text-gray-600">Download the official shipping document</p>
          </div>
        </div>
        <button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>
      
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tracking Number:</span>
            <span className="font-mono font-bold ml-2">{shipment.trackingNumber}</span>
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