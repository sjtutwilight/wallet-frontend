import React, { useState, useEffect,useMemo } from 'react';
import { ethers } from 'ethers';
import useContracts from '../../hooks/useContracts';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Alert
} from '@mui/material';

function Swap({tokens }) {
  const contracts = useMemo(() => [
    { contractName: 'Router' },
    { contractName: 'SwapFactory' },
], []);
  const [swapType, setSwapType] = useState('exactIn'); 
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [selectedTokens, setSelectedTokens] = useState(['', '']); 
  const [errors, setErrors] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [routerContract,setRouterContract]=useState();
  const {  contractManager } = useContracts(contracts);
  const [signer,setSigner]=useState();
  useEffect(() => {
    setRouterContract(contractManager.getContract('Router')) ;
    console.log(contractManager)
   setSigner(contractManager.signer)
   
}, [contractManager])
  const handleTokenChange = (index, address) => {
    const newSelectedTokens = [...selectedTokens];
    newSelectedTokens[index] = address;
    setSelectedTokens(newSelectedTokens);
  };

  const addTokenSelector = () => {
    setSelectedTokens([...selectedTokens, '']);
  };

  const removeTokenSelector = (index) => {
    const newSelectedTokens = selectedTokens.filter((_, i) => i !== index);
    setSelectedTokens(newSelectedTokens);
  };

  const buildPath = () => {
    return selectedTokens.filter(addr => addr !== '');
  };

  const validate = () => {
    const path = buildPath();
    if (path.length < 2) {
      setErrors('交易路径必须包含至少两个不同的代币。');
      return false;
    }
    const unique = new Set(path);
    if (unique.size !== path.length) {
      setErrors('交易路径中的代币必须唯一。');
      return false;
    }
    setErrors('');
    return true;
  };

  const swapTokensForExactTokens = async () => {
    if (!validate()) return;

    const pathArray = buildPath();
    const amountOutParsed = ethers.utils.parseUnits(amountOut, 18);
    const amountInMax = ethers.utils.parseUnits(amountIn, 18);
    const to = await signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 分钟后截止

    setIsSwapping(true);
    try {
      const tx = await routerContract.swapTokenForExactToken(
        amountInMax,
        amountOutParsed,
        pathArray,
        to,
        deadline
      );
      await contractManager.sendTransaction(tx);
      alert('交易成功执行！');
    } catch (error) {
      console.error(error);
      alert('交易执行失败！');
    }
    setIsSwapping(false);
  };

  const swapExactTokensForTokens = async () => {
    if (!validate()) return;

    const pathArray = buildPath();
    const amountInParsed = ethers.utils.parseUnits(amountIn, 18);
    const amountOutMin = 0;
    const to = await signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 分钟后截止

    setIsSwapping(true);
    try {
      console.log(routerContract)
      const tx = await routerContract.swapExactTokenForToken(
        amountInParsed,
        amountOutMin,
        pathArray,
        to,
        deadline
      );
      await contractManager.sendTransaction(tx);
      alert('交易成功执行！');
    } catch (error) {
      console.error(error);
      alert('交易执行失败！');
    }
    setIsSwapping(false);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          ERC20 Token 交换
        </Typography>
        {errors && <Alert severity="error" sx={{ mb: 2 }}>{errors}</Alert>}

        {/* Swap Type Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>选择交换类型</InputLabel>
          <Select
            value={swapType}
            label="选择交换类型"
            onChange={(e) => setSwapType(e.target.value)}
          >
            <MenuItem value="exactIn">精确输入交换</MenuItem>
            <MenuItem value="exactOut">精确输出交换</MenuItem>
          </Select>
        </FormControl>

        {/* Token Path Selection */}
        <Typography variant="h6" gutterBottom>
          选择交易路径
        </Typography>
        {selectedTokens.map((token, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <FormControl fullWidth>
              <InputLabel>选择代币</InputLabel>
              <Select
                value={token}
                label="选择代币"
                onChange={(e) => handleTokenChange(index, e.target.value)}
              >
                <MenuItem value="">选择代币</MenuItem>
                {tokens.map((tok) => (
                  <MenuItem key={tok.address} value={tok.address}>
                    {tok.tokenSymbol} ({tok.tokenName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedTokens.length > 2 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeTokenSelector(index)}
                sx={{ ml: 1 }}
              >
                -
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="contained"
          color="secondary"
          onClick={addTokenSelector}
          sx={{ mb: 2 }}
        >
          + 添加代币
        </Button>

        {/* Swap Form */}
        {swapType === 'exactIn' ? (
          <div>
            <Typography variant="h6" gutterBottom>
              精确输入交换
            </Typography>
            <TextField
              label="输入代币数量"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={swapExactTokensForTokens}
              fullWidth
              disabled={isSwapping}
            >
              {isSwapping ? '正在交换...' : '执行交换'}
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h6" gutterBottom>
              精确输出交换
            </Typography>
            <TextField
              label="输出代币数量"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={amountOut}
              onChange={(e) => setAmountOut(e.target.value)}
            />
            <TextField
              label="最大输入代币数量"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={swapTokensForExactTokens}
              fullWidth
              disabled={isSwapping}
            >
              {isSwapping ? '正在交换...' : '执行交换'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default Swap;
