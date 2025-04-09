import { useState, useEffect } from 'react';
import { networks } from '../config/networks';

const NetworkSelector = ({ selectedNetwork, onNetworkChange }) => {
  const [customRpc, setCustomRpc] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [showCustomFields, setShowCustomFields] = useState(false);

  // Set initial custom values if "custom" is selected initially
  useEffect(() => {
    if (selectedNetwork.id === 'custom') {
      setShowCustomFields(true);
      if (selectedNetwork.rpc) {
        setCustomRpc(selectedNetwork.rpc);
      }
      if (selectedNetwork.symbol) {
        setCustomSymbol(selectedNetwork.symbol);
      }
    } else {
      setShowCustomFields(false);
    }
  }, [selectedNetwork]);

  const handleNetworkChange = (e) => {
    const networkId = e.target.value;
    const network = networks.find(n => n.id === networkId);
    
    if (networkId === 'custom') {
      setShowCustomFields(true);
      // Create a custom network config
      onNetworkChange({
        ...network,
        rpc: customRpc,
        symbol: customSymbol || 'TOKEN'
      });
    } else {
      setShowCustomFields(false);
      onNetworkChange(network);
    }
  };

  const handleCustomRpcChange = (e) => {
    const rpc = e.target.value;
    setCustomRpc(rpc);
    if (selectedNetwork.id === 'custom') {
      onNetworkChange({
        ...selectedNetwork,
        rpc
      });
    }
  };

  const handleCustomSymbolChange = (e) => {
    const symbol = e.target.value;
    setCustomSymbol(symbol);
    if (selectedNetwork.id === 'custom') {
      onNetworkChange({
        ...selectedNetwork,
        symbol: symbol || 'TOKEN'
      });
    }
  };

  return (
    <div className="network-selector">
      <div className="network-selector-main">
        <label htmlFor="network-select">Network:</label>
        <select 
          id="network-select" 
          value={selectedNetwork.id}
          onChange={handleNetworkChange}
        >
          {networks.map(network => (
            <option key={network.id} value={network.id}>
              {network.name}
            </option>
          ))}
        </select>
      </div>

      {showCustomFields && (
        <div className="custom-network-fields">
          <div className="custom-field">
            <label htmlFor="custom-rpc">RPC Endpoint:</label>
            <input
              id="custom-rpc"
              type="text"
              placeholder="wss://..."
              value={customRpc}
              onChange={handleCustomRpcChange}
            />
          </div>
          <div className="custom-field">
            <label htmlFor="custom-symbol">Token Symbol:</label>
            <input
              id="custom-symbol"
              type="text"
              placeholder="DOT, KSM, etc."
              value={customSymbol}
              onChange={handleCustomSymbolChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;