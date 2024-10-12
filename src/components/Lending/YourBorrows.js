import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert
} from '@mui/material';
import useContracts from '../../hooks/useContracts';
import { ethers } from 'ethers';

function YourBorrows({ tokens }) {
  const [borrows, setBorrows] = useState([]);
  const [status, setStatus] = useState(null);

  const { contractInstances } = useContracts([
    { contractName: 'Pool', address: 'YOUR_POOL_CONTRACT_ADDRESS' }
  ]);

  useEffect(() => {
    const storedBorrows = JSON.parse(localStorage.getItem('borrows')) || [];
    setBorrows(storedBorrows);
  }, []);

  const handleRepay = async (asset, amount, interestRateMode) => {
    try {
      setStatus(null);
      const poolContract = contractInstances['Pool'];
      if (!poolContract) {
        setStatus({ type: 'error', message: 'Pool 合约未加载。' });
        return;
      }

      const tx = await poolContract.repay(
        asset,
        ethers.utils.parseUnits(amount, 18),
        interestRateMode,
        'YOUR_ACCOUNT_ADDRESS'
      );
      setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
      await tx.wait();
      setStatus({ type: 'success', message: '借款已成功偿还。' });

      // 更新本地存储
      const updatedBorrows = borrows.filter(borrow => borrow.asset !== asset);
      setBorrows(updatedBorrows);
      localStorage.setItem('borrows', JSON.stringify(updatedBorrows));
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: '偿还借款失败。' });
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: '#1e1e1e', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
          Your Borrows
        </Typography>
        {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
        <List>
          {borrows.length > 0 ? (
            borrows.map((borrow, index) => {
              const token = tokens.find(t => t.address === borrow.asset);
              return (
                <ListItem key={index} sx={{ backgroundColor: '#2c2c2c', borderRadius: '8px', mb: 1 }}>
                  <ListItemText
                    primary={`${token.tokenName} (${token.tokenSymbol})`}
                    secondary={`数量: ${ethers.utils.formatUnits(borrow.amount, 18)} | 利率模式: ${borrow.interestRateMode === 1 ? '稳定' : '可变'}`}
                    sx={{ color: '#ffffff' }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRepay(borrow.asset, borrow.amount, borrow.interestRateMode)}
                    sx={{
                      backgroundColor: '#1976d2',
                      '&:hover': { backgroundColor: '#1565c0', transform: 'translateY(-2px)' },
                      transition: 'background-color 0.3s, transform 0.2s',
                      ml: 2
                    }}
                  >
                    Repay
                  </Button>
                </ListItem>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              No borrows found.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default YourBorrows;
