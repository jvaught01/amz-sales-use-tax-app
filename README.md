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

## Setting Up the Environment

This section will guide you through setting up your local development environment to prepare for deploying the Flask API as a serverless function on AWS Lambda.

### Step 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/jvaught01/amz-sales-use-tax-app.git
cd amz-sales-use-tax-app
```

### Step 2. Create and Activate a Virtual Environment

To avoid conflicts between dependencies of different Python projects, it's recommended to create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```
### 3. Install Required Dependencies

With the virtual environment activated, install the required dependencies for the project:

bash

Copy code

`pip install -r requirements.txt` 

This command installs all the Python packages listed in the `requirements.txt` file into your virtual environment.

### 4. Configure the `zappa_settings.json` File

Before deploying the application, you'll need to configure the `zappa_settings.json` file with your specific AWS settings.

Here’s an example configuration:

```json

`{
    "main": {
        "aws_region": "us-east-1",
        "s3_bucket": "your-s3-bucket-name",
        "app_function": "app.app", 
        "profile_name": null,
        "project_name": "sales-use-tax-p",
        "runtime": "python3.10"
    }
}` 
```

-   **environment**: Set this to your branch name(default is `main`)
-   **aws_region**: Set this to the AWS region where your Lambda function will be deployed.
-   **s3_bucket**: Provide the name of an S3 bucket where Zappa can store deployment files.
-   **app_function**: Specify the entry point for your Flask application (typically `app.app`).
-   **profile_name**: The AWS CLI profile to use for deploying the application.(keep this as null)
-   **project_name**: A unique name for your Zappa project.
-   **runtime**: The Python runtime to use (e.g., `python3.10`).

Make sure to replace `"your-s3-bucket-name"` with your actual S3 bucket name.

Once these steps are complete, your environment will be ready for deploying the application.

### 2. Add Your AWS Credentials to GitHub Secrets

In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions** and add the following secrets:

-   `AWS_ACCESS_KEY_ID`
-   `AWS_SECRET_ACCESS_KEY`
-   `AWS_DEFAULT_REGION`


## Automating Deployments with GitHub Actions

This project includes a GitHub Actions workflow that automatically deploys your application every time changes are pushed to a specified branch.

### 1. GitHub Actions Workflow

The `.github/workflows/deploy.yml` file contains the CI/CD pipeline configuration:

```yaml

name: Zappa Deploy

on:
  push:
    branches:
      - main
      - dev
      - staging
      - prod

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3
      with:
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install dependencies
      run: |
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt 
    - name: Configure AWS Credentials
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
        AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
      run: |
        echo "Configuring boto3 session..."
        source venv/bin/activate
        python -c "import boto3; boto3.setup_default_session(aws_access_key_id='$AWS_ACCESS_KEY_ID', aws_secret_access_key='$AWS_SECRET_ACCESS_KEY', aws_session_token='$AWS_SESSION_TOKEN', region_name='$AWS_DEFAULT_REGION')"
        echo "Boto3 session configured." 
    - name: Set Zappa Environment based on branch
      id: set-env
      run: |
        BRANCH_NAME=$(echo "${GITHUB_REF##*/}")
        echo "BRANCH_NAME=${BRANCH_NAME}" >> $GITHUB_ENV 
    - name: Deploy or Update with Zappa
      id: deploy-zappa
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_SESSION_TOKEN: ${{ secrets.AWS_SESSION_TOKEN }}
        AWS_DEFAULT_REGION: ${{ secrets.AWS_DEFAULT_REGION }}
      run: |
        set -e
        source venv/bin/activate
        DEPLOY_OUTPUT=$(zappa update $BRANCH_NAME || zappa deploy $BRANCH_NAME)
        LAST_LINE=$(echo "$DEPLOY_OUTPUT" | tail -n 1)
        API_URL=$(echo "$LAST_LINE" | grep -oP 'https://\S+amazonaws.com/\S+')
        API_URL_WITH_PATH="${API_URL}/upload"
        echo "API_URL_WITH_PATH=$API_URL_WITH_PATH" >> $GITHUB_ENV 
    - name: Send API URL to Slack
      run: |
        SLACK_WEBHOOK_URL="https://hooks.slack.com/services/${{ secrets.SLACK_TEAM_ID }}/${{ secrets.SLACK_CHANNEL_ID }}/${{ secrets.SLACK_TOKEN }}"
        curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"Your API is available at: $API_URL_WITH_PATH\"}" \
        $SLACK_WEBHOOK_URL
```

### 2. How It Works

-   **Branches**: The workflow is triggered whenever a commit is pushed to `main`, `dev`, `staging`, or `prod`.
-   **Automatic Deployment**: The workflow installs dependencies, configures AWS credentials, and deploys or updates the Lambda function using Zappa.
-   **Slack Notification**: After deployment, a notification with the API URL is sent to your specified Slack channel

## Verifying the Deployment


### 1. Access the API

After deployment, if you access the API URL provided in the Slack notification or in the logs of the workflow, you should receive the following response:` 

Method Not Allowed The method is not allowed for the requested URL.


 This is expected because the API is designed to process CSV uploads, which should be done via the Chrome extension.

### 2. Testing the Chrome Extension

Once the backend is deployed, ensure the Chrome extension is correctly configured to interact with the new API endpoint that was sent to your Slack channel.

To update the API endpoint in the Chrome extension:

1. Navigate to the `Chrome EXT` folder in the project directory.
2. Open the `popup.js` file.
3. Find the line that starts with `fetch("YOUR_API_URL"....`.
4. Replace `"YOUR_API_URL"` with the actual API URL provided in the Slack notification.

After updating the `popup.js` file, you can test the extension to verify that it correctly uploads a CSV file and performs the sales and use tax calculations.``
