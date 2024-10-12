import React, { useState, useContext ,useEffect,useMemo} from 'react';
import { ethers } from 'ethers';
import { PopupContext } from '../context/PopupContext';
import {AccountContext} from '../context/AccountContext';
import { useNetworkSigner } from '../context/NetworkSignerManager';

import useContracts from '../hooks/useContracts';

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
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
function TokenManagement() {
    const { selectedAccount } = useContext(AccountContext);
    const { provider } = useNetworkSigner();
    const contracts = useMemo(() => [
      { contractName: 'CloneFactory' },
      { contractName: 'MyERC20' }
  ], []);
    const { contractInstances, contractManager } = useContracts(contracts);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [tokens,setTokens] =useState([]);
  const [errors, setErrors] = useState('');
  const { openPopup } = useContext(PopupContext);
   
  useEffect(() => {
    
    const storedTokens = JSON.parse(localStorage.getItem('tokens')) || [];
    setTokens(storedTokens);
}, []);

const handleCreate = async () => {
    if (!validateCreateToken()) return;

    const cloneFactory = contractInstances['CloneFactory'];

    try {
       
        const tx = await cloneFactory.clone(contractInstances['MyERC20'].address);
        const receipt = await tx.wait();

        // 获取 Clone 合约地址
        const cloneAddress = receipt.events.find(event => event.event === 'CloneCreated')?.args.instance;
        if (!cloneAddress) {
            alert("Failed to get clone address");
            return;
        }

        // 检查 cloneAddress 是否为合约
        const code = await provider.getCode(cloneAddress);
        if (code === '0x') {
            alert("Clone address is not a contract");
            return;
        }

        const myERC20 = contractManager.getContract('MyERC20',cloneAddress);
        console.log(1)
        const initTx = await myERC20.initialize(tokenName, tokenSymbol);
        await initTx.wait();
        
        // 保存 Token 信息到 localStorage
        const newToken = { tokenName, tokenSymbol, address: cloneAddress };
        console.log(newToken);
        const updatedTokens = [...tokens, newToken];
        setTokens(updatedTokens);
        console.log(updatedTokens);

        localStorage.setItem('tokens', JSON.stringify(updatedTokens));

        alert(`Token Created: ${tokenName} (${tokenSymbol}) at ${cloneAddress}`);
    } catch (error) {
        console.error(error);
        alert("Token creation failed!");
    }
};


  const validateCreateToken = () => {
    if (!tokenName || !tokenSymbol) {
      setErrors('请填写代币名称和符号。');
      return false;
    }
    setErrors('');
    return true;
  };

  const validateMint = () => {
    if (!selectedToken || !mintAmount || isNaN(mintAmount) || Number(mintAmount) <= 0) {
      setErrors('请选择代币并输入有效的 Mint 数量。');
      return false;
    }
    setErrors('');
    return true;
  };

  const initiateMint = () => {
    if (!validateMint()) return;

    const amountParsed = ethers.utils.parseUnits(mintAmount, 18);
    const to = selectedAccount.getAddress();

    const transactionDetails = {
      type: 'Mint Token',
      tokens: [selectedToken],
      amounts: [mintAmount],
      txFunction: 'mint',
    };

    openPopup(transactionDetails, async () => {
      try {
        const connectedSigner= selectedAccount.connect(provider);

        const myERC20 = new ethers.Contract(selectedToken, [
          "function mint( uint256 amount) public",
        ], connectedSigner);

        const tx = await myERC20.mint( amountParsed);
        await tx.wait();

        alert('Token minted successfully!');
      } catch (error) {
        console.error(error);
        alert('Mint 失败！');
      }
    });
  };

  return (
    <Grid container spacing={3}>
      {/* Create Token Section */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Create Token
            </Typography>
            {errors && <Alert severity="error" sx={{ mb: 2 }}>{errors}</Alert>}
            <TextField
              label="Token Name"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
            />
            <TextField
              label="Token Symbol"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreate}
            >
              Create Token
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Mint Token Section */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Mint Token
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Token</InputLabel>
              <Select
                value={selectedToken}
                label="Select Token"
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                <MenuItem value="">选择代币</MenuItem>
                {tokens.map((token) => (
                  <MenuItem key={token.address} value={token.address}>
                    {token.tokenSymbol} ({token.tokenName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Mint Amount"
              type="number"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
              value={mintAmount}
              onChange={(e) => setMintAmount(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={initiateMint}
            >
              Mint Token
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Generated Tokens Section */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Generated Tokens
            </Typography>
            <List>
              {tokens.length > 0 ? (
                tokens.map((token, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${token.tokenName} (${token.tokenSymbol})`}
                      secondary={token.address}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">
                  No tokens created yet.
                </Typography>
              )}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default TokenManagement;
