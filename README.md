# Sales and Use Tax Chrome Extension - Serverless Backend

This project involves deploying a backend Flask API as a serverless function on AWS Lambda using Zappa and automating the process with GitHub Actions. The backend is designed to support a Chrome extension that calculates sales and use tax fields for an Amazon business.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setting Up the Environment](#setting-up-the-environment)
- [Modifying Configuration Files](#modifying-configuration-files)
- [Deploying the Application](#deploying-the-application)
- [Automating Deployments with GitHub Actions](#automating-deployments-with-github-actions)
- [Verifying the Deployment](#verifying-the-deployment)
- [Conclusion](#conclusion)

## Prerequisites

Before you begin, make sure you have the following:

### 1. AWS Account and IAM Setup
- An AWS account with appropriate permissions to create and manage Lambda functions, API Gateway, and S3 buckets.
- Generate an Access Key ID and Secret Access Key for your IAM user.

### 2. Slack Webhook Setup(NOTE: THIS IS OPTIONAL)
To receive deployment notifications via Slack, you'll need to set up an Incoming Webhook in Slack and store the necessary parts of the webhook URL as secrets in your GitHub repository.

#### Step 1: Create a Slack Incoming Webhook

1. Go to your Slack workspace and navigate to **Apps**.
2. Search for and select the **Incoming Webhooks** app.
3. Click **Add to Slack** and choose the channel where you want to receive notifications.
4. After adding, Slack will provide you with a **Webhook URL**. This URL will look something like this:

https://hooks.slack.com/services/TXXXXXXXX/BXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX
#### Step 2: Store Webhook Parts as GitHub Secrets

You'll need to break down the Slack Webhook URL into three parts and store each part as a secret in your GitHub repository:

1. **SLACK_TEAM_ID**: This corresponds to the `TXXXXXXXX` part of the URL.
2. **SLACK_CHANNEL_ID**: This corresponds to the `BXXXXXXXX` part of the URL.
3. **SLACK_TOKEN**: This corresponds to the `XXXXXXXXXXXXXXXXXXXXXXXX` part of the URL.

To store these parts as secrets:

1. Go to your GitHub repository and navigate to **Settings** > **Secrets and variables** > **Actions**.
2. Click on **New repository secret** for each of the three parts:
- Add a new secret named `SLACK_TEAM_ID` with the value `TXXXXXXXX`.
- Add a new secret named `SLACK_CHANNEL_ID` with the value `BXXXXXXXX`.
- Add a new secret named `SLACK_TOKEN` with the value `XXXXXXXXXXXXXXXXXXXXXXXX`.

#### Step 3: Verify the Setup

After storing these secrets, your GitHub Actions workflow will be able to use them to send notifications to Slack whenever a deployment occurs.
