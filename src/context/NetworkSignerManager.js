
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletProvider';


const NetworkSignerContext = createContext();

export const useNetworkSigner = () => {
    return useContext(NetworkSignerContext);
};

const NetworkSignerManager = ({ children }) => {
    const [network, setNetwork] = useState('local');
    const [signerType, setSignerType] = useState('internal');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const networks = {
        local: 'http://127.0.0.1:8545',
        sepolia: process.env.REACT_APP_SEPOLIA_INFURA_KEY,
        mainnet: process.env.REACT_APP_MAINNET_INFURA_KEY,
    };

    useEffect(() => {
        const initializeProvider = async () => {
            if (signerType === 'metamask') {
                if (typeof window.ethereum !== 'undefined') {
                    const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
                    await metamaskProvider.send('eth_requestAccounts', []);
                    setProvider(metamaskProvider);
                    setSigner(metamaskProvider.getSigner());
                } else {
                    console.error('MetaMask not installed');
                }
            } else if (signerType === 'internal') {
                console.log(network);
                const providerUrl = networks[network];
                console.log(providerUrl);
                const customProvider = new ethers.providers.JsonRpcProvider(providerUrl);
                console.log(customProvider);
                setProvider(customProvider);
                setSigner(null);
            }
        };

        initializeProvider();
    }, [network, signerType]);

    return (
        <NetworkSignerContext.Provider value={{ network, setNetwork, signerType, setSignerType, provider, signer }}>
            {children}
        </NetworkSignerContext.Provider>
    );
};

export default NetworkSignerManager;
