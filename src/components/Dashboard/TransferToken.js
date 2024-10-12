import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import {ABIs} from '../../abis';

function TransferToken({ signer, tokens,provider }) {
    const [selectedToken, setSelectedToken] = useState('');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState(null);

    const handleTransfer = async () => {
        try {
            setStatus(null);
            if (!ethers.utils.isAddress(recipient)) {
                setStatus({ type: 'error', message: '无效的接收地址。' });
                return;
            }
            if (!selectedToken) {
                setStatus({ type: 'error', message: '请选择代币。' });
                return;
            }
            const token = tokens.find(t => t.address === selectedToken);
            const connectedSigner=signer.connect(provider)
            const contract = new ethers.Contract(token.address, ABIs.ERC20, connectedSigner);
            const tx = await contract.transfer(recipient, ethers.utils.parseUnits(amount, 18));
            setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
            await tx.wait();
            setStatus({ type: 'success', message: `${token.tokenSymbol} 已成功发送。` });
            setRecipient('');
            setAmount('');
            setSelectedToken('');
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: '发送代币失败。' });
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    发送代币
                </Typography>
                {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>代币</InputLabel>
                    <Select
                        value={selectedToken}
                        label="代币"
                        onChange={(e) => setSelectedToken(e.target.value)}
                    >
                        {tokens.map((token) => (
                            <MenuItem key={token.address} value={token.address}>
                                {token.tokenSymbol} ({token.tokenName})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="接收地址"
                    variant="outlined"
                    fullWidth
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="数量"
                    variant="outlined"
                    fullWidth
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleTransfer} fullWidth>
                    发送
                </Button>
            </CardContent>
        </Card>
    );
}

export default TransferToken;
