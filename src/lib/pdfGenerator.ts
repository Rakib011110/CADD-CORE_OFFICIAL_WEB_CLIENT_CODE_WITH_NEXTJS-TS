// lib/pdfGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mapBengaliCourseTitle } from './courseTitleMapping';

interface PaymentData {
  _id: string;
  transactionId: string;
  amount: number;
  createdAt: string;
  cardType: string;
  cardIssuer: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  course: {
    title: string;
  };
}

// Bengali to English transliteration map
const bengaliTransliterationMap: { [key: string]: string } = {
  // Common course-related terms
  'অটোক্যাড': 'AutoCAD',
  'ক্যাড': 'CAD',
  'কোর্স': 'Course',
  'প্রশিক্ষণ': 'Training',
  'ইনস্টিটিউট': 'Institute',
  'সার্টিফিকেট': 'Certificate',
  'ডিজাইন': 'Design',
  'আর্কিটেকচার': 'Architecture',
  'ইঞ্জিনিয়ারিং': 'Engineering',
  'মেকানিক্যাল': 'Mechanical',
  'সিভিল': 'Civil',
  'ইলেকট্রিক্যাল': 'Electrical',
  'স্ট্রাকচারাল': 'Structural',
  
  // Student-related terms
  'ছাত্র': 'Student',
  'ছাত্রী': 'Student',
  'শিক্ষার্থী': 'Student',
  'শিক্ষক': 'Instructor',
  'প্রশিক্ষক': 'Trainer',
  
  // Payment-related terms
  'পেমেন্ট': 'Payment',
  'টাকা': 'BDT',
  '৳': 'BDT',
  'ফি': 'Fee',
  'বেতন': 'Payment',
  
  // Numbers
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  
  // Common words
  'এবং': 'and',
  'বা': 'or',
  'সঙ্গে': 'with',
  'জন্য': 'for',
  'থেকে': 'from',
  'পর্যন্ত': 'to',
  'মাধ্যমে': 'through',
  'দিয়ে': 'with',
  'সাথে': 'with',
  
  // Technical terms
  '3D': '3D',
  '2D': '2D',
  'মডেলিং': 'Modeling',
  'রেন্ডারিং': 'Rendering',
  'ড্রাফটিং': 'Drafting',
  'প্রজেক্ট': 'Project',
  'পোর্টফোলিও': 'Portfolio',
  'সফটওয়্যার': 'Software',
  'টুলস': 'Tools',
  'টেকনোলজি': 'Technology',
  
  // Time-related
  'মাস': 'Month',
  'সপ্তাহ': 'Week',
  'দিন': 'Day',
  'ঘণ্টা': 'Hour',
  'মিনিট': 'Minute',
  
  // Levels
  'বেসিক': 'Basic',
  'এডভান্স': 'Advanced',
  'প্রফেশনাল': 'Professional',
  'ইন্টারমিডিয়েট': 'Intermediate',
  'বিগিনার': 'Beginner',
  
  // Other common terms
  'ভর্তি': 'Admission',
  'নিবন্ধন': 'Registration',
  'সম্পূর্ণ': 'Complete',
  'সফল': 'Successful',
  'ব্যর্থ': 'Failed',
  'চালু': 'Active',
  'বন্ধ': 'Inactive',
  'নতুন': 'New',
  'পুরাতন': 'Old'
};

// Function to transliterate Bengali text to English
export const transliterateBengaliText = (text: string): string => {
  if (!text) return text;
  
  let transliteratedText = text;
  
  // First, replace complete words
  Object.entries(bengaliTransliterationMap).forEach(([bengali, english]) => {
    const regex = new RegExp(bengali, 'g');
    transliteratedText = transliteratedText.replace(regex, english);
  });
  
  // Remove any remaining Bengali characters that weren't mapped
  transliteratedText = transliteratedText.replace(/[\u0980-\u09FF]/g, '');
  
  // Clean up extra spaces
  transliteratedText = transliteratedText.replace(/\s+/g, ' ').trim();
  
  return transliteratedText || text; // Fallback to original if empty
};

// Enhanced PDF generator with better Bengali support
export const generatePaymentReceiptPDF = async (data: PaymentData): Promise<void> => {
  try {
    // Use specific course title mapping for better results
    const safeCourseTitle = mapBengaliCourseTitle(data.course.title) || 'Course Enrollment';
    const safeUserName = transliterateBengaliText(data.user.name) || 'Student';
    
    // Initialize PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set default font to ensure compatibility
    doc.setFont('helvetica', 'normal');
    
    // Header with logo space
    doc.setFontSize(24);
    doc.setTextColor(220, 20, 60); // Crimson color for header
    doc.text('CADD CORE', 105, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text('Training Institute', 105, 32, { align: 'center' });
    
    // Underline
    doc.setLineWidth(0.5);
    doc.setDrawColor(220, 20, 60);
    doc.line(60, 35, 150, 35);
    
    // Address and contact
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('149/A, Baitush Sharaf Complex (2nd Floor)', 105, 42, { align: 'center' });
    doc.text('Airport Road, Farmgate, Dhaka-1215', 105, 47, { align: 'center' });
    doc.text('Phone: +880 1611-223631 | +880 1611-223637', 105, 52, { align: 'center' });
    doc.text('Email: caddcorebd@gmail.com', 105, 57, { align: 'center' });
    
    // Receipt title
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 30);
    doc.text('PAYMENT RECEIPT', 105, 70, { align: 'center' });
    
    // Receipt details box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(15, 80, 180, 30);
    
    // Receipt info
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`Receipt No: ${data._id.slice(-8).toUpperCase()}`, 20, 88);
    doc.text(`Transaction ID: ${data.transactionId}`, 20, 95);
    doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString('en-GB')}`, 20, 102);
    doc.text(`Status: COMPLETED`, 130, 88);
    doc.text(`Payment Method: ${data.cardType}`, 130, 95);
    doc.text(`Card Issuer: ${data.cardIssuer}`, 130, 102);
    
    // Student information section
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('STUDENT INFORMATION', 20, 125);
    
    doc.setDrawColor(220, 20, 60);
    doc.line(20, 127, 80, 127);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${safeUserName}`, 20, 135);
    doc.text(`Email: ${data.user.email}`, 20, 142);
    doc.text(`Phone: ${data.user.phone || 'Not provided'}`, 20, 149);
    
    // Course information section
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('COURSE DETAILS', 20, 165);
    
    doc.setDrawColor(220, 20, 60);
    doc.line(20, 167, 70, 167);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Course: ${safeCourseTitle}`, 20, 175);
   
    
    // Payment details table
    const tableData = [
      ['Description', 'Amount (BDT)'],
      [safeCourseTitle, data.amount.toFixed(2)],
      ['Service Fee', '0.00'],
      ['Discount', '0.00']
    ];
    
    autoTable(doc, {
      startY: 195,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: [220, 20, 60],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [60, 60, 60]
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 50, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Total amount
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.setTextColor(220, 20, 60);
    doc.text('TOTAL AMOUNT:', 120, finalY);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${data.amount.toFixed(2)} BDT`, 175, finalY, { align: 'right' });
    
    // Footer notes
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('TERMS & CONDITIONS:', 20, finalY + 20);
    doc.text('• This receipt is computer generated and valid without signature.', 20, finalY + 27);
    doc.text('• Please keep this receipt for your records.', 20, finalY + 32);
    doc.text('• For any queries, contact our support team.', 20, finalY + 37);
    doc.text('• Refund policy applies as per institute guidelines.', 20, finalY + 42);
    
    // Signature section
    doc.setDrawColor(150, 150, 150);
    doc.line(130, finalY + 50, 180, finalY + 50);
    doc.setFontSize(9);
    doc.text('Authorized Signature', 155, finalY + 55, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Generated on: ' + new Date().toLocaleString(), 105, 285, { align: 'center' });
    doc.text('CADD CORE Training Institute & IT services ', 105, 290, { align: 'center' });
    
    // Save the PDF
    doc.save(`CADD_CORE_Receipt_${data.transactionId}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Alternative simple text-only PDF generator for maximum compatibility
export const generateSimpleReceiptPDF = (data: PaymentData): void => {
  try {
    const doc = new jsPDF();
    
    // Use only basic helvetica font
    doc.setFont('helvetica', 'normal');
    
    // Simple header
    doc.setFontSize(20);
    doc.text('CADD CORE Training Institute', 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('PAYMENT RECEIPT', 105, 35, { align: 'center' });
    
    // Simple details
    doc.setFontSize(12);
    let yPos = 60;
    
    doc.text(`Receipt ID: ${data._id}`, 20, yPos);
    yPos += 10;
    doc.text(`Transaction ID: ${data.transactionId}`, 20, yPos);
    yPos += 10;
    doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 20, yPos);
    yPos += 15;
    
    doc.text(`Student Name: ${transliterateBengaliText(data.user.name)}`, 20, yPos);
    yPos += 10;
    doc.text(`Email: ${data.user.email}`, 20, yPos);
    yPos += 10;
    doc.text(`Phone: ${data.user.phone || 'N/A'}`, 20, yPos);
    yPos += 15;
    
    doc.text(`Course: ${mapBengaliCourseTitle(data.course.title)}`, 20, yPos);
    yPos += 10;
    doc.text(`Amount: ${data.amount.toFixed(2)} BDT`, 20, yPos);
    yPos += 10;
    doc.text(`Payment Method: ${data.cardType} (${data.cardIssuer})`, 20, yPos);
    yPos += 10;
    doc.text(`Status: COMPLETED`, 20, yPos);
    
    // Simple footer
    yPos += 30;
    doc.setFontSize(10);
    doc.text('For support: +880 1611-223637 | caddcorebd@gmail.com', 105, yPos, { align: 'center' });
    
    doc.save(`CADD_CORE_Simple_Receipt_${data.transactionId}.pdf`);
    
  } catch (error) {
    console.error('Error generating simple PDF:', error);
    throw error;
  }
};
