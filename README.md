# Service Status Monitoring with Deno and Amazon SES

This Deno-based application periodically pings a list of specified URLs (stored in an environment variable) and sends email notifications using Amazon SES via SMTP if any of these services are down (i.e., do not return a `200` HTTP status code). It uses the `denomailer` package to integrate SMTP for sending emails.

## Features

- Periodically checks the status of specified URLs.
- Sends email alerts via Amazon SES when a service is down.
- Uses environment variables to securely manage configuration, including URLs to monitor and SMTP credentials.

## Prerequisites

- [Deno](https://deno.land/) installed on your machine.
- An Amazon SES account with SMTP credentials.
- Environment variables set up in a `.env` file.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. **Set Up Environment Variables**:

   Create a `.env` file in the root directory with the following content:

   ```env
   TO_EMAIL=recipient@example.com
   FROM_EMAIL=your_verified_ses_sender@example.com
   URLS_TO_PING=https://api.example.com,https://example.com

   SMTP_HOSTNAME=email-smtp.us-east-2.amazonaws.com
   SMTP_PORT=465
   SMTP_USERNAME=your_ses_smtp_username
   SMTP_PASSWORD=your_ses_smtp_password
   ```

   Replace `recipient@example.com`, `your_verified_ses_sender@example.com`, `your_ses_smtp_username`, and `your_ses_smtp_password` with the correct values from your Amazon SES account. Add all the URLs you want to monitor as a comma-separated list for `URLS_TO_PING`.

3. **Run the Application**:

   Use the following command to run the application:

   ```bash
   deno run --allow-net --allow-env --unstable your_file.ts
   ```

   - `--allow-net`: Grants network access for pinging URLs and sending emails.
   - `--allow-env`: Grants access to environment variables.
   - `--unstable`: Enables unstable APIs (required for cron jobs in Deno).

## Configuration

- **URLs to Monitor**: Update the `URLS_TO_PING` environment variable in the `.env` file with a comma-separated list of the URLs you want to monitor.
- **Amazon SES SMTP Settings**: Update the SMTP credentials in the `.env` file using your Amazon SES account details.
- **Cron Schedule**: The application is set to check URLs every 5 minutes by default using Deno's cron functionality. You can adjust the schedule by modifying the cron expression in `Deno.cron("*/5 * * * *", ...)`.

## Usage

- The application will periodically check the status of the URLs specified in the `URLS_TO_PING` environment variable.
- If a URL does not return a `200` HTTP status code, an email alert will be sent to the recipient specified in the `.env` file.

## Example Output

- If a service is up:
  ```
  Checking URLs...
  Service up: https://api.example.com
  Service up: https://example.com
  ```

- If a service is down:
  ```
  Checking URLs...
  Service down: https://api.example.com returned status 404
  Email sent for https://api.example.com with status 404
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you'd like to improve the functionality or fix bugs.

## License

This project is licensed under the MIT License.