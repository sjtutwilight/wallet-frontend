
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => {
    return useContext(WalletContext);
};

const WalletProvider = ({ children }) => {
    const [wallet, setWallet] = useState(null);

    const createWallet = (mnemonic, password) => {
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        const encryptedJson = wallet.encrypt(password);
        setWallet(wallet);
        return encryptedJson;
    };

    const loadWallet = async (encryptedJson, password) => {
        const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
        setWallet(wallet);
    };

    const value = {
        wallet,
        createWallet,
        loadWallet,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;
