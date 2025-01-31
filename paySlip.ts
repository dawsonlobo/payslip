import PDFDocument from "pdfkit";
import * as fs from "fs";
import { WriteStream } from "fs";

interface PayslipInfo {
  employeeInfo: EmployeeInfo;
  earnings: EarningDeduction[];
  deductions: EarningDeduction[];
  totals: {
    totalEarnings: string;
    totalDeductions: string;
    netPay: string;
  };
}

interface EmployeeInfo {
  name: string;
  designation: string;
  department: string;
  location: string;
  lop: string;
  employeeId: string;
  bankName: string;
  accountNumber: string;
  pan: string;
}

interface EarningDeduction {
  item: string;
  amount: string;
}

class PayslipGenerator {
  private readonly doc: PDFKit.PDFDocument;
  private readonly leftColStart: number = 70;
  private readonly leftColEnd: number = 290;
  private readonly rightColStart: number = 320;
  private readonly rightColEnd: number = 540;
  private readonly titleMarginTop: number = 100; // Space for title
  private readonly logoMarginTop: number = 120; // Space for logo
  private readonly lightLineColor: string = "#E5E5E5";
  private readonly darkLineColor: string = "#000000";
  private readonly margin: number = 50;
  private readonly pageWidth: number = 595; // A4 width in points
  private readonly pageHeight: number = 851; // A4 height in points
  private readonly contentWidth: number = 495;

  constructor() {
    this.doc = new PDFDocument({
      margin: this.margin,
      size: "A4",
    });
  }

  private drawLeftSeparator(y: number): void {
    this.doc
      .strokeColor(this.lightLineColor)
      .moveTo(this.leftColStart, y)
      .lineTo(this.leftColEnd, y)
      .stroke();
  }

  private drawRightSeparator(y: number): void {
    this.doc
      .strokeColor(this.lightLineColor)
      .moveTo(this.rightColStart, y)
      .lineTo(this.rightColEnd, y)
      .stroke();
  }

  private drawFullSeparator(y: number): void {
    this.doc
      .strokeColor(this.lightLineColor)
      .moveTo(this.margin, y)
      .lineTo(this.margin + this.contentWidth, y)
      .stroke();
  }
  private drawPageBorder(): void {
    const x = this.margin;
    const y = this.margin - 20;
    const width = this.pageWidth - this.margin * 2;
    const height = this.pageHeight - this.margin * 2;

    // Draw the border around the page
    this.doc.rect(x, y, width, height).stroke();
  }

  private formatAmount(amount: string): string {
    return `₹${amount}`;
  }

  // private addRsImage(x: number, y: number): void {
  //   const imagePath = 'rupee.png'; // replace with the path to your image file
  //   this.doc.image(imagePath, x, y, { width: 12, height: 12 }); // Adjust width and height as needed
  // }

  private addRsImage(x: number, y: number): number {
    const imagePath = "rupee.png"; // Path to your image
    const imageWidth = 12; // Adjust width as per your image size
    const imageHeight = 12; // Adjust height as per your image size

    // Place the image
    this.doc.image(imagePath, x, y, { width: imageWidth, height: imageHeight });

    // Define space after image to avoid overlap with the amount
    const spaceAfterImage = 3; // Adjust this space as needed to avoid overlap

    // Return the new x position for the rupee amount text
    return x + imageWidth + spaceAfterImage;
  }

  public generate(): void {
    const writeStream: WriteStream = fs.createWriteStream("payslip.pdf");
    this.doc.pipe(writeStream);
    this.drawPageBorder();
    const payslipData: PayslipInfo = {
      employeeInfo: {
        name: "Sachin Tendulkar",
        designation: "Co-Founder",
        department: "Co-Founder",
        location: "Bengaluru",
        lop: "0.0",
        employeeId: "BTPL/001",
        bankName: "Andhra Bank",
        accountNumber: "23232322",
        pan: "XXXXX0000X",
      },

      earnings: [
        { item: "Basic", amount: "83,333.50" },
        { item: "HRA", amount: "41,666.75" },
        { item: "Telephone Reimbursements", amount: "0.83" },
        { item: "Bonus", amount: "0.00" },
        { item: "LTA", amount: "0.00" },
        { item: "Special Allowance", amount: "29,667.00" },
      ],
      deductions: [
        { item: "Income Tax", amount: "31,444.84" },
        { item: "Provident Fund", amount: "1,800.00" },
        { item: "Professional Tax", amount: "200.00" },
      ],
      totals: {
        totalEarnings: "154,668.08",
        totalDeductions: "33,444.84",
        netPay: "119,423.24",
      },
    };
    // Format the amount with the ₹ symbol and commas
    // Format the amount with the ₹ symbol and commas
    // Format the amount with ₹ symbol using Unicode
    this.doc.font("Helvetica");

    // Example: Adding a border around the Earnings section
    // const logoX = 20; // Adjust this value to move the logo from the left border
    // const logoY = 20;
    // Header
    this.doc.image("city.png", this.margin, 30, { width: 70, height: 70 });
    this.doc
      .fontSize(16)
      .text("Demo Company", 150, 40)
      .fontSize(10)
      .text("Bhubhalay, Double Trouble", 150, 60)
      .text("Bengaluru, Karnataka, IN - 560048", 150, 75);

    this.drawFullSeparator(100);

    // Title
    this.doc
      .fontSize(12)
      .text("Payslip for the month of Apr, 2020", this.margin, 115, {
        width: this.contentWidth,
        align: "center",
      });

    this.drawFullSeparator(135);

    // Employee Information
    let startY = 155;
    const labelWidth = 100;
    this.doc.fontSize(10);

    // // Left Column Info
    // [
    //   ['Name:', payslipData.employeeInfo.name],
    //   ['Designation:', payslipData.employeeInfo.designation],
    //   ['Department:', payslipData.employeeInfo.department],
    //   ['Location:', payslipData.employeeInfo.location],
    //   ['LOP:', payslipData.employeeInfo.lop]
    // ].forEach((item, index) => {
    //   const y = startY + (index * 25);
    //   this.doc
    //     .text(item[0], this.leftColStart, y)
    //     .text(item[1], this.leftColStart + labelWidth, y);
    //   this.drawLeftSeparator(y + 15);
    // });
    // Employee Information (Left Column)
    [
      ["Name:", payslipData.employeeInfo.name],
      ["Designation:", payslipData.employeeInfo.designation],
      ["Department:", payslipData.employeeInfo.department],
      ["Location:", payslipData.employeeInfo.location],
      ["LOP:", payslipData.employeeInfo.lop],
    ].forEach((item, index) => {
      const y = startY + index * 35;
      this.doc
        .text(item[0], this.leftColStart, y)
        .text(item[1], this.leftColStart + labelWidth + 10, y);

      if (item[0] === "LOP:") {
        // Add a large gap after LOP
        this.doc.moveDown(4); // Adds a visual gap
        this.doc
          .strokeColor("#d3d3d3") // Light gray color for the line
          .lineWidth(0.5) // Thin line width
          .moveTo(this.leftColStart, y + 60)
          .lineTo(this.doc.page.width - 40, y + 60) // Fixed padding of 40
          .stroke();
        this.drawFullSeparator(y + 60); // Draw a full separator line after the gap
      } else {
        this.drawLeftSeparator(y + 15);
      }
    });

    // Right Column Info
    [
      ["Employee ID:", payslipData.employeeInfo.employeeId],
      ["Bank Name:", payslipData.employeeInfo.bankName],
      ["Bank Account Number:", payslipData.employeeInfo.accountNumber],
      ["PAN:", payslipData.employeeInfo.pan],
    ].forEach((item, index) => {
      const y = startY + index * 35;
      this.doc
        .text(item[0], this.rightColStart, y)
        .text(item[1], this.rightColStart + labelWidth + 20, y);
      this.drawRightSeparator(y + 15);
    });

    // Earnings & Deductions Section
    startY = 360;
    this.drawFullSeparator(startY);

    // Headers
    this.doc
      .fontSize(11)
      .text("Earnings", this.leftColStart, startY + 20)
      .text("Amount", this.leftColStart + 150, startY + 20)
      .text("Deductions", this.rightColStart, startY + 20)
      .text("Amount", this.rightColStart + 150, startY + 20);
    this.drawFullSeparator(startY);
    this.drawLeftSeparator(startY + 40);
    this.drawRightSeparator(startY + 40);

    // Earnings Items
    startY = 410;
    payslipData.earnings.forEach((earning, index) => {
      const y = startY + index * 35;
      // this.doc
      //   .text(earning.item, this.leftColStart, y)
      //   this.addRsImage(this.leftColStart + 150, y);
      //   this.doc.text(`${earning.amount}`, this.leftColStart + 150, y);
      // Draw the earning item text
      this.doc.text(earning.item, this.leftColStart, y);

      // Add the image and calculate the new x-position for the amount
      const updatedX = this.addRsImage(this.leftColStart + 150, y);

      // Place the amount text using the new x position
      this.doc.text(`${earning.amount}`, updatedX, y);
      if (earning.item === "Special Allowance") {
        this.doc.moveDown(2); // Move down by 2 lines to create a gap
      }
      if (index < payslipData.earnings.length - 1) {
        this.drawLeftSeparator(y + 15);
      }
      // if (index === payslipData.earnings.length - 1) {
      //   // Add one line after the last earning item
      //   this.drawFullSeparator(y + 25);
      // }
    });

    // Deductions Items
    payslipData.deductions.forEach((deduction, index) => {
      const y = startY + index * 35;
      this.doc.text(deduction.item, this.rightColStart, y);
      const updatedX = this.addRsImage(this.rightColStart + 150, y);
      this.doc.text(`${deduction.amount}`, updatedX, y);
      if (index < payslipData.deductions.length - 1) {
        this.drawRightSeparator(y + 15);
      }
    });

    // Totals
    startY = 620;
    this.drawFullSeparator(startY);
    this.doc
      .fontSize(11)
      .text("Total Earnings:", this.leftColStart, startY + 20);

    // Add rupee symbol and amount for total earnings
    const totalEarningsX = this.addRsImage(
      this.leftColStart + 150,
      startY + 20
    );
    this.doc.text(
      `${payslipData.totals.totalEarnings}`,
      totalEarningsX,
      startY + 20
    );

    this.doc.text("Total Deductions:", this.rightColStart, startY + 20);

    // Add rupee symbol and amount for total deductions
    const totalDeductionsX = this.addRsImage(
      this.rightColStart + 150,
      startY + 20
    );
    this.doc.text(
      `${payslipData.totals.totalDeductions}`,
      totalDeductionsX,
      startY + 20
    );

    // Net Pay
    startY = 670;
    this.doc
      .fontSize(11)
      .text("Net Pay for the month:", this.leftColStart, startY + 20);

    // Add rupee symbol and amount for net pay
    const netPayX = this.addRsImage(this.leftColStart + 150, startY + 20);
    this.doc.text(`${payslipData.totals.netPay}`, netPayX, startY + 20);

    // Footer
    startY = 710;
    this.drawFullSeparator(startY);
    this.doc
      .fontSize(10)
      .text(
        "This is a system-generated payslip and does not require a signature.",
        this.margin,
        startY + 20,
        {
          width: this.contentWidth,
          align: "center",
        }
      )
      .text("Generated by Asanify", this.margin, startY + 40, {
        width: this.contentWidth,
        align: "center",
      });
    this.doc
      .fontSize(10)
      .text(
        "For more details, log on to asanify.com",
        this.margin,
        startY + 60,
        {
          width: this.contentWidth,
          align: "center",
        }
      );
    this.doc.end();
  }
}

// Generate payslip
const generator = new PayslipGenerator();
generator.generate();
