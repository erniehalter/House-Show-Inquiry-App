import nodemailer from "nodemailer";

interface InquiryRequest {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
  eventType: string;
  notes: string;
  price: string;
  distanceTier: string;
  travelInfo: string;
}

const guestEmailTemplate = (firstName: string, eventType: string, city: string, state: string, price: string, notes: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #111827;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 700;
    }
    .content {
      padding: 2rem;
    }
    .greeting {
      font-size: 1.25rem;
      margin-bottom: 1.5rem;
      color: #111827;
    }
    .details-section {
      background-color: #f3f4f6;
      border-left: 4px solid #4f46e5;
      padding: 1.25rem;
      margin: 1.5rem 0;
      border-radius: 0.375rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
      width: 40%;
    }
    .detail-value {
      color: #111827;
      word-break: break-word;
      text-align: right;
      width: 60%;
    }
    .price-highlight {
      background-color: #e0e7ff;
      color: #4f46e5;
      font-weight: 700;
      font-size: 1.5rem;
      padding: 1rem;
      border-radius: 0.375rem;
      text-align: center;
      margin: 1.5rem 0;
    }
    .footer-text {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }
    .signature {
      color: #111827;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Inquiry Received</h1>
    </div>
    <div class="content">
      <div class="greeting">Hi ${firstName},</div>

      <p>Thank you for submitting your booking inquiry! We received your information and have calculated an estimated price for your event.</p>

      <div class="details-section">
        <div class="detail-row">
          <span class="detail-label">Event Type:</span>
          <span class="detail-value">${eventType}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${city}, ${state}</span>
        </div>
        ${notes ? `
        <div class="detail-row">
          <span class="detail-label">Your Notes:</span>
          <span class="detail-value">${notes}</span>
        </div>
        ` : ''}
      </div>

      <div class="price-highlight">
        Estimated Price: ${price}
      </div>

      <p style="font-size: 0.875rem; color: #6b7280; margin: 1rem 0;">
        <em>This estimate includes travel costs for continental US locations.</em>
      </p>

      <p>Ernie will review your inquiry and get back to you shortly to discuss next steps, confirm availability, and answer any questions you may have.</p>

      <div class="signature">
        <p>Best regards,<br>
        <strong>Ernie Halter</strong><br>
        <em>Musician & Performer</em></p>
      </div>

      <div class="footer-text">
        <p>If you have any questions or need to provide additional information, feel free to reply to this email or contact us directly.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const ernieEmailTemplate = (firstName: string, lastName: string, email: string, city: string, state: string, eventType: string, price: string, notes: string, distanceTier: string, travelInfo: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #111827;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 1.875rem;
      font-weight: 700;
    }
    .content {
      padding: 2rem;
    }
    .section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #111827;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 0.5rem;
    }
    .details-box {
      background-color: #f9fafb;
      border-left: 4px solid #4f46e5;
      padding: 1.25rem;
      margin: 1rem 0;
      border-radius: 0.375rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
    }
    .detail-label {
      font-weight: 600;
      color: #374151;
      width: 35%;
    }
    .detail-value {
      color: #111827;
      word-break: break-word;
      text-align: right;
      width: 65%;
    }
    .price-box {
      background-color: #e0e7ff;
      color: #4f46e5;
      font-weight: 700;
      font-size: 1.25rem;
      padding: 1rem;
      border-radius: 0.375rem;
      text-align: center;
      margin: 1rem 0;
    }
    .reply-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 1rem;
      margin: 1.5rem 0;
      border-radius: 0.375rem;
      color: #92400e;
    }
    .reply-box strong {
      color: #78350f;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Booking Inquiry</h1>
    </div>
    <div class="content">
      <p><strong>New inquiry received! Here are the details:</strong></p>

      <div class="section-title">Guest Information</div>
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Name:</span>
          <span class="detail-value">${firstName} ${lastName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${email}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${city}, ${state}</span>
        </div>
      </div>

      <div class="section-title">Event Details</div>
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Event Type:</span>
          <span class="detail-value">${eventType}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Distance Tier:</span>
          <span class="detail-value">${distanceTier}</span>
        </div>
        ${notes ? `
        <div class="detail-row">
          <span class="detail-label">Notes:</span>
          <span class="detail-value">${notes}</span>
        </div>
        ` : ''}
      </div>

      <div class="section-title">Pricing & Travel</div>
      <div class="price-box">
        Quoted Price: ${price}
      </div>
      <div class="details-box">
        <p style="margin: 0.5rem 0; color: #6b7280; font-size: 0.875rem;"><strong>Travel Info:</strong><br>${travelInfo}</p>
        <p style="margin: 0.5rem 0; color: #6b7280; font-size: 0.875rem;"><em>Note: This price includes travel costs for continental US locations.</em></p>
      </div>

      <div class="reply-box">
        <strong>Reply Info:</strong><br>
        Click reply to contact ${firstName} ${lastName} at ${email}
      </div>
    </div>
  </div>
</body>
</html>
`;

export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const body: InquiryRequest = JSON.parse(event.body);
    const {
      firstName,
      lastName,
      email,
      city,
      state,
      eventType,
      notes,
      price,
      distanceTier,
      travelInfo
    } = body;

    console.log("--- New Booking Inquiry Received ---");
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`City: ${city}`);
    console.log(`State: ${state}`);
    console.log(`Event Type: ${eventType}`);
    console.log(`Quoted Price: ${price}`);
    console.log(`Additional Notes: ${notes || 'None'}`);
    console.log(`Distance Tier: ${distanceTier}`);
    console.log(`Travel Info: ${travelInfo}`);
    console.log("------------------------------------");

    const smtpUrl = process.env.SMTP_URL;
    if (smtpUrl) {
      const transporter = nodemailer.createTransport(smtpUrl);

      // Send confirmation email to the guest
      await transporter.sendMail({
        from: '"Ernie Halter Music" <noreply@erniehalter.com>',
        to: email,
        subject: `Booking Inquiry Received - Estimated Price: ${price}`,
        html: guestEmailTemplate(firstName, eventType, city, state, price, notes)
      });

      // Send inquiry details email to Ernie
      await transporter.sendMail({
        from: '"Booking System" <noreply@erniehalter.com>',
        to: "erniehalter@gmail.com",
        replyTo: email,
        subject: `New Booking Inquiry from ${firstName} ${lastName}`,
        html: ernieEmailTemplate(firstName, lastName, email, city, state, eventType, price, notes, distanceTier, travelInfo)
      });

      console.log("✅ Emails sent successfully to guest and Ernie");
    } else {
      console.log("⚠️  SMTP_URL not configured. Emails will not be sent.");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Email service not configured" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Inquiry sent successfully" })
    };
  } catch (error) {
    console.error("Error processing inquiry:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to process inquiry" })
    };
  }
};
