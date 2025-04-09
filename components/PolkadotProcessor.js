import { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { BN } from '@polkadot/util';

const PolkadotProcessor = ({ csvData, network, onProcessed, onError }) => {
  const [status, setStatus] = useState('Connecting to Polkadot network...');
  const [chainDecimals, setChainDecimals] = useState(10);
  
  useEffect(() => {
    let api;
    let isMounted = true;

    const processData = async () => {
      try {
        if (!csvData || csvData.length === 0) {
          return;
        }

        // connect to the selected network
        const rpcEndpoint = network.rpc || process.env.NEXT_PUBLIC_POLKADOT_RPC || 'wss://rpc.polkadot.io';
        setStatus(`Connecting to ${network.name} (${rpcEndpoint})...`);
        const provider = new WsProvider(rpcEndpoint);
        api = await ApiPromise.create({ provider: provider });
        
        // get the chain info including decimals
        const [chainProperties, nodeName, nodeVersion] = await Promise.all([
          api.rpc.system.properties(),
          api.rpc.system.name(),
          api.rpc.system.version()
        ]);
        
        if (!isMounted) return;
        
        // extract token decimals from chain properties
        let tokenDecimals = 10;
        if (chainProperties.tokenDecimals) {
          try {
            const decimalsArray = chainProperties.tokenDecimals.unwrap();
            console.log('Chain decimal properties:', decimalsArray.toJSON());
            if (decimalsArray.length > 0) {
              tokenDecimals = decimalsArray[0].toNumber();
              console.log('Using token decimals:', tokenDecimals);
            }
          } catch (error) {
            console.error('Error extracting token decimals:', error);
          }
        } else {
          console.warn('Chain does not provide tokenDecimals property, using default value:', tokenDecimals);
        }
        
        setChainDecimals(tokenDecimals);
        setStatus(`Connected to ${network.name}. Token decimals: ${tokenDecimals}. Preparing batch transaction...`);
        
        // Convert amounts to the chain's smallest unit based on decimals
        const DECIMALS = new BN(10).pow(new BN(tokenDecimals));
        
        // Create an array of transfer calls
        const calls = csvData.map(({ address, amount }) => {
          try {
            const amountFloat = parseFloat(amount);
            const amountString = amountFloat.toString();
            let decimalPlaces = 0;
            let integerValue = 0;
            
            // handle decimal places
            if (amountString.includes('.')) {
              const parts = amountString.split('.');
              decimalPlaces = parts[1].length;
              integerValue = parseInt(parts[0] + parts[1]);
            } else {
              integerValue = parseInt(amountString);
            }
            
            let amountBN = new BN(integerValue);
            
            if (decimalPlaces > 0) {
              const inputScale = new BN(10).pow(new BN(decimalPlaces));
              // scale up to the chain decimals
              amountBN = amountBN.mul(DECIMALS).div(inputScale);
            } else {
              amountBN = amountBN.mul(DECIMALS);
            }
            
            // debugging
            //console.log(`Address: ${address}, Amount: ${amount}, Decimals: ${tokenDecimals}, Planck: ${amountBN.toString()}`);
            
            // Create a transfer call
            return api.tx.balances.transferKeepAlive(address, amountBN);
          } catch (error) {
            console.error(`Error processing amount ${amount}: ${error.message}`);
            throw error;
          }
        });
        
        // create a batch call
        const batchCall = api.tx.utility.batchAll(calls);
        
        // get the call data (hex string)
        const callData = batchCall.toHex();
        
        // calculate total amount
        const totalAmount = csvData.reduce((sum, { amount }) => sum + amount, 0);
        
        if (!isMounted) return;


        onProcessed({
          callData,
          transactionCount: calls.length,
          totalAmount,
          chainDecimals
        });
      } catch (error) {
        if (isMounted) {
          onError(`Error: ${error.message}`);
          setStatus('Error occurred. Please try again.');
        }
      } finally {
        // Disconnect from API
        if (api) {
          api.disconnect();
        }
      }
    };

    processData();

    return () => {
      isMounted = false;
      if (api) {
        api.disconnect();
      }
    };
  }, [csvData, network, onProcessed, onError]);

  return (
    <div className="success-message">
      {status}
    </div>
  );
};

export default PolkadotProcessor;