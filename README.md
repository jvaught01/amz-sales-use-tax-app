# Deploy a serverless backend flask API 

This project involves deploying a backend Flask API as a serverless function on AWS Lambda using Zappa and automating the process with GitHub Actions. The backend is designed to support a sample Chrome extension that calculates sales and use tax fields for an Amazon businesses.

## Architecure
![Flask to AWS Serverless Architecure](https://github.com/user-attachments/assets/469ab44f-767b-4d72-8013-a280ecc1df17)




## Quick and Easy Setup

## Slack Webhook Setup(NOTE: THIS IS OPTIONAL)

To receive your API URL as a notifications via Slack, you'll need to set up an Incoming Webhook in Slack and store the necessary parts of the webhook URL as secrets in your GitHub repository.

#### Step 1: Create a Slack Incoming Webhook

1.  Go to your Slack workspace and navigate to **Apps**.
2.  Create new **App** from scratch
3.  Select the workspace for the app and select **Create App**
4.  Under **OAuth & permissions** add a scope called **incoming-webhook**
5.  Under **OAuth Tokens** click on **Install to "your_workspace"**
6.  Next, choose the channel where you want to receive notifications.
7.  Now in the **Features** menu, click **Incoming Webhooks**
8.  Scroll until you see **Webhook URL**. This URL will look something like this:

https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX

## Okay Now Lets begin!
### Step 1: Fork the Repository

- Fork the repository to your GitHub account.

### Step 2: Set Up Repository Secrets


- Go to your forked repository on GitHub.
- Navigate to **Settings** > **Secrets and variables** > **Actions**.
- Add the following secrets:
- **AWS_ACCESS_KEY_ID**: Your AWS Access Key ID.
- **AWS_SECRET_ACCESS_KEY**: Your AWS Secret Access Key.
- **SLACK_TEAM_ID**: (Optional) If using Slack notifications, this corresponds to the `TXXXXXXXX` part of your Slack Webhook URL.
- **SLACK_CHANNEL_ID**: (Optional) Corresponds to the `BXXXXXXXX` part of your Slack Webhook URL.
- **SLACK_TOKEN**: (Optional) Corresponds to the `XXXXXXXXXXXXXXXXXXXXXXXX` part of your Slack Webhook URL.

### Step 3: Pull Your Forked Repo Locally

- Clone your forked repository to your local machine:

  ```bash
  git clone https://github.com/YOUR_GITHUB_USERNAME/amz-sales-use-tax-app.git
  cd amz-sales-use-tax-app
  ```

### Step 4: Edit the `zappa_settings.json` File

- Open the `zappa_settings.json` file and make the following changes:

  - **environment**: Set this to the branch name you are working on (default is `main`).
  - **s3_bucket**: Set your AWS S3 bucket name (e.g., `"s3_bucket": "zappa-yourbucketname"`).

  **PRO TIP**: You can generate a random string of characters for the bucket name by running:

```bash
openssl rand -hex 4
```

Example bucket name: `"s3_bucket": "zappa-v1kpvbat6",`

### Step 5: Commit Your Changes

- Commit and push your changes to your GitHub repository:

  ```bash
  git add .
  git commit -m "Configured zappa_settings.json"
  git push origin YOUR_BRANCH_NAME
  ```



### Step 6: Grab the API URL

-   After the deployment is triggered by your commit, grab the API URL:
    -   From the logs of the GitHub Actions workflow.
    -   Or, if using Slack, check the Slack channel for the notification with the API URL.

### Step 7: Update the Chrome Extension

-   Open `Chrome EXT > popup.js` and replace `"YOUR_API_URL"` in the `fetch` call with your actual API URL.

### Step 8: Load Your Chrome Extension

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Turn on **Developer mode** in the top right corner.
3.  Click **Load unpacked** in the top left.
4.  Select the `Chrome EXT` folder from your local repo.

### Step 9: Test It Out!

- Use the Chrome extension to upload a CSV file and verify that the API processes the sales and use tax calculations correctly.

To make testing easy, there’s a sample file included in the repository called `SampleData.csv`. You can use this file to test your setup.

When you upload `SampleData.csv` through the Chrome extension, the API should return the following results:

- **Total Sales in California:** 847.46
- **Total Sales for the Period:** 8,409.62
- **Total Sales in Other States:** 7,562.16

If you see these numbers, your setup is working correctly!

## Conclusion

By following these simple steps, you can quickly set up and deploy the backend for your Chrome extension using AWS Lambda and Zappa. This streamlined process ensures you spend less time on setup and more time on building and testing your application.
```
