import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CSVDropzone from '../components/CSVDropzone';
import CallDataDisplay from '../components/CallDataDisplay';
import NetworkSelector from '../components/NetworkSelector';
import { networks } from '../config/networks';

// Dynamically import the PolkadotProcessor to avoid SSR issues with the Polkadot API
const PolkadotProcessor = dynamic(
  () => import('../components/PolkadotProcessor'),
  { ssr: false }
);

export default function Home() {
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [chainDecimals, setChainDecimals] = useState(null);

  const handleDataParsed = (data) => {
    setError('');
    setCsvData(data);
    setIsProcessing(true);
  };

  const handleError = (message) => {
    setError(message);
    setCsvData(null);
    setResult(null);
    setIsProcessing(false);
  };

  const handleProcessed = (processedData) => {
    setResult(processedData);
    setChainDecimals(processedData.chainDecimals);
    setIsProcessing(false);
  };

  const resetAll = () => {
    setCsvData(null);
    setError('');
    setResult(null);
    setIsProcessing(false);
    setChainDecimals(null);
  };

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
    setChainDecimals(null);
    // Reset any previous results when the network changes
    if (result) {
      setResult(null);
    }
  };

  const loadSampleData = () => {
    const sampleData = [
      { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', amount: 1.5 },
      { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', amount: 0.75 },
      { address: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y', amount: 2.25 }
    ];
    setCsvData(sampleData);
    setError('');
    setIsProcessing(true);
  };

  return (
    <div className="container">
      <Head>
        <title>Substrate Batch Transaction Generator | CSV to Call Data</title>
        <meta name="description" content="Generate Polkadot batch transaction call data from a CSV file. Client-side processing - your data never leaves your browser." />
        <meta name="keywords" content="polkadot, batch transaction, utility.batchAll, csv, blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <h1>Substrate Batch Transaction Generator</h1>
        <p>
          Upload a CSV file with addresses and amounts to generate batch transaction call data for use with polkadot.js apps.
          Your data never leaves your browser - all processing happens client-side.
        </p>
      </header>

      <main>
        {!isProcessing && !result && (
          <>
            <NetworkSelector 
              selectedNetwork={selectedNetwork} 
              onNetworkChange={handleNetworkChange} 
            />
            <CSVDropzone 
              onDataParsed={handleDataParsed} 
              onError={handleError}
              onReset={resetAll}
            />
            <div style={{ textAlign: 'center' }}>
              <span className="sample-link" onClick={loadSampleData}>
                Or try with sample data
              </span>
            </div>
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        {isProcessing && csvData && (
          <PolkadotProcessor 
            csvData={csvData}
            network={selectedNetwork}
            onProcessed={handleProcessed}
            onError={handleError}
          />
        )}

        {result && (
          <>
            <CallDataDisplay 
              callData={result.callData}
              transactionCount={result.transactionCount}
              totalAmount={result.totalAmount}
              network={selectedNetwork}
              chainDecimals={chainDecimals}
            />
            <div style={{ textAlign: 'center' }}>
              <button 
                className="copy-button" 
                onClick={resetAll}
                style={{ background: '#172026' }}
              >
                Upload Another CSV
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <p>This tool runs entirely in your browser. No data is sent to any server.</p>
        <div style={{ marginTop: '0.5rem' }}>
          <Link href="/about" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
            Learn more about this tool
          </Link>
        </div>
        <small>Fuck ChaosDAO</small>
      </footer>
    </div>
  );
}