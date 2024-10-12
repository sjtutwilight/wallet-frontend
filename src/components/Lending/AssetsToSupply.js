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

function AssetsToSupply({ tokens }) {
  const [assetsToSupply, setAssetsToSupply] = useState([]);
  const [status, setStatus] = useState(null);

  const { contractInstances } = useContracts([
    { contractName: 'Pool', address: 'YOUR_POOL_CONTRACT_ADDRESS' }
  ]);

  useEffect(() => {
    const availableAssets = tokens.filter(token => {
     
      return true;
    });
    setAssetsToSupply(availableAssets);
  }, [tokens]);

  const handleSupply = async (asset) => {
    try {
      setStatus(null);
      const amount = prompt(`请输入要供应的 ${asset} 数量:`); 

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        setStatus({ type: 'error', message: '请输入有效的数量。' });
        return;
      }

      const poolContract = contractInstances['Pool'];
      if (!poolContract) {
        setStatus({ type: 'error', message: 'Pool 合约未加载。' });
        return;
      }

      const tx = await poolContract.supply(asset, ethers.utils.parseUnits(amount, 18), 'YOUR_ACCOUNT_ADDRESS');
      setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
      await tx.wait();
      setStatus({ type: 'success', message: '资产已成功供应。' });

      // 更新本地存储
      const storedSupplies = JSON.parse(localStorage.getItem('supplies')) || [];
      storedSupplies.push({ asset, amount: ethers.utils.parseUnits(amount, 18).toString() });
      localStorage.setItem('supplies', JSON.stringify(storedSupplies));
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: '供应资产失败。' });
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: '#1e1e1e', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
          Assets to Supply
        </Typography>
        {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
        <List>
          {assetsToSupply.length > 0 ? (
            assetsToSupply.map((asset, index) => (
              <ListItem key={index} sx={{ backgroundColor: '#2c2c2c', borderRadius: '8px', mb: 1 }}>
                <ListItemText
                  primary={`${asset.tokenName} (${asset.tokenSymbol})`}
                  secondary={`APY: ${asset.apy || '10%'}%`} 
                  sx={{ color: '#ffffff' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSupply(asset.address)}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0', transform: 'translateY(-2px)' },
                    transition: 'background-color 0.3s, transform 0.2s',
                    ml: 2
                  }}
                >
                  Supply
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              No assets available to supply.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default AssetsToSupply;
