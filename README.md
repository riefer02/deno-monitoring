# Service Status Monitoring with Deno and Nodemailer

This Deno-based application periodically pings a list of specified URLs (stored in an environment variable) and sends email notifications via SMTP if any of these services are down (i.e., do not return a `200` HTTP status code). It uses `Nodemailer` for sending emails.

## Features

- Periodically checks the status of specified URLs.
- Sends email alerts when a service is down.
- Securely manages configuration using environment variables, including URLs to monitor and SMTP credentials.

## Prerequisites

- [Deno](https://deno.land/) installed.
- SMTP credentials from your email provider.
- Set up environment variables in a `.env` file.

## Environment Setup

Create a `.env` file with the following content:

```env
TO_EMAIL=recipient@example.com
FROM_EMAIL=your_sender@example.com
URLS_TO_PING=https://api.example.com,https://example.com

SMTP_HOSTNAME=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USERNAME=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

Replace the placeholders with your email provider's SMTP credentials and the URLs you want to monitor.

## Installation

1. **Install Nodemailer**:
   ```bash
   npm install nodemailer
   ```

2. **Run the Application**:

   Use the following command to run the application:

   ```bash
   deno run --allow-net --allow-env --unstable your_file.ts
   ```

   - `--allow-net`: Grants network access for pinging URLs and sending emails.
   - `--allow-env`: Grants access to environment variables.
   - `--unstable`: Enables unstable APIs (required for cron jobs in Deno).

## Configuration

- **URLs to Monitor**: Update the `URLS_TO_PING` environment variable with a comma-separated list of URLs you want to monitor.
- **SMTP Settings**: Add your email provider's SMTP credentials in the `.env` file.
- **Cron Schedule**: The application checks URLs every 5 minutes by default using Deno's cron functionality. You can modify the cron expression in `Deno.cron("*/5 * * * *", ...)` to adjust the frequency.

## Example Output

- **If a service is up**:
  ```
  Checking URLs...
  Service up: https://api.example.com
  Service up: https://example.com
  ```

- **If a service is down**:
  ```
  Checking URLs...
  Service down: https://api.example.com returned status 404
  Email sent for https://api.example.com with status 404
  ```

## License

This project is licensed under the MIT License.
