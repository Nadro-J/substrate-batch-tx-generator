// List of predefined networks and their RPC endpoints
export const networks = [
  {
    id: 'polkadot',
    name: 'Polkadot',
    rpc: 'wss://rpc.polkadot.io',
    symbol: 'DOT',
    color: '#E6007A'
  },
  {
    id: 'kusama',
    name: 'Kusama',
    rpc: 'wss://kusama-rpc.polkadot.io',
    symbol: 'KSM',
    color: '#000000'
  },
  {
    id: 'hydration',
    name: 'Hydration',
    rpc: 'wss://hydration.ibp.network',
    symbol: 'HDX',
    color: '#000000'
  },
  {
    id: 'westend',
    name: 'Westend (Testnet)',
    rpc: 'wss://westend-rpc.polkadot.io',
    symbol: 'WND',
    color: '#da68a7'
  },
  {
    id: 'rococo',
    name: 'Rococo (Testnet)',
    rpc: 'wss://rococo-rpc.polkadot.io',
    symbol: 'ROC',
    color: '#6f36dc'
  },
  {
    id: 'custom',
    name: 'Custom Node',
    rpc: '',
    symbol: '',
    color: '#808080'
  }
];

// Helper function to get network by ID
export const getNetworkById = (id) => {
  return networks.find(network => network.id === id) || networks[0];
};
