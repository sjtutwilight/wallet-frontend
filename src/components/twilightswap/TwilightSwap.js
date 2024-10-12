import React, { useEffect, useState } from 'react';
import Liquidity from './Liquidity';
import Swap from './Swap';
import './TwilightSwap.css'; 

function TwilightSwap() {

  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    async function init() {
      const storedTokens = JSON.parse(localStorage.getItem('tokens')) || [];
        setTokens(storedTokens);
    }
    init();
  }, []);

  return (
    <div className="twilight-swap-container">
      {tokens ? (
        <div className="components-container">
          <Liquidity tokens={tokens} />
          <Swap  tokens={tokens} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TwilightSwap;
