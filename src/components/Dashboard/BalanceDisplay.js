import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import {ABIs} from '../../abis';

function BalanceDisplay({ signer, tokens,provider }) {
    const [ethBalance, setEthBalance] = useState('0.00');
    const [tokenBalances, setTokenBalances] = useState([]);

    useEffect(() => {
        const fetchBalances = async () => {
            if (!signer) return;

            // 获取 ETH 余额
            const address = await signer.getAddress();
            const balance = await provider.getBalance(address);
            setEthBalance(ethers.utils.formatEther(balance));
            console.log(tokens)
            // 获取 ERC20 代币余额
            const balances = await Promise.all(tokens.map(async (token) => {
                const connectedSigner=signer.connect(provider)
                console.log(connectedSigner)
            const contract = new ethers.Contract(token.address, ABIs.ERC20, connectedSigner);
            console.log(address)
            console.log(contract)
                const balance = await contract.balanceOf(address);
                return {
                    symbol: token.tokenSymbol,
                    balance: ethers.utils.formatUnits(balance, 18),
                };
            }));

            setTokenBalances(balances);
        };

        fetchBalances();
    }, [signer, tokens]);

    return (
        <Card sx={{ mb: 2, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: 4 }}>
        <CardContent>
            <Typography variant="h5" gutterBottom>
                余额
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle1" color="textSecondary">
                        ETH
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {ethBalance} ETH
                    </Typography>
                </Grid>
                {tokenBalances.map((token, index) => (
                    <Grid item xs={12} sm={12} key={index}>
                        <Typography variant="subtitle1" color="textSecondary">
                            {token.symbol}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            {token.balance} {token.symbol}
                        </Typography>
                    </Grid>
                ))}
            </Grid>
        </CardContent>
    </Card>
    );
}

export default BalanceDisplay;
