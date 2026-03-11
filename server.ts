import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/inquiry", async (req, res) => {
    try {
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
      } = req.body;

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

      if (process.env.SMTP_URL) {
        const transporter = nodemailer.createTransport(process.env.SMTP_URL);

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

Cheers!
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
        console.log("To enable email notifications, set the SMTP_URL environment variable.");
      }

      res.status(200).json({ success: true, message: "Inquiry sent successfully" });
    } catch (error) {
      console.error("Error processing inquiry:", error);
      res.status(500).json({ success: false, error: "Failed to process inquiry" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
