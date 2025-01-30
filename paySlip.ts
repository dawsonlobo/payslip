const PDFDocument = require('pdfkit');
const fs = require('fs');

function generatePayslip() {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4'
  });

  doc.pipe(fs.createWriteStream('payslip.pdf'));

  // Company Header
  doc.image('city.png', 50, 40, { width: 60, height: 60 })
    .fontSize(16)
    .text('Demo Company', 150, 45)
    .fontSize(10)
    .text('Bhubhalay,Double Trouble', 150, 65)
    .text('Bengaluru, Karnataka, IN - 560048', 150, 80);

  // Add line after company header
  doc.moveTo(50, 110)
     .lineTo(doc.page.width - 50, 110)
     .stroke('#D3D3D3');

  // Payslip Title
  doc.fontSize(14)
    .text('Payslip for the month of Apr, 2020', 50, 120, {
      align: 'center',
      width: doc.page.width - 100
    });

  // Add line after title
  doc.moveTo(50, 140)
     .lineTo(doc.page.width - 50, 140)
     .stroke('#D3D3D3');

  // Employee Information
  const leftColumnX = 50;
  const rightColumnX = 300;
  let currentY = 160;

  const leftColumnInfo = [
    { label: 'Name:', value: 'Sachin Tendulkar' },
    { label: 'Designation:', value: 'Co-Founder' },
    { label: 'Department:', value: 'Co-Founder' },
    { label: 'Location:', value: 'Bengaluru' },
    { label: 'LOP:', value: '0.0' }
  ];

  const rightColumnInfo = [
    { label: 'Employee ID:', value: 'BTPL/001' },
    { label: 'Bank Name:', value: 'Andhra Bank' },
    { label: 'Bank Account Number:', value: '23232322' },
    { label: 'PAN:', value: 'XXXXX0000X' }
  ];

  // Draw left column
  doc.fontSize(10);
  leftColumnInfo.forEach((item, index) => {
    // Add line above each row except first
    if (index > 0) {
      doc.moveTo(50, currentY - 5)
         .lineTo(doc.page.width - 50, currentY - 5)
         .stroke('#D3D3D3');
    }
    
    doc.text(item.label, leftColumnX, currentY, { width: 80 })
       .text(item.value, leftColumnX + 85, currentY);
    currentY += 25;
  });

  // Draw right column
  currentY = 160;
  rightColumnInfo.forEach(item => {
    doc.text(item.label, rightColumnX, currentY, { width: 120 })
       .text(item.value, rightColumnX + 125, currentY);
    currentY += 25;
  });

  // Add line after employee info (stop the line between left and right columns)
  currentY = 285;
  doc.moveTo(50, currentY)
     .lineTo(doc.page.width - 50, currentY)
     .stroke('#D3D3D3');

  // Earnings and Deductions Headers
  currentY += 20;
  doc.fontSize(12);
  
  // Left side headers
  doc.text('Earnings', leftColumnX, currentY)
     .text('Amount', leftColumnX + 180, currentY);
  
  // Right side headers
  doc.text('Deductions', rightColumnX, currentY)
     .text('Amount', rightColumnX + 140, currentY);

  currentY += 15;

  // Add lines under headers
  doc.moveTo(leftColumnX, currentY)
     .lineTo(leftColumnX + 200, currentY)
     .stroke('#D3D3D3');
  doc.moveTo(rightColumnX, currentY)
     .lineTo(rightColumnX + 200, currentY)
     .stroke('#D3D3D3');

  currentY += 10;

  // Earnings Data
  const earnings = [
    { description: 'Basic', amount: '83,333.50' },
    { description: 'HRA', amount: '41,666.75' },
    { description: 'Telephone Reimbursements', amount: '0.83' },
    { description: 'Bonus', amount: '0.00' },
    { description: 'LTA', amount: '0.00' },
    { description: 'Special Allowance', amount: '29,667.00' }
  ];

  // Deductions Data
  const deductions = [
    { description: 'Income Tax', amount: '31,444.84' },
    { description: 'Provident Fund', amount: '1,800.00' },
    { description: 'Professional Tax', amount: '200.00' }
  ];

  // Draw Earnings with lines
  let earningsY = currentY;
  earnings.forEach((item, index) => {
    // Add line above each row except first
    if (index > 0) {
      doc.moveTo(leftColumnX, earningsY - 5)
         .lineTo(leftColumnX + 200, earningsY - 5)
         .stroke('#D3D3D3');
    }
    
    doc.fontSize(10)
       .text(item.description, leftColumnX, earningsY, { width: 160 })
       .text(`₹${item.amount}`, leftColumnX + 180, earningsY);
    earningsY += 25;
  });

  // Draw Deductions with lines
  let deductionsY = currentY;
  deductions.forEach((item, index) => {
    // Add line above each row except first
    if (index > 0) {
      doc.moveTo(rightColumnX, deductionsY - 5)
         .lineTo(rightColumnX + 200, deductionsY - 5)
         .stroke('#D3D3D3');
    }
    
    doc.text(item.description, rightColumnX, deductionsY, { width: 120 })
       .text(`₹${item.amount}`, rightColumnX + 140, deductionsY);
    deductionsY += 25;
  });

  // Add line before totals
  currentY = 480;
  doc.moveTo(50, currentY)
     .lineTo(doc.page.width - 50, currentY)
     .stroke('#D3D3D3');

  // Totals
  currentY += 15;
  doc.fontSize(11)
    .text('Total Earnings:', leftColumnX, currentY)
    .text(`₹154,668.08`, leftColumnX + 180, currentY)
    .text('Total Deductions:', rightColumnX, currentY)
    .text(`₹33,444.84`, rightColumnX + 140, currentY);

  // Add line before net pay
  currentY += 30;
  doc.moveTo(50, currentY)
     .lineTo(doc.page.width - 50, currentY)
     .stroke('#D3D3D3');

  // Net Pay
  currentY += 15;
  doc.fontSize(12)
    .text('Net Pay for the month: ₹119,423.24', {
      //width: doc.page.width - 100,
      //align: 'center'
    });

  // Add line before footer
  currentY += 30;
  doc.moveTo(50, currentY)
     .lineTo(doc.page.width - 50, currentY)
     .stroke('#D3D3D3');

  // Footer
  doc.fontSize(10)
    .moveDown(2)
    .text('This is a system-generated payslip and does not require a signature.', {
      //align: 'center',
      // width: doc.page.width - 100
    })
    .moveDown(0.5)
    .text('Generated by Asanify', {
      //align: 'center',
      //width: doc.page.width - 100
    });

  doc.end();
}

generatePayslip();
