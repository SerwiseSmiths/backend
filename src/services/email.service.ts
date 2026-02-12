import * as crypto from "crypto";
const nodemailer = require("nodemailer");

class EmailService {
  private transporter: any = null;
  private adminEmail: string;

  constructor() {
    this.adminEmail = process.env.PAYMENT_VERIFICATION_EMAIL || "";
  }

  /**
   * Lazy initialize transporter
   */
  private getTransporter(): any {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: this.adminEmail,
          pass: process.env.EMAIL_APP_PASSWORD || "",
        },
      });
    }
    return this.transporter;
  }

  /**
   * Generate a secure verification token
   */
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Send payment verification email to admin
   */
  async sendPaymentVerificationEmail(
    complaintId: string,
    customerName: string,
    amount: number,
    verificationToken: string
  ): Promise<void> {
    const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/v2/payment/verify/${verificationToken}`;
    const rejectUrl = `${baseUrl}/api/v2/payment/reject/${verificationToken}`;

    const upiAddress = process.env.UPI_PAYMENT_ADDRESS || "N/A";

    const mailOptions = {
      from: this.adminEmail,
      to: this.adminEmail,
      subject: `Payment Verification Required - Complaint #${complaintId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #22C55E; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .info-box { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #22C55E; }
            .button { display: inline-block; padding: 12px 24px; margin: 10px 5px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .verify-btn { background-color: #22C55E; color: white; }
            .reject-btn { background-color: #EF4444; color: white; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Verification Request</h1>
            </div>
            <div class="content">
              <p>Hello Admin,</p>
              <p>A customer has claimed to have made a payment. Please verify the payment details below:</p>
              
              <div class="info-box">
                <strong>Complaint ID:</strong> ${complaintId}<br>
                <strong>Customer Name:</strong> ${customerName}<br>
                <strong>Amount:</strong> ₹${amount.toFixed(2)}<br>
                <strong>UPI Address:</strong> ${upiAddress}<br>
                <strong>Request Time:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </div>

              <p><strong>Action Required:</strong></p>
              <p>Please check your UPI account for the payment. If the payment is confirmed:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" class="button verify-btn">✓ VERIFY PAYMENT</a>
                <a href="${rejectUrl}" class="button reject-btn">✗ REJECT REQUEST</a>
              </div>

              <p style="color: #666; font-size: 14px;">
                <strong>Note:</strong> Clicking VERIFY will mark the complaint as COMPLETED and notify the customer. 
                Clicking REJECT will keep the complaint in PAYMENT status and customer will need to retry.
              </p>
            </div>
            <div class="footer">
              <p>ServiceSmith Admin Panel</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.getTransporter().sendMail(mailOptions);
      console.log(`Payment verification email sent for complaint ${complaintId}`);
    } catch (error) {
      console.error("Error sending payment verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }
}

export default new EmailService();
