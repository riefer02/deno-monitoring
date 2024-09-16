// Import necessary modules
import "https://deno.land/std@0.186.0/dotenv/load.ts"; // Automatically loads .env variables into Deno.env
import sgMail from "npm:@sendgrid/mail"; // Import SendGrid Mail package

// Access environment variables using Deno.env.get
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY") || "";
const TO_EMAIL = Deno.env.get("TO_EMAIL") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "";
const URLS_TO_PING = Deno.env.get("URLS_TO_PING") || "";

// Initialize SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

// Parse URLs string into an array
const urlsToPing = URLS_TO_PING.split(",").map((url) => url.trim());

// Function to check URLs
async function checkUrls() {
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

// Function to send email notifications using SendGrid
async function sendEmailNotification(url: string, status: string) {
  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `Service Down Alert! - ${url}`,
    text: `The service at ${url} is down. Status: ${status}.`,
    html: `<strong>The service at ${url} is down. Status: ${status}.</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent for ${url} with status ${status}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
}

// Schedule the checkUrls function to run every 5 minutes using Deno's cron
Deno.cron("site-monitoring", "*/5 * * * *", async () => {
  console.log("Checking URLs...");
  await checkUrls();
});
