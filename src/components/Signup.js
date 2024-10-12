import React, { useState } from 'react';
import { ethers } from 'ethers';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mnemonic, setMnemonic] = useState("");
    const [keystore, setKeystore] = useState(null);
    const INITIALIZED_PATH="m/44'/60'/0'/0/0";
    const handleSignup = async () => {
        try {
            const keystoreFilename = `${username}_keystore.json`;
            const keystore = localStorage.getItem(keystoreFilename);

            if (keystore) {
                alert('Already sign up ,please login.');
                return;
            }
            const mnemonic=ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));

            setMnemonic(mnemonic);
            // Generate the master key pair using the mnemonic
            const masterNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
            console.log(masterNode);

            const masterWallet=new ethers.Wallet(masterNode.privateKey);

            const encryptedJson = await masterWallet.encrypt(password);
            const derivationPaths = JSON.parse(localStorage.getItem(`${username}_derivationPaths`)) || [];
            derivationPaths.push(INITIALIZED_PATH);
            const mnemonicFileName= `${username}_mnemonic`;
            localStorage.setItem(keystoreFilename, encryptedJson);
            setKeystore(encryptedJson);
            localStorage.setItem(mnemonicFileName, mnemonic);       
            localStorage.setItem(`${username}_derivationPaths`, JSON.stringify(derivationPaths));
            console.log("store:"+JSON.stringify(derivationPaths));
            alert('Wallet created and encrypted');
        } catch (error) {
            console.error('Error creating wallet:', error);
            alert('Failed to create wallet');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <textarea
                placeholder="Mnemonic"
                value={mnemonic}
                rows={3}
            />
  
            <button onClick={handleSignup}>Sign Up</button>
            {keystore && (
                <div>
                    <h3>Keystore Created</h3>
                    <p>Keystore saved as {`${username}_keystore.json`}</p>
                </div>
            )}
        </div>
    );
};

export default Signup;
