# SEO Tool

The **SEO Tool** is a full-stack application built with **React** (frontend) and **Express** (backend). It helps users analyze websites for SEO performance, including metrics like mobile friendliness, meta tags, headings, performance score, and more. The tool also leverages the **Gemini API** for advanced SEO recommendations and uses **Prisma** with **PostgreSQL** for database management.

---

## Features

- **Website Analysis**:
  - Analyze key SEO elements such as title, meta tags, headings, links, and performance.
  - Get recommendations for improving SEO based on the analysis.

- **Performance Metrics**:
  - Measure website performance using Google PageSpeed Insights.
  - Evaluate mobile friendliness and loading experience.

- **Advanced Recommendations**:
  - Use the **Gemini API** to generate AI-powered SEO recommendations.

- **User Authentication**:
  - Secure user authentication using JWT (JSON Web Tokens).
  - Protected routes for authenticated users.

- **Database Management**:
  - Use **Prisma** as an ORM to interact with a **PostgreSQL** database.
  - Store user data, analysis results, and recommendations.

- **Responsive Design**:
  - A clean and responsive user interface built with React and modern CSS.

---

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Axios**: For making HTTP requests to the backend.
- **React Router**: For handling client-side routing.
- **Tailwind CSS**: For styling the application.

### Backend
- **Express**: A Node.js framework for building the backend API.
- **Prisma**: A modern ORM for database management.
- **PostgreSQL**: A relational database for storing user data and analysis results.
- **JWT**: For user authentication and authorization.
- **Cheerio**: For web scraping and extracting SEO-related data.
- **Google PageSpeed Insights API**: For performance analysis.
- **Gemini API**: For generating AI-powered SEO recommendations.

---

## Getting Started

Follow these steps to set up and run the SEO Tool locally.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v16 or higher).
- **PostgreSQL**: Install PostgreSQL and create a database for the project.
- **Google PageSpeed Insights API Key**: Obtain an API key from the [Google Cloud Console](https://console.cloud.google.com/).
- **Gemini API Key**: Obtain an API key from the [Gemini API](https://gemini.com/).

---

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/badalSuryawanshi0/SEO_Analyzer.git
   ```
   
2. **Set Up the Backend**:

*Navigate to the backend folder*

```bash
cd backend 
```
*Install dependencies*:

```bash
npm install 
```
*Create a .env file in the backend folder and add the following environment variables:*

.env
```
PORT=3000
DATABASE_URL="postgresql://your-db-user:your-db-password@localhost:5432/seo-tool"
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_pagespeed_api_key
GEMINI_API_KEY=your_gemini_api_key
```
*Run Prisma migrations to set up the database:*

```
npx prisma migrate dev --name init
```
*Start the backend server:*

```
npm start
```
3. **Set Up the Frontend:**

*Navigate to the frontend folder:*

```
cd ../frontend
```
*Install dependencies:*

```
npm install
```

*Start the frontend development server:*

```
npm start
```
**Running the Application**
1. *Backend:*

The backend server will run on http://localhost:3000.

2. *Frontend:*

The frontend application will run on http://localhost:5173 (or another port if 5173 is occupied).

3. *Access the Application:*

Open your browser and navigate to http://localhost:5173.

**Usage**
1. *Log In:*

*log in to access  and configure SEO parameters .* \
*Test Credential*
```bash
email:Admin@gmail.com
password:12345678
```

2. *Analyze a Website:*

*Enter the URL of the website you want to analyze.*

*View the analysis results, including recommendations for improving SEO.*

