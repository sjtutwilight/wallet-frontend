import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';

function TransferETH({ signer,provider }) {
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
            const connectedSigner=signer.connect(provider)
            const tx = await connectedSigner.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount),
            });
            setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
            await tx.wait();
            setStatus({ type: 'success', message: 'ETH 已成功发送。' });
            setRecipient('');
            setAmount('');
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: '发送 ETH 失败。' });
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    发送 ETH
                </Typography>
                {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
                <TextField
                    label="接收地址"
                    variant="outlined"
                    fullWidth
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="数量 (ETH)"
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

export default TransferETH;
