import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid } from '@mui/material';
import BalanceDisplay from './BalanceDisplay.js';
import TransferETH from './TransferETH.js';
import TransferToken from './TransferToken.js';
import AddToken from './AddToken.js';
import TransactionHistory from './TransactionHistory.js';
import TrendDisplay from './TrendDisplay.js';
import { AccountContext } from '../../context/AccountContext.js';
import { useNetworkSigner } from '../../context/NetworkSignerManager.js';

function Dashboard() {
    const { selectedAccount } = useContext(AccountContext);
    const [tokens, setTokens] = useState([]);
    const { provider } = useNetworkSigner();
    useEffect(() => {
        const storedTokens = JSON.parse(localStorage.getItem('tokens')) || [];
        setTokens(storedTokens);
    }, []);

    return (
        
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, backgroundColor: '#f4f4f4', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', p: 2 }}>
                <Grid container spacing={3}>
                    {/* 余额显示 */}
                    <Grid item xs={12} md={6} lg={4}>
                        <BalanceDisplay signer={selectedAccount} tokens={tokens} provider={provider} />
                    </Grid>
    
                    {/* 发送 ETH */}
                    <Grid item xs={12} md={6} lg={4}>
                        <TransferETH signer={selectedAccount} provider={provider} />
                    </Grid>
    
                    {/* 发送代币 */}
                    <Grid item xs={12} md={6} lg={4}>
                        <TransferToken signer={selectedAccount} tokens={tokens} provider={provider} />
                    </Grid>
    
                    {/* 添加代币 */}
                    <Grid item xs={12} md={6} lg={4}>
                        <AddToken signer={selectedAccount} tokens={tokens} setTokens={setTokens} provider={provider} />
                    </Grid>
      {/* 近期趋势展示 */}
      <Grid item xs={12} md={6} lg={8}>
                        <TrendDisplay />
                    </Grid>
                    {/* 用户交易记录 */}
                    <Grid item xs={12} md={6} lg={8}>
                        <TransactionHistory />
                    </Grid>
    
                  
                </Grid>
            </Container>
        );
}

export default Dashboard;
