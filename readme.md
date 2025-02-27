<h1 align="center">Open HR Solution</h1>

<p align="center">A comprehensive ERP solution to streamline user management, leave, payroll, asset management, and more.</p>

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
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
- [Yarn](https://www.npmjs.com/package/yarn)(Recommended)

### Third-Party Services

- [Github Account](https://github.com/) (For Project Fork)
- [Google Console API](https://console.cloud.google.com/apis/dashboard) (For Google Authentication)
- [Gmail App Pass](https://myaccount.google.com/apppasswords) (For Sending Email with Nodemailer)
- [Discord Webhook URL](https://discord.com/) (For Discord Notification)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (For MongoDB Database)
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

1. Quick start with Yarn

  ```bash
  yarn start
  ```

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

We use GitHub Issues as the official bug tracker for this Template. Please Search [existing issues](https://github.com/zeon-studio/open-hr/issues). It’s possible someone has already reported the same problem.
If your problem or idea has not been addressed yet, feel free to [open a new issue](https://github.com/zeon-studio/open-hr/issues).

### 📝 License

Copyright (c) 2025 - Present, Designed & Developed by [Zeon Studio](https://zeon.studio/)

**Code License:** Released under the [MIT](https://github.com/zeon-studio/open-hr/blob/main/LICENSE) license.

---

## 💻 Need Help To Setup Or Customization?

If you need to set up the application, app customization, or complete application development services from scratch you can [Hire Us](https://zeon.studio/estimate-project).
