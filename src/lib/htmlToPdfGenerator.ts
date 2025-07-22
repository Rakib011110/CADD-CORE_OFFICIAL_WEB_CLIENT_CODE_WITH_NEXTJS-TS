// lib/htmlToPdfGenerator.ts
// @ts-ignore
import html2pdf from 'html2pdf.js';

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

export const generateHTMLToPDF = (data: PaymentData): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Create HTML content with proper Bengali font support
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Receipt</title>
          <style>
            @font-face {
              font-family: "banglaFont";
              src: url("/fonts/HindSiliguri-Regular.ttf") format("truetype");
              font-weight: normal;
              font-style: normal;
            }
            
            body {
              font-family: "banglaFont", Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.4;
            }
            
            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border: 1px solid #ddd;
              padding: 30px;
            }
            
            .header {
              text-align: center;
              border-bottom: 2px solid #dc2626;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 5px;
            }
            
            .company-subtitle {
              font-size: 16px;
              color: #666;
              margin-bottom: 10px;
            }
            
            .company-address {
              font-size: 12px;
              color: #888;
              line-height: 1.3;
            }
            
            .receipt-title {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              color: #333;
            }
            
            .receipt-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              padding: 15px;
              background: #f9f9f9;
              border-radius: 5px;
            }
            
            .info-item {
              font-size: 12px;
            }
            
            .info-label {
              font-weight: bold;
              color: #555;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              margin: 20px 0 10px 0;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            
            .student-info, .course-info {
              margin-bottom: 20px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 13px;
            }
            
            .payment-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            
            .payment-table th,
            .payment-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            
            .payment-table th {
              background-color: #dc2626;
              color: white;
              font-weight: bold;
            }
            
            .payment-table .amount {
              text-align: right;
            }
            
            .total-section {
              text-align: right;
              margin-top: 20px;
              font-size: 18px;
              font-weight: bold;
              color: #dc2626;
            }
            
            .footer-notes {
              margin-top: 30px;
              font-size: 11px;
              color: #666;
              line-height: 1.5;
            }
            
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            
            .signature-box {
              text-align: center;
              border-top: 1px solid #333;
              padding-top: 10px;
              width: 200px;
              font-size: 12px;
            }
            
            .bengali-text {
              font-family: "banglaFont", Arial, sans-serif;
            }
            
            @media print {
              body { margin: 0; }
              .receipt-container { border: none; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="company-name">CADD CORE</div>
              <div class="company-subtitle">Training Institute</div>
              <div class="company-address">
                149/A, Baitush Sharaf Complex (2nd Floor)<br>
                Airport Road, Farmgate, Dhaka-1215<br>
                Phone: +880 1611-223631 | +880 1611-223637<br>
                Email: caddcorebd@gmail.com
              </div>
            </div>
            
            <div class="receipt-title">PAYMENT RECEIPT</div>
            
            <div class="receipt-info">
              <div>
                <div class="info-item">
                  <span class="info-label">Receipt No:</span> ${data._id.slice(-8).toUpperCase()}
                </div>
                <div class="info-item">
                  <span class="info-label">Transaction ID:</span> ${data.transactionId}
                </div>
                <div class="info-item">
                  <span class="info-label">Date:</span> ${new Date(data.createdAt).toLocaleDateString('en-GB')}
                </div>
              </div>
              <div>
                <div class="info-item">
                  <span class="info-label">Payment Method:</span> ${data.cardType}
                </div>
                <div class="info-item">
                  <span class="info-label">Card Issuer:</span> ${data.cardIssuer}
                </div>
                <div class="info-item">
                  <span class="info-label">Status:</span> <strong style="color: #22c55e;">COMPLETED</strong>
                </div>
              </div>
            </div>
            
            <div class="section-title">STUDENT INFORMATION</div>
            <div class="student-info">
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="bengali-text">${data.user.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span>${data.user.email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span>${data.user.phone || '  '}</span>
              </div>
            </div>
            
            <div class="section-title">COURSE DETAILS</div>
            <div class="course-info">
              <div class="info-row">
                <span class="info-label">Course:</span>
                <span class="bengali-text">${data.course.title}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Type:</span>
                <span>Professional Training</span>
              </div>
            </div>
            
            <table class="payment-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount (BDT)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="bengali-text">${data.course.title}</td>
                  <td class="amount">${data.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Service Fee</td>
                  <td class="amount">0.00</td>
                </tr>
              </tbody>
            </table>
            
            <div class="total-section">
              TOTAL: ${data.amount.toFixed(2)} BDT
            </div>
            
            <div class="footer-notes">
              <strong>TERMS & CONDITIONS:</strong><br>
              • This receipt is computer generated and valid without signature.<br>
              • Please keep this receipt for your records.<br>
              • For any queries, contact our support team at +880 1611-223637<br>
              • Refund policy applies as per institute guidelines.
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                Student Signature
              </div>
              <div class="signature-box">
                Authorized Signature
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #999;">
              Generated on: ${new Date().toLocaleString()}<br>
              CADD CORE Training Institute - Professional CAD Training
            </div>
          </div>
        </body>
        </html>
      `;

      // Create a temporary div to hold the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Configure html2pdf options
      const opt = {
        margin: 0.5,
        filename: `CADD_CORE_Receipt_${data.transactionId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      // Generate PDF
      html2pdf()
        .from(tempDiv.firstElementChild)
        .set(opt)
        .save()
        .then(() => {
          // Clean up
          document.body.removeChild(tempDiv);
          resolve();
        })
        .catch((error: any) => {
          // Clean up on error
          document.body.removeChild(tempDiv);
          reject(error);
        });

    } catch (error) {
      reject(error);
    }
  });
};
