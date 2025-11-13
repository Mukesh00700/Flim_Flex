import QRCode from 'qrcode';
import crypto from 'crypto';

/**
 * Generate ticket ID
 * Format: FLX-YYYYMMDD-XXXXX
 */
export const generateTicketId = (bookingId) => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `FLX-${dateStr}-${bookingId}-${random}`;
};

/**
 * Generate QR code for ticket
 * @param {Object} ticketData - Ticket information
 * @returns {Promise<string>} Base64 encoded QR code image
 */
export const generateTicketQRCode = async (ticketData) => {
  try {
    const qrData = JSON.stringify({
      ticketId: ticketData.ticketId,
      bookingId: ticketData.bookingId,
      userId: ticketData.userId,
      showId: ticketData.showId,
      seats: ticketData.seats,
      verificationCode: ticketData.verificationCode
    });

    // Generate QR code as base64 data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

/**
 * Generate verification code for ticket
 * 6-digit alphanumeric code
 */
export const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

/**
 * Format date and time for ticket
 */
export const formatShowDateTime = (showTime) => {
  const date = new Date(showTime);
  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  return { date: dateStr, time: timeStr };
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};

/**
 * Generate ticket HTML for email
 */
export const generateTicketHTML = (ticketData) => {
  const { date, time } = formatShowDateTime(ticketData.showTime);
  const amount = formatCurrency(ticketData.totalAmount);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 650px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .ticket-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          margin: 20px 0;
        }
        .ticket-header {
          text-align: center;
          color: white;
          margin-bottom: 30px;
        }
        .ticket-header h1 {
          margin: 0;
          font-size: 36px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .ticket-header p {
          margin: 5px 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .ticket-content {
          background-color: white;
          border-radius: 15px;
          padding: 30px;
          margin: 20px 0;
        }
        .ticket-id {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 20px;
          letter-spacing: 2px;
        }
        .movie-info {
          border-bottom: 2px dashed #ddd;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .movie-title {
          font-size: 28px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .info-item {
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        .info-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }
        .info-value {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
        .seats-section {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 10px;
          margin: 20px 0;
        }
        .seats-label {
          color: white;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .seats-value {
          color: white;
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 2px;
        }
        .qr-section {
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 10px;
          margin: 20px 0;
        }
        .qr-code {
          max-width: 200px;
          margin: 20px auto;
          display: block;
        }
        .verification-code {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 3px;
          margin-top: 15px;
        }
        .amount-section {
          text-align: center;
          padding: 20px;
          background-color: #28a745;
          color: white;
          border-radius: 10px;
          margin: 20px 0;
        }
        .amount-label {
          font-size: 14px;
          margin-bottom: 5px;
        }
        .amount-value {
          font-size: 32px;
          font-weight: bold;
        }
        .instructions {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .instructions h3 {
          margin-top: 0;
          color: #856404;
        }
        .instructions ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .instructions li {
          margin: 5px 0;
          color: #856404;
        }
        .footer {
          text-align: center;
          color: white;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid rgba(255,255,255,0.2);
        }
        .footer p {
          margin: 5px 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 15px;
          background-color: #28a745;
          color: white;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          margin: 10px 0;
        }
        @media (max-width: 600px) {
          .info-grid {
            grid-template-columns: 1fr;
          }
          .movie-title {
            font-size: 22px;
          }
          .ticket-id {
            font-size: 18px;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket-container">
        <div class="ticket-header">
          <h1>🎬 FilmFlex</h1>
          <p>Your Movie Ticket</p>
          <span class="status-badge">✓ CONFIRMED</span>
        </div>

        <div class="ticket-content">
          <div class="ticket-id">
            ${ticketData.ticketId}
          </div>

          <div class="movie-info">
            <div class="movie-title">${ticketData.movieTitle}</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Date</div>
              <div class="info-value">${date}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Time</div>
              <div class="info-value">${time}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Theater</div>
              <div class="info-value">${ticketData.theaterName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Screen</div>
              <div class="info-value">${ticketData.hallName}</div>
            </div>
          </div>

          <div class="seats-section">
            <div class="seats-label">YOUR SEATS</div>
            <div class="seats-value">${ticketData.seats.join(', ')}</div>
          </div>

          <div class="qr-section">
            <div class="info-label">Scan at Theater</div>
            <img src="${ticketData.qrCode}" alt="QR Code" class="qr-code">
            <div class="info-label">Verification Code</div>
            <div class="verification-code">${ticketData.verificationCode}</div>
          </div>

          <div class="amount-section">
            <div class="amount-label">Total Amount Paid</div>
            <div class="amount-value">${amount}</div>
          </div>

          <div class="instructions">
            <h3>📋 Important Instructions</h3>
            <ul>
              <li>Please arrive at the theater 15 minutes before showtime</li>
              <li>Present this ticket (QR code) at the entrance for scanning</li>
              <li>Carry a valid ID proof for verification</li>
              <li>Outside food and beverages are not allowed</li>
              <li>This ticket is non-transferable and non-refundable</li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <p><strong>Booking ID:</strong> #${ticketData.bookingId}</p>
          <p><strong>Booked on:</strong> ${new Date(ticketData.bookingTime).toLocaleString('en-US')}</p>
          <p style="margin-top: 20px;">© 2025 FilmFlex. All rights reserved.</p>
          <p>For support, contact: support@filmflex.com</p>
        </div>
      </div>

      <div style="text-align: center; color: #666; padding: 20px; font-size: 12px;">
        <p>This is an automated email. Please do not reply.</p>
        <p>Save this email for your records. You may need to show it at the theater.</p>
      </div>
    </body>
    </html>
  `;
};

export default {
  generateTicketId,
  generateTicketQRCode,
  generateVerificationCode,
  formatShowDateTime,
  formatCurrency,
  generateTicketHTML
};
