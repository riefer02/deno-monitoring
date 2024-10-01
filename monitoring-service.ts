import nodemailer from "npm:nodemailer";

// Load environment variables
import "https://deno.land/std@0.186.0/dotenv/load.ts";

// SMTP and email configuration
const TO_EMAIL = Deno.env.get("TO_EMAIL") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "";
const URLS_TO_PING = Deno.env.get("URLS_TO_PING") || "";
const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME") || "";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT")) || 587; // Default to port 587
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME") || "";
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD") || "";

// Create Nodemailer transport
const transporter = nodemailer.createTransport({
  host: SMTP_HOSTNAME,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for port 465, false for other ports
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

// Helper function to send email notification
async function sendEmailNotification(url: string, status: string) {
  const mailOptions = {
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `Service Down Alert! - ${url}`,
    text: `The service at ${url} is down. Status: ${status}.`,
    html: `<strong>The service at ${url} is down. Status: ${status}.</strong>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
}

// Function to ping URLs and send email notifications
async function checkUrls() {
  const urlsToPing = URLS_TO_PING.split(",").map((url) => url.trim());

  for (const url of urlsToPing) {
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        console.error(
          `Service down: ${url} returned status ${response.status}`
        );
        await sendEmailNotification(url, response.status.toString());
      } else {
        console.log(`Service up: ${url}`);
      }
    } catch (error) {
      console.error(`Error pinging ${url}: ${error.message}`);
      await sendEmailNotification(url, "Error");
    }
  }
}

// Example of how to trigger the URL checks (e.g., set up a cron job)
Deno.cron("site-monitoring", "*/5 * * * *", async () => {
  console.log("Checking URLs...");
  await checkUrls();
});
