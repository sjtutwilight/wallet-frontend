import React from 'react';
import { useNetworkSigner } from '../context/NetworkSignerManager';

const NetworkSelector = () => {
    const { network, setNetwork ,signerType} = useNetworkSigner();

    return (
        
            signerType==='internal'&&(<div>
                <label>Network:</label>
                <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                    <option value="local">Local Node</option>
                    <option value="sepolia">Sepolia Testnet</option>
                    <option value="mainnet">Mainnet</option>
                </select>
            </div>)
        
        
    );
};

export default NetworkSelector;
