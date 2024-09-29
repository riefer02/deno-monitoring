import "https://deno.land/std@0.186.0/dotenv/load.ts";
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

const TO_EMAIL = Deno.env.get("TO_EMAIL") || "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "";
const URLS_TO_PING = Deno.env.get("URLS_TO_PING") || "";

const SMTP_HOSTNAME = Deno.env.get("SMTP_HOSTNAME") || "";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT")) || 465;
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME") || "";
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD") || "";

const client = new SMTPClient({
  connection: {
    hostname: SMTP_HOSTNAME,
    port: SMTP_PORT,
    tls: true,
    auth: {
      username: SMTP_USERNAME,
      password: SMTP_PASSWORD,
    },
  },
});

const urlsToPing = URLS_TO_PING.split(",").map((url) => url.trim());

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

async function sendEmailNotification(url: string, status: string) {
  const email = {
    from: FROM_EMAIL,
    to: TO_EMAIL,
    subject: `Service Down Alert! - ${url}`,
    content: `The service at ${url} is down. Status: ${status}.`,
    html: `<strong>The service at ${url} is down. Status: ${status}.</strong>`,
  };

  try {
    await client.send(email);
    console.log(`Email sent for ${url} with status ${status}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
}

async function closeClient() {
  await client.close();
  console.log("SMTP client closed.");
}

Deno.cron("site-monitoring", "*/5 * * * *", async () => {
  console.log("Checking URLs...");
  await checkUrls();
  await closeClient();
});
