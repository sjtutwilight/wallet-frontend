import React from 'react';
import { useNetworkSigner } from '../context/NetworkSignerManager';

const SignerSelector = () => {
    const { signerType, setSignerType } = useNetworkSigner();

    return (
        <div>
            <label>Signer:</label>
            <select value={signerType} onChange={(e) => setSignerType(e.target.value)}>
                <option value="internal">Internal Wallet</option>
                <option value="metamask">MetaMask</option>
            </select>
        </div>
    );
};

export default SignerSelector;
