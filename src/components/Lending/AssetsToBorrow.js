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

function AssetsToBorrow({ tokens }) {
  const [assetsToBorrow, setAssetsToBorrow] = useState([]);
  const [status, setStatus] = useState(null);

  const { contractInstances } = useContracts([
    { contractName: 'Pool', address: 'YOUR_POOL_CONTRACT_ADDRESS' }
  ]);

  useEffect(() => {
    const availableAssets = tokens.filter(token => {
      // 判断是否可以借款，可以根据实际逻辑调整，这里假设所有代币都可以借款
      return true;
    });
    setAssetsToBorrow(availableAssets);
  }, [tokens]);

  const handleBorrow = async (asset) => {
    try {
      setStatus(null);
      const amount = prompt(`请输入要借入的 ${asset} 数量:`); 

      if (!amount || isNaN(amount) || Number(amount) <= 0) {
        setStatus({ type: 'error', message: '请输入有效的数量。' });
        return;
      }

      const interestRateMode = 1; 

      const poolContract = contractInstances['Pool'];
      if (!poolContract) {
        setStatus({ type: 'error', message: 'Pool 合约未加载。' });
        return;
      }

      const tx = await poolContract.borrow(
        asset,
        ethers.utils.parseUnits(amount, 18),
        interestRateMode,
        'YOUR_ACCOUNT_ADDRESS'
      );
      setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
      await tx.wait();
      setStatus({ type: 'success', message: '资产已成功借入。' });

      const storedBorrows = JSON.parse(localStorage.getItem('borrows')) || [];
      storedBorrows.push({ asset, amount: ethers.utils.parseUnits(amount, 18).toString(), interestRateMode });
      localStorage.setItem('borrows', JSON.stringify(storedBorrows));
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: '借款失败。' });
    }
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: '#1e1e1e', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: '#ffffff' }}>
          Assets to Borrow
        </Typography>
        {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
        <List>
          {assetsToBorrow.length > 0 ? (
            assetsToBorrow.map((asset, index) => (
              <ListItem key={index} sx={{ backgroundColor: '#2c2c2c', borderRadius: '8px', mb: 1 }}>
                <ListItemText
                  primary={`${asset.tokenName} (${asset.tokenSymbol})`}
                  secondary={`Borrow Rate: ${asset.borrowRate || '5%'}%`} // 使用 mock 数据
                  sx={{ color: '#ffffff' }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBorrow(asset.address)}
                  sx={{
                    backgroundColor: '#1976d2',
                    '&:hover': { backgroundColor: '#1565c0', transform: 'translateY(-2px)' },
                    transition: 'background-color 0.3s, transform 0.2s',
                    ml: 2
                  }}
                >
                  Borrow
                </Button>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              No assets available to borrow.
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

export default AssetsToBorrow;
