# Euroape Connect

Euroape Connect is a community hub where verified members can contact each other across different cities, access guides, discover events, and more. It is a modern web application built with Vite, React, TypeScript, and Tailwind CSS.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* **Node.js**: Version 26.3.0 is required.
* **npm**: Node package manager.

## Getting Started

Follow these steps to run the project in your local development environment:

### 1. Install dependencies
Run the following command in the root of your project to install all required packages:
```bash
npm install
```

### 2. Environment Variables
If your Lovable project uses an external backend like Supabase, you will need to set up your environment variables:
1. Create a `.env.local` file in the project root.
2. Add your environment variables (e.g., Supabase credentials).

```env
VERCEL_OIDC_TOKEN=oidc-token-from-vercel
VITE_REOWN_PROJECT_ID=your-project-id
```
*Note: `.env.local` is in `.gitignore` by default and should never be committed.*

### 3. Run the development server
Start the local development server with hot module replacement:
```sh
npm run dev
```
The terminal will output a local URL (typically `http://localhost:8080` or `http://localhost:5173`). Open this URL in your browser to see the app running locally.

## Building for Production

To create a production-ready build, run:
```bash
npm run build
```
This will generate a `dist/` directory containing the compiled JavaScript and CSS assets ready for deployment.

## Smart Contracts

The project includes the implementation of the following core smart contracts:
* `EuroApeProfile.sol`
* `EuroApeNoticeboard.sol`
* `EuroApeBadges.sol`

### Deployed Addresses (Arbitrum Sepolia)
* **EuroApeProfile**: `0xa50a2CdD0dC80b9D2544068EB8a36da13Ce56e18`
* **EuroApeNoticeboard**: `0xeA3A88d36Ba4699c26ac9D44EEe5A1b34890D7eb`
* **EuroApeBadges**: `0x3abc612bd4D091646917359D5c9cE7445259eEAb`

To compile and deploy the smart contracts, use the included Hardhat configuration. Run the following commands:

1. Clean the Hardhat cache and artifacts:
```bash
npx hardhat clean
```
2. Compile the smart contracts:
```bash
npx hardhat compile
```
3. Deploy the contracts to the Arbitrum Sepolia network:
```bash
npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

## Supabase Database Migrations

To apply the database schema to your Supabase project, use the Supabase CLI. Run the following commands in your terminal: 
1. Log in to your Supabase account: 

```bash
npx supabase login
```
2. Link your local project to your Supabase project (replace [project_id] with your actual project reference ID): 

```bash
npx supabase link --project-ref [project_id]
```

3. Push the local migrations to your remote database: 

```bash
npx supabase db push
```
