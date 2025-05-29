<h1 align="center">Open HR Solution</h1>

<p align="center">A comprehensive HR solution to streamline user management, leave, payroll, asset management, and more.</p>

<p align="center">Made with ♥ by <a href="https://zeon.studio/"> Zeon Studio</a></p>
<p align=center>If you find this project useful, please give it a ⭐ to show your support.</p>

![CleanShot 2025-02-18 at 09 57 27](https://github.com/user-attachments/assets/20e46c6d-b7f0-4042-9251-2cddb2ed1afb)

### 📌 Key Features

- 👥 User Management with detailed information
- 👥 Onboarding Steps for New Employees
- 🎯 Different Dashboards for Admin, Moderator and User
- 🔍 Search Functionality on every page
- 🏷️ Payroll Management with salary, bonus, and extra pay
- 🔗 Tools and 3rd-party Account management
- 📚 Online Course Management
- 📱 Asset Management
- 🏖️ Leave Management
- 📆 Holiday and Event Calendar
- ⚙️ Settings to manage every module and app configuration

### 📦 Tech Stack

- [NextJs](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [ReduxJs](https://redux.js.org/)

---

## 🚀 Getting Started With Development

To get a local copy up and running, please follow these simple steps.

### ⚙️ Prerequisites

To start using this project, you need to have some prerequisites installed on your machine.

- [Node v22+](https://nodejs.org/en/download/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (Optional GUI)
- [Yarn](https://www.npmjs.com/package/yarn)(Recommended)

### Third-Party Services

- [Github Account](https://github.com/) (For Project Fork)
- [Google Console API](https://console.cloud.google.com/apis/dashboard) (For Google Authentication)
- [Gmail App Pass](https://myaccount.google.com/apppasswords) (For Sending Email with Nodemailer)
- [Discord Webhook URL](https://discord.com/) (For Discord Notification)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (For Production MongoDB Database)
- [Digital Ocean Space](https://www.digitalocean.com/products/spaces/) (For Uploading Documents)
- [Vercel Account](https://vercel.com/) (For Deployment)

### 👉 Project Setup Locally (Frontend)

1. Clone frontend repo

  ```bash
  git clone https://github.com/zeon-studio/open-hr.git
  ```

1. Go to the project folder

  ```bash
  cd open-hr
  ```

1. Install packages with yarn

  ```bash
  yarn
  ```

1. Set up your .env file

- Duplicate .env.example to .env
- Fullfil every env field
- Create a Google Cloud Client ID for the Web application for Gmail authentication.

1. Quick start with Yarn

  ```bash
  yarn dev
  ```

### 👉 Project Setup Locally (Backend)

1. Clone backend repo

  ```bash
  git clone https://github.com/zeon-studio/open-hr-backend.git
  ```
  
1. Go to the project folder

  ```bash
  cd open-hr-backend
  ```

1. Install packages with yarn

  ```bash
  yarn
  ```

1. Set up your .env file

- Duplicate .env.example to .env
- Fullfil every env field

1. **Configure MongoDB for Development (Required for Employee Creation)**

   The application uses MongoDB transactions for data integrity. To enable transactions in development:

   **Option A: MongoDB as Replica Set (Recommended)**
   ```bash
   # Stop MongoDB if running
   sudo systemctl stop mongod
   
   # Start MongoDB with replica set
   sudo mongod --replSet rs0 --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --port 27017 --bind_ip 127.0.0.1 --fork
   
   # Initialize replica set
   mongosh --eval "rs.initiate()"
   
   # Verify replica set status
   mongosh --eval "rs.status()"
   ```

   **Option B: Use MongoDB Atlas (Cloud)**
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get the connection string and update MONGO_URI in your .env file

1. Quick start with Yarn

  ```bash
  yarn start
  ```

### 🔧 MongoDB Setup Troubleshooting

If you encounter the error: `"Transaction numbers are only allowed on a replica set member or mongos"`, it means MongoDB is running as a standalone instance. Follow these steps:

1. **Check MongoDB Status:**
   ```bash
   mongosh --eval "rs.status()"
   ```

2. **If not a replica set, configure it:**
   ```bash
   # Stop current MongoDB
   sudo systemctl stop mongod
   
   # Edit MongoDB config (if you prefer config file approach)
   sudo nano /etc/mongod.conf
   # Add these lines:
   # replication:
   #   replSetName: "rs0"
   
   # OR start manually with replica set
   sudo mongod --replSet rs0 --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --port 27017 --bind_ip 127.0.0.1 --fork
   
   # Initialize replica set
   mongosh --eval "rs.initiate()"
   ```

3. **Verify Setup:**
   ```bash
   mongosh --eval "rs.status()"
   # Should show: "stateStr": "PRIMARY"
   ```

### 📝 Default Configuration Values

#### Frontend (.env)
```
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
```

#### Backend (.env)
```
PORT="4000"
NODE_ENV="development"

# MongoDB (Local Replica Set)
MONGO_URI="mongodb://localhost:27017/open-hr-backend"
BEARER_TOKEN="your-super-secret-bearer-token-2024"

# Bycrypt
SALT_ROUND="10"

# ID Generator prefix
ID_GENERATOR_PREFIX="EMP"

# JWT config
JWT_SECRET="your-super-secret-jwt-key-2024"
JWT_TOKEN_EXPIRE="1d"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-2024"
JWT_REFRESH_TOKEN_EXPIRE="7d"

# Digital Ocean Spaces
DOS_PUBLIC_ACCESS_KEY=""
DOS_PUBLIC_SECRET_KEY=""
DOS_BUCKET_NAME=""
DOS_REGION="nyc3"

# Discord Webhook
DISCORD_WEBHOOK_URL=""

# nodemailer config
SENDER_EMAIL=""
EMAIL_PASSWORD=""

# cors config
CORS_ORIGIN="*"
```

### 🔑 Required Third-Party Services Setup

1. **Google Authentication**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google OAuth2 API
   - Create OAuth 2.0 Client ID for Web application
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Copy the Client ID to your frontend .env file

2. **MongoDB Setup**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `open-hr-backend`
   - Update the MONGO_URI in backend .env file

3. **Email Setup (Optional)**
   - Create an app password in your Google Account
   - Use it in the backend .env file for EMAIL_PASSWORD
   - Set SENDER_EMAIL to your Gmail address

4. **Digital Ocean Spaces (Optional)**
   - Create a Space in Digital Ocean
   - Get the access key and secret
   - Update the DOS_* variables in backend .env

5. **Discord Webhook (Optional)**
   - Create a webhook in your Discord server
   - Copy the webhook URL to DISCORD_WEBHOOK_URL in backend .env

---

## 🚀 Production Deployment Guide

### 🌐 Prerequisites for Production

Before deploying to production, ensure you have:

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for production database
- [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) account for frontend hosting
- [Heroku](https://heroku.com/), [Railway](https://railway.app/), or [Render](https://render.com/) for backend hosting
- Domain name (optional but recommended)
- SSL certificate (handled automatically by most platforms)

### 🗄️ Production Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster:**
   ```bash
   # Go to https://www.mongodb.com/cloud/atlas
   # Create a free M0 cluster (or paid cluster for production)
   # Choose your preferred cloud provider and region
   ```

2. **Configure Database Access:**
   ```bash
   # In Atlas Dashboard:
   # 1. Go to Database Access
   # 2. Add Database User with readWrite permissions
   # 3. Set username and password (save these for connection string)
   ```

3. **Configure Network Access:**
   ```bash
   # In Atlas Dashboard:
   # 1. Go to Network Access
   # 2. Add IP Address: 0.0.0.0/0 (allows all IPs)
   # 3. Or add specific IPs of your hosting platform
   ```

4. **Get Connection String:**
   ```bash
   # In Atlas Dashboard:
   # 1. Go to Clusters
   # 2. Click "Connect"
   # 3. Choose "Connect your application"
   # 4. Copy the connection string
   # Format: mongodb+srv://username:password@cluster.mongodb.net/open-hr-backend
   ```

### 🖥️ Backend Deployment

#### Option A: Deploy to Railway (Recommended)

1. **Prepare for Railway:**
   ```bash
   # In your backend root directory, create railway.json
   {
     "build": {
       "builder": "nixpacks"
     },
     "deploy": {
       "startCommand": "npm run build && npm run server"
     }
   }
   ```

2. **Deploy to Railway:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway link
   
   # Set environment variables
   railway variables set MONGO_URI="your-mongodb-atlas-connection-string"
   railway variables set NODE_ENV="production"
   railway variables set JWT_SECRET="your-production-jwt-secret"
   # ... add all other environment variables
   
   # Deploy
   railway up
   ```

#### Option B: Deploy to Render

1. **Connect Repository:**
   ```bash
   # Go to https://render.com/
   # Connect your GitHub repository
   # Create a new Web Service
   ```

2. **Configure Build Settings:**
   ```bash
   # Build Command: npm run build
   # Start Command: npm run server
   # Environment: Node
   ```

3. **Set Environment Variables:**
   ```bash
   # In Render dashboard, add all environment variables:
   MONGO_URI="your-mongodb-atlas-connection-string"
   NODE_ENV="production"
   JWT_SECRET="your-production-jwt-secret"
   # ... add all other variables from your .env file
   ```

#### Option C: Deploy to Heroku

1. **Prepare Heroku Deployment:**
   ```bash
   # Install Heroku CLI
   # Create Procfile in backend root:
   echo "web: npm run build && npm run server" > Procfile
   ```

2. **Deploy to Heroku:**
   ```bash
   # Create Heroku app
   heroku create your-app-name-backend
   
   # Set environment variables
   heroku config:set MONGO_URI="your-mongodb-atlas-connection-string"
   heroku config:set NODE_ENV="production"
   heroku config:set JWT_SECRET="your-production-jwt-secret"
   # ... add all other environment variables
   
   # Deploy
   git push heroku main
   ```

### 🎨 Frontend Deployment

#### Deploy to Vercel (Recommended)

1. **Prepare Vercel Deployment:**
   ```bash
   # In your frontend root directory
   # Ensure your .env.local has production values:
   NEXT_PUBLIC_API_URL="https://your-backend-domain.com"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-production-google-client-id"
   ```

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   
   # Set production environment variables in Vercel dashboard
   ```

3. **Configure Environment Variables in Vercel:**
   ```bash
   # Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   # Add:
   NEXT_PUBLIC_API_URL = "https://your-backend-domain.com"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID = "your-production-google-client-id"
   ```

#### Deploy to Netlify

1. **Build Settings:**
   ```bash
   # Build command: npm run build
   # Publish directory: .next
   # or use out directory if using static export
   ```

2. **Environment Variables:**
   ```bash
   # In Netlify dashboard, add environment variables:
   NEXT_PUBLIC_API_URL = "https://your-backend-domain.com"
   NEXT_PUBLIC_GOOGLE_CLIENT_ID = "your-production-google-client-id"
   ```

### 🔧 Production Environment Variables

#### Backend Production .env
```bash
PORT="4000"
NODE_ENV="production"

# MongoDB Atlas
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/open-hr-backend?retryWrites=true&w=majority"
BEARER_TOKEN="your-super-secure-production-bearer-token"

# Strong JWT secrets for production
JWT_SECRET="your-super-secure-production-jwt-secret-min-32-chars"
JWT_TOKEN_EXPIRE="1d"
JWT_REFRESH_SECRET="your-super-secure-production-refresh-secret-min-32-chars"
JWT_REFRESH_TOKEN_EXPIRE="7d"

# Bcrypt
SALT_ROUND="12"

# ID Generator
ID_GENERATOR_PREFIX="EMP"

# Digital Ocean Spaces (Production)
DOS_PUBLIC_ACCESS_KEY="your-production-access-key"
DOS_PUBLIC_SECRET_KEY="your-production-secret-key"
DOS_BUCKET_NAME="your-production-bucket"
DOS_REGION="nyc3"

# Discord Webhook (Production)
DISCORD_WEBHOOK_URL="your-production-discord-webhook"

# Email (Production)
SENDER_EMAIL="your-production-email@gmail.com"
EMAIL_PASSWORD="your-production-app-password"

# CORS (Set to your frontend domain)
CORS_ORIGIN="https://your-frontend-domain.com"
```

#### Frontend Production .env
```bash
NEXT_PUBLIC_API_URL="https://your-backend-domain.com"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-production-google-client-id.googleusercontent.com"
```

### 🔒 Production Security Checklist

- [ ] Use strong, unique JWT secrets (minimum 32 characters)
- [ ] Set CORS_ORIGIN to your actual frontend domain
- [ ] Use MongoDB Atlas with authentication enabled
- [ ] Enable SSL/HTTPS on all domains
- [ ] Use environment variables for all sensitive data
- [ ] Set up monitoring and error tracking
- [ ] Configure backup strategy for database
- [ ] Set up logging for backend API
- [ ] Use strong passwords for all services
- [ ] Enable 2FA on all third-party services

### 📊 Post-Deployment Steps

1. **Upload Sample Data:**
   ```bash
   # Connect to your production MongoDB using MongoDB Compass
   # Upload example-data/employee.json to employees collection
   # Upload example-data/settings.json to settings collection
   # Update work_email in employee data to your email
   ```

2. **Test Functionality:**
   ```bash
   # Test Google OAuth login
   # Test employee creation
   # Test email functionality
   # Test file uploads (if configured)
   # Test all major features
   ```

3. **Configure Custom Domain (Optional):**
   ```bash
   # In Vercel: Settings > Domains > Add custom domain
   # In Railway: Settings > Networking > Custom Domain
   # Update CORS_ORIGIN and frontend API URL accordingly
   ```

### 🔍 Monitoring and Maintenance

- **Database Monitoring:** Use MongoDB Atlas monitoring tools
- **Application Monitoring:** Set up error tracking (Sentry, LogRocket)
- **Uptime Monitoring:** Use tools like UptimeRobot or Pingdom
- **Performance Monitoring:** Use Vercel Analytics or Google Analytics
- **Regular Backups:** Configure automated database backups
- **Security Updates:** Keep dependencies updated regularly

---

## 🚀 Build

After you finish your development, you can build or deploy your project. Let's see the process:

### 👉 Build Command

You can use the following command to build your project locally (Frontend and Backend). It will purge all the unused CSS and minify all the files.

```bash
yarn build
```

## 🚀 Deploy

If your project built successfully on local, you can deploy it to vercel, render, or any other hosting platform.

### 👉 Deploy Backend to Vercel

To deploy the backend to Vercel, you can use the `vercel.json` configuration file. Simply overwrite the build command to `yarn build` on the Vercel platform and don't forget to add the environment variables to Vercel. This will ensure that the backend is built and deployed correctly.

### 👉 Deploy Frontend to Vercel

To deploy the frontend to Vercel, Simply overwrite the build command to `yarn build` on the Vercel platform and don't forget to add the environment variables to Vercel. This will ensure that the backend is built and deployed correctly.

### 👉 Upload Sample Data

After deploying the backend, you can upload sample data to the database using Mongodb Compass. Follow these steps:

1. Open Mongodb Compass and connect to your MongoDB database.
2. Navigate to the `open-hr` database.
3. Upload `example-data/employee.json` to the `employees` collection. [make sure you have changed the `work_email` to your email address, so that you can login with it]
4. Upload `example-data/settings.json` to the `settings` collection.

### 👉 Login To Dashboard

After uploading the sample data, you can login to the dashboard using the email address that you used in the `example-data/employee.json` file. Just click on the login with Google button and you will be redirected to the dashboard.

---

## 🔒 Guide to Staying Compliant

### 🐞 Reporting Issues

We use GitHub Issues as the official bug tracker for this Template. Please Search [existing issues](https://github.com/zeon-studio/open-hr/issues). It's possible someone has already reported the same problem.
If your problem or idea has not been addressed yet, feel free to [open a new issue](https://github.com/zeon-studio/open-hr/issues).

### 📝 License

Copyright (c) 2025 - Present, Designed & Developed by [Zeon Studio](https://zeon.studio/)

**Code License:** Released under the [MIT](https://github.com/zeon-studio/open-hr/blob/main/LICENSE) license.

---

## 💻 Need Help To Setup Or Customization?

If you need to set up the application, app customization, or complete application development services from scratch you can [Hire Us](https://zeon.studio/estimate-project).
