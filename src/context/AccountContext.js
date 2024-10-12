import React, { createContext, useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import { ethers } from 'ethers'; 
import { useNetworkSigner } from './NetworkSignerManager';

export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [derivationPaths, setDerivationPaths] = useState([]);
    const [masterWallet, setMasterWallet] = useState(null);

    const { user } = useContext(UserContext);
    const PATH_PREFIX = "m/44'/60'/0'/0/";

    useEffect(() => {
        const getMasterWallet = async () => {
            const mnemonicFilename = `${user}_mnemonic`;
            const mnemonic = localStorage.getItem(mnemonicFilename);
            if (mnemonic) {
                const hdwallet = ethers.utils.HDNode.fromMnemonic(mnemonic);
                setMasterWallet(hdwallet);
                const storedDerivationPaths = JSON.parse(localStorage.getItem(`${user}_derivationPaths`)) || [];
                setDerivationPaths(storedDerivationPaths);
                const newAccounts = storedDerivationPaths.map(path => {
                    const wallet = hdwallet.derivePath(path);
                    return new ethers.Wallet(wallet.privateKey); 
                });
                setAccounts(newAccounts);
                console.log(newAccounts)
                
                if (newAccounts.length > 0) {
                    setSelectedAccount(newAccounts[0]);
                }
            }
        };
         getMasterWallet();
    }, [user]);

    return (
        <AccountContext.Provider
            value={{ selectedAccount, setSelectedAccount, accounts, setAccounts, masterWallet, derivationPaths, setDerivationPaths }}
        >
            {children}
        </AccountContext.Provider>
    );
};



export  default AccountProvider;
