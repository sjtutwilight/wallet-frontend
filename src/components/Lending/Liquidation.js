import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import useContracts from '../../hooks/useContracts';
import { ethers } from 'ethers';

function Liquidation({ tokens }) {
  const [collateralAsset, setCollateralAsset] = useState('');
  const [debtAsset, setDebtAsset] = useState('');
  const [user, setUser] = useState('');
  const [debtToCover, setDebtToCover] = useState('');
  const [receiveAToken, setReceiveAToken] = useState(false);
  const [status, setStatus] = useState(null);

  const { contractInstances, contractManager } = useContracts([
    { contractName: 'Pool', address: 'YOUR_POOL_CONTRACT_ADDRESS' }
  ]);

  const handleLiquidation = async () => {
    try {
      setStatus(null);
      if (!collateralAsset || !debtAsset || !user || !debtToCover) {
        setStatus({ type: 'error', message: '请填写所有字段。' });
        return;
      }

      const poolContract = contractInstances['Pool'];
      if (!poolContract) {
        setStatus({ type: 'error', message: 'Pool 合约未加载。' });
        return;
      }

      const tx = await poolContract.liquidationCall(
        collateralAsset,
        debtAsset,
        user,
        ethers.utils.parseUnits(debtToCover, 18),
        receiveAToken
      );
      setStatus({ type: 'info', message: `交易已发送: ${tx.hash}` });
      await tx.wait();
      setStatus({ type: 'success', message: '清算操作已成功执行。' });
      setCollateralAsset('');
      setDebtAsset('');
      setUser('');
      setDebtToCover('');
      setReceiveAToken(false);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: '清算操作失败。' });
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          清算操作
        </Typography>
        {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.message}</Alert>}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>抵押资产</InputLabel>
          <Select
            value={collateralAsset}
            label="抵押资产"
            onChange={(e) => setCollateralAsset(e.target.value)}
          >
            <MenuItem value="">选择抵押资产</MenuItem>
            {tokens.map((token) => (
              <MenuItem key={token.address} value={token.address}>
                {token.tokenSymbol} ({token.tokenName})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>债务资产</InputLabel>
          <Select
            value={debtAsset}
            label="债务资产"
            onChange={(e) => setDebtAsset(e.target.value)}
          >
            <MenuItem value="">选择债务资产</MenuItem>
            {tokens.map((token) => (
              <MenuItem key={token.address} value={token.address}>
                {token.tokenSymbol} ({token.tokenName})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="用户地址"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        <TextField
          label="要清算的债务数量"
          type="number"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={debtToCover}
          onChange={(e) => setDebtToCover(e.target.value)}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>接收 AToken</InputLabel>
          <Select
            value={receiveAToken ? 'yes' : 'no'}
            label="接收 AToken"
            onChange={(e) => setReceiveAToken(e.target.value === 'yes')}
          >
            <MenuItem value="no">否</MenuItem>
            <MenuItem value="yes">是</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="warning"
          onClick={handleLiquidation}
          fullWidth
        >
          执行清算
        </Button>
      </CardContent>
    </Card>
  );
}

export default Liquidation;
