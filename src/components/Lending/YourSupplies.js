import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  Box
} from '@mui/material';
import useContracts from '../../hooks/useContracts';
import { ethers } from 'ethers';

function YourSupplies({ tokens }) {
  const [supplies, setSupplies] = useState([]);
  const [status, setStatus] = useState(null);

  const { contractInstances } = useContracts([
    { contractName: 'Pool', address: 'YOUR_POOL_CONTRACT_ADDRESS' }
  ]);

  useEffect(() => {
    const storedSupplies = JSON.parse(localStorage.getItem('supplies')) || [];
    setSupplies(storedSupplies);
  }, []);

  const handleWithdraw = async (asset, amount) => {
    try {
      setStatus(null);
      const poolContract = contractInstances['Pool'];
      if (!poolContract) {
        setStatus({ type: 'error', message: 'Pool 合约未加载。' });
        return;
      }

      const tx = await poolContract.withdraw(asset, ethers.utils.parseUnits(amount, 18), 'YOUR_ACCOUNT_ADDRESS');
      setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
      await tx.wait();
      setStatus({ type: 'success', message: '资产已成功提取。' });

      // 更新本地存储
      const updatedSupplies = supplies.filter(supply => supply.asset !== asset);
      setSupplies(updatedSupplies);
      localStorage.setItem('supplies', JSON.stringify(updatedSupplies));
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: '提取资产失败。' });
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: '#1e1e1e', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
          Your Supplies
        </Typography>
        {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
        <List>
          {supplies.length > 0 ? (
            supplies.map((supply, index) => {
              const token = tokens.find(t => t.address === supply.asset);
              return (
                <ListItem key={index} sx={{ backgroundColor: '#2c2c2c', borderRadius: '8px', mb: 1 }}>
                  <ListItemText
                    primary={`${token.tokenName} (${token.tokenSymbol})`}
                    secondary={`数量: ${ethers.utils.formatUnits(supply.amount, 18)}`}
                    sx={{ color: '#ffffff' }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleWithdraw(supply.asset, supply.amount)}
                    sx={{
                      backgroundColor: '#f44336',
                      '&:hover': { backgroundColor: '#d32f2f', transform: 'translateY(-2px)' },
                      transition: 'background-color 0.3s, transform 0.2s',
                      ml: 2
                    }}
                  >
                    Withdraw
                  </Button>
                </ListItem>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              No supplies found.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default YourSupplies;
