import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const CallDataDisplay = ({ callData, transactionCount, totalAmount, network, chainDecimals }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(callData);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  return (
    <div className="result-box">
      <div className="result-header">
        <h3 className="result-title">Batch Call Data</h3>
        <button 
          className="copy-button" 
          onClick={handleCopy}
        >
          {copySuccess || 'Copy to Clipboard'}
        </button>
      </div>
      
      <SyntaxHighlighter 
        language="json" 
        style={atomOneDark}
        customStyle={{ 
          borderRadius: '6px',
          fontSize: '14px',
          padding: '1rem'
        }}
      >
        {callData}
      </SyntaxHighlighter>
      
      <div className="transaction-info">
        <p><strong>Total Transactions:</strong> {transactionCount}</p>
        <p><strong>Total Amount:</strong> {totalAmount.toFixed(4)} {network.symbol}</p>
        <p><strong>Network:</strong> {network.name}</p>
        <p><strong>Token Decimals:</strong> {chainDecimals}</p>
        <p><strong>How to use:</strong> Paste this call data into the Polkadot.js Apps under Developer &gt; Extrinsics &gt; Decode</p>
      </div>
    </div>
  );
};

export default CallDataDisplay;