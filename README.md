# Substrate Batch Transaction Generator

A web application that allows users to upload a CSV file containing Polkadot addresses and amounts, and generates batch transaction call data for use with polkadot.js apps.

## Features

- Client-side only processing - all data stays in the browser
- CSV validation to ensure proper format (address, amount columns only)
- Generates batch call data for Polkadot transactions
- Copy to clipboard functionality
- Responsive design
- Ready for deployment on Vercel

## Local Development

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## CSV Format

The application only accepts CSV files with exactly two columns:
- `address`: A valid Polkadot address
- `amount`: A numeric value representing the amount in DOT

Example:
```
address,amount
5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY,1.5
5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty,0.75
```

## How to Use

1. Open the application in your browser
2. Upload your CSV file by dragging and dropping or clicking the dropzone
3. Wait for the processing to complete
4. Copy the generated call data
5. Paste the call data into polkadot.js apps:
   - Go to [Polkadot.js Apps](https://polkadot.js.org/apps/)
   - Navigate to "Developer" > "Extrinsics" > "Decode"
   - Paste the call data generated by this application
   - From Submission, Select your account
   - REVIEW THE TRANSACTION!!!
   - Submit the transaction

## Technologies Used

- Next.js
- React
- Polkadot/API
- PapaParse (for CSV parsing)
- React Dropzone
- React Syntax Highlighter

## License

MIT
