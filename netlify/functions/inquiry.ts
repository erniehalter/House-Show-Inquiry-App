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
        text: `Hi ${firstName},

Thank you for submitting your booking inquiry! We received the following details:

Event Details:
- Event Type: ${eventType}
- Location: ${city}, ${state}
- Estimated Price: ${price}
- Additional Notes: ${notes || 'None'}

Ernie will review your inquiry and get back to you shortly to discuss next steps and confirm availability.

Best regards,
Ernie Halter Music
        `
      });

      // Send inquiry details email to Ernie
      await transporter.sendMail({
        from: '"Booking System" <noreply@erniehalter.com>',
        to: "erniehalter@gmail.com",
        replyTo: email,
        subject: `New Booking Inquiry from ${firstName} ${lastName}`,
        text: `New booking inquiry received!

Guest Details:
- Name: ${firstName} ${lastName}
- Email: ${email}
- City: ${city}
- State: ${state}
- Event Type: ${eventType}
- Quoted Price: ${price}
- Additional Notes: ${notes || 'None'}

Distance Tier: ${distanceTier}
Travel Info: ${travelInfo}

Reply to this guest directly at: ${email}
        `
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
