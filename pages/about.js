import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <div className="container">
      <Head>
        <title>About - Polkadot Batch Transaction Generator</title>
        <meta name="description" content="About the Polkadot Batch Transaction Generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <h1>About This Tool</h1>
      </header>

      <main>
        <div className="result-box">
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Polkadot Batch Transaction Generator</h2>
          
          <p style={{ marginBottom: '1rem' }}>
            This tool allows you to batch multiple Polkadot transactions together from a CSV file. All processing
            happens in your browser - your data never leaves your device. The application automatically detects
            the correct token decimals for each selected network.
          </p>

          <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>How It Works</h3>
          <ol style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Select a network (Polkadot, Kusama, or a custom RPC endpoint)</li>
            <li>Upload a CSV file with addresses and amounts</li>
            <li>The app validates your CSV file format and data</li>
            <li>The app connects to the selected network and retrieves token decimals</li>
            <li>The app generates batch call data using Polkadot.js with the correct token precision</li>
            <li>Copy the generated call data</li>
            <li>Paste it into polkadot.js apps to execute your batch transaction</li>
          </ol>

          <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>CSV Format</h3>
          <p>Your CSV must have exactly two columns with the following headers:</p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li><strong>address</strong> - Valid Polkadot address</li>
            <li><strong>amount</strong> - Amount in DOT (e.g., 1.5)</li>
          </ul>
          
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <p style={{ fontFamily: 'monospace' }}>address,amount</p>
            <p style={{ fontFamily: 'monospace' }}>5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY,1.5</p>
            <p style={{ fontFamily: 'monospace' }}>5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty,0.75</p>
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Technology</h3>
          <p>This tool is built with:</p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
            <li>Next.js (React framework)</li>
            <li>Polkadot.js (Official Polkadot JavaScript API)</li>
            <li>PapaParse (CSV parsing library)</li>
          </ul>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/">
              <button className="copy-button">
                Return to Generator
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>This tool runs entirely in your browser. No data is sent to any server.</p>
      </footer>
    </div>
  );
}