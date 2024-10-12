import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import {ABIs} from '../../abis';

function AddToken({ signer, tokens, setTokens ,provider}) {
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenSymbol, setTokenSymbol] = useState('');
    const [tokenName, setTokenName] = useState('');
    const [status, setStatus] = useState(null);

    const handleAddToken = async () => {
        try {
            setStatus(null);
            if (!ethers.utils.isAddress(tokenAddress)) {
                setStatus({ type: 'error', message: '无效的代币合约地址。' });
                return;
            }
            const connectedSigner=signer.connect(provider)
            const contract = new ethers.Contract(tokenAddress, ABIs.ERC20, connectedSigner);
            const [name, symbol] = await Promise.all([contract.name(), contract.symbol()]);
            const newToken = { address: tokenAddress, name, symbol };
            setTokens([...tokens, newToken]);
            localStorage.setItem('tokens', JSON.stringify([...tokens, newToken]));
            setStatus({ type: 'success', message: `${symbol} 已成功添加。` });
            setTokenAddress('');
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: '添加代币失败。确保代币合约地址正确且兼容 ERC20。' });
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    添加代币
                </Typography>
                {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
                <TextField
                    label="代币合约地址"
                    variant="outlined"
                    fullWidth
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleAddToken} fullWidth>
                    添加代币
                </Button>
            </CardContent>
        </Card>
    );
}

export default AddToken;
