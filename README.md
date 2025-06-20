# RankIt

A modern web application built with Next.js, featuring user authentication, payment integration with Cashfree, and premium subscription management.

## Features

- **User Authentication**: Secure user authentication using Clerk
- **Payment Processing**: Cashfree payment gateway integration
- **Premium Plans**: Monthly ($5) and Yearly ($45) subscription options
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Database**: MongoDB integration with Mongoose ODM

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Clerk
- **Payment Gateway**: Cashfree
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (Frontend) + Render/Railway (Backend)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cashfree Payment Gateway
REACT_APP_CASHFREE_APP_ID=your_cashfree_app_id
REACT_APP_CASHFREE_SECRET_KEY=your_cashfree_secret_key
REACT_APP_CASHFREE_ENVIRONMENT=sandbox

# API URL
REACT_APP_API_URL=your_backend_url

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Run the payment server (in a separate terminal):
```bash
npm run server
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

- **Frontend**: Deployed on Vercel at [https://rankit.space](https://rankit.space)
- **Backend**: Payment server hosted on Render/Railway

## License

This project is licensed under the MIT License. #   R a n k I t  
 #   R a n k I t  
 