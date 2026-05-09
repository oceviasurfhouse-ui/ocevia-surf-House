import express from 'express';
import sgMail from '@sendgrid/mail';
import validator from 'validator';
import rateLimit from 'express-rate-limit';

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

router.post('/send-booking-confirmation', emailLimiter, async (req, res) => {
  try {
    const { name, email, room, days, price, bookingId } = req.body;

    // Validation
    if (!name || !email || !room || !days || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #1e90ff;">🌊 Booking Confirmation</h1>
            <p>Hi <strong>${validator.escape(name)}</strong>,</p>
            <p>Thank you for booking with OCEVIA Surf House! Here's your confirmation:</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Booking ID:</strong> ${validator.escape(bookingId)}</p>
              <p><strong>Room Type:</strong> ${validator.escape(room)}</p>
              <p><strong>Duration:</strong> ${days} days</p>
              <p><strong>Total Price:</strong> €${price}</p>
            </div>
            
            <p>Next steps:</p>
            <ol>
              <li>Complete payment via our secure Stripe checkout</li>
              <li>Receive check-in details 48 hours before arrival</li>
              <li>Pack your board and get ready to shred! 🏄</li>
            </ol>
            
            <p>Questions? Reply to this email or visit our website.</p>
            <p>Best regards,<br><strong>OCEVIA Team</strong></p>
          </div>
        </body>
      </html>
    `;

    await sgMail.send({
      to: validator.normalizeEmail(email),
      from: process.env.EMAIL_FROM,
      subject: '🌊 Your OCEVIA Booking Confirmation',
      html: htmlContent
    });

    res.json({ success: true, message: 'Confirmation email sent' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
