import React, { useContext } from 'react';
import { AccountContext } from '../context/AccountContext';

import { UserContext } from '../context/UserContext';
import { useNetworkSigner } from '../context/NetworkSignerManager';
import { ethers } from 'ethers'; 
 const AccountSelection = () => {
    const { selectedAccount, setSelectedAccount, accounts,setAccounts,masterWallet, derivationPaths, setDerivationPaths } = useContext(AccountContext);
    const { signerType } = useNetworkSigner();
    const PATH_PREFIX = "m/44'/60'/0'/0/";
    const { user } = useContext(UserContext); 

    const handleAccountChange = (e) => {
        const selected = accounts.find(acc => acc.address === e.target.value);
        setSelectedAccount(selected);
    };

    const createAccount = () => {
        if (masterWallet) {
            const path = PATH_PREFIX + accounts.length;
            const hdwallet = masterWallet.derivePath(path);
            const wallet = new ethers.Wallet(hdwallet.privateKey);
            const newWallet = { ...wallet, path }; 
            setAccounts([...accounts, newWallet]);
            const newDerivationPaths = [...derivationPaths, path];
            setDerivationPaths(newDerivationPaths);
            localStorage.setItem(`${user}_derivationPaths`, JSON.stringify(newDerivationPaths));
            alert('Successfully created account: ' + wallet.address);
        } else {
            alert('Master wallet not available.');
        }
    };

    return (
        signerType === 'internal' && (
            <div>
                <label>Select Account: </label>
                <select value={selectedAccount?.address || ''} onChange={handleAccountChange}>
                    {accounts.map((account, index) => (
                        <option key={index} value={account.address}>
                            {account.address} - Account {index + 1}
                        </option>
                    ))}
                </select>
                <button onClick={createAccount}>Create Account</button>
            </div>
        )
    );
};
export default AccountSelection;