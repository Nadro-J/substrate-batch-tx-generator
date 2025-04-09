import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

const CSVDropzone = ({ onDataParsed, onError, onReset }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateCSV = (data) => {
    if (!data || !data.length) {
      throw new Error('CSV file is empty');
    }

    // Check if it has exactly the two required columns: address and amount
    const headers = Object.keys(data[0]);
    if (headers.length !== 2 || !headers.includes('address') || !headers.includes('amount')) {
      throw new Error('CSV must contain exactly two columns: "address" and "amount"');
    }

    // Validate each row
    const validatedData = data.map((row, index) => {
      const { address, amount } = row;
      
      // Check if address is present and looks like a Polkadot address
      if (!address || typeof address !== 'string' || address.trim().length === 0) {
        throw new Error(`Row ${index + 1}: Missing or invalid address`);
      }
      
      // Check if address follows Polkadot format (starts with 1, 5, etc. and is the right length)
      if (!/^[1-9A-HJ-NP-Za-km-z]{47,48}$/.test(address.trim())) {
        throw new Error(`Row ${index + 1}: Address does not look like a valid address`);
      }
      
      // Check if amount is present and can be converted to a number
      if (!amount || isNaN(parseFloat(amount))) {
        throw new Error(`Row ${index + 1}: Missing or invalid amount`);
      }
      
      // Parse amount as a number
      const parsedAmount = parseFloat(amount);
      
      // Check if amount is positive
      if (parsedAmount <= 0) {
        throw new Error(`Row ${index + 1}: Amount must be greater than 0`);
      }
      
      return {
        address: address.trim(),
        amount: parsedAmount
      };
    });

    return validatedData;
  };

  const onDrop = useCallback(acceptedFiles => {
    setIsDragging(false);
    
    if (acceptedFiles.length === 0) {
      onError('No file selected');
      return;
    }

    const file = acceptedFiles[0];
    setIsProcessing(true);
    
    // Check if it's a CSV file
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    // Reset previous results
    onReset();

    // Parse the CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        setIsProcessing(false);
        try {
          if (results.errors && results.errors.length > 0) {
            throw new Error(`CSV parsing error: ${results.errors[0].message}`);
          }
          
          const validatedData = validateCSV(results.data);
          onDataParsed(validatedData);
        } catch (error) {
          onError(error.message);
        }
      },
      error: (error) => {
        setIsProcessing(false);
        onError(`Failed to parse CSV: ${error.message}`);
      }
    });
  }, [onDataParsed, onError, onReset]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: false,
    onDragEnter: () => {
      setIsDragActive(true);
      setIsDragging(true);
    },
    onDragLeave: () => {
      setIsDragActive(false);
      setIsDragging(false);
    },
    onDropAccepted: () => {
      setIsDragActive(false);
      setIsDragging(false);
    },
    onDropRejected: () => {
      setIsDragActive(false);
      setIsDragging(false);
    },
    disabled: isProcessing
  });

  return (
    <div 
      {...getRootProps()} 
      className={`dropzone ${isDragActive ? 'active' : ''} ${isProcessing ? 'processing' : ''}`}
      style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <p>Processing CSV file...</p>
      ) : isDragging ? (
        <p>Drop the CSV file here...</p>
      ) : (
        <div>
          <p>Drag and drop a CSV file here, or click to select a file</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            CSV must have exactly two columns: <strong>address</strong> and <strong>amount</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default CSVDropzone;