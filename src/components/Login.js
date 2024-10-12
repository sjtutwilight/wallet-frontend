

import React, { useState ,useContext} from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login = () => {
    const [username, setUsername] = useState('aaaa');
    const [password, setPassword] = useState('123456');
    const navigate = useNavigate(); 
    const { setUser } = useContext(UserContext);

    const handleLogin = async () => {
        try {
            const keystoreFilename = `${username}_keystore.json`;
            const keystore = localStorage.getItem(keystoreFilename);

            if (!keystore) {
                alert('User not found. Please sign up.');
                return;
            }
            setUser(username);
            navigate('/dashboard/');

            alert('Wallet loaded successfully');
        } catch (error) {
            console.error('Error loading wallet:', error);
            alert('Failed to load wallet');
        }
    };


    return (
        <div>
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
        
        </div>
    );
};

export default Login;
