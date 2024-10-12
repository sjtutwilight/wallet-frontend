import React, { useState, useEffect, useContext,useMemo } from 'react';
import { ethers } from 'ethers';
import { PopupContext } from '../../context/PopupContext';
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
function Liquidity({  tokens }) {
    const contracts = useMemo(() => [
        { contractName: 'Router' },
        { contractName: 'SwapFactory' },
    ], []);
    const { contractInstances, contractManager } = useContracts(contracts);
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [selectedTokenA, setSelectedTokenA] = useState();
  const [selectedTokenB, setSelectedTokenB] = useState();
  const [pools, setPools] = useState([]);
  const [errors, setErrors] = useState('');
  const { openPopup } = useContext(PopupContext);
 const [routerContract,setRouterContract]=useState();
 const [signer,setSigner]=useState();
  useEffect(() => {
      // 从 localStorage 加载池信息
      const storedPools = JSON.parse(localStorage.getItem('pools')) || [];
      setRouterContract(contractInstances['Router']) ;
      console.log(contractManager)
      setSigner(contractManager.signer);
      setPools(storedPools);
     
  }, [contractManager, contractInstances]);

  const addPoolToLocalStorage = (pool) => {
      const updatedPools = [...pools, pool];
      setPools(updatedPools);
      localStorage.setItem('pools', JSON.stringify(updatedPools));
  };

  const validateTokens = () => {
      if (selectedTokenA.address === selectedTokenB.address) {
          setErrors('Token A 和 Token B 不能相同。');
          return false;
      }
      setErrors('');
      return true;
  };

  const isTokenApproved = (tokenAddress) => {
      const approvedTokens = JSON.parse(localStorage.getItem('approvedTokens')) || {};
      const signerAddress = signer.getAddress();
      return approvedTokens[signerAddress]?.[tokenAddress] === true;
  };

  const setTokenApproved = (tokenAddress) => {
      const approvedTokens = JSON.parse(localStorage.getItem('approvedTokens')) || {};
      const signerAddress = signer.getAddress();
      if (!approvedTokens[signerAddress]) {
          approvedTokens[signerAddress] = {};
      }
      approvedTokens[signerAddress][tokenAddress] = true;
      localStorage.setItem('approvedTokens', JSON.stringify(approvedTokens));
  };

  // Function to approve token allowance via Pop-up
  const approveToken = async (tokenAddress) => {
    //   if (await isTokenApproved(tokenAddress)) {
    //       return true;
    //   }
      const tokenContract = contractManager.getContract('MyERC20',tokenAddress);


      const approveDetails = {
          type: 'Approve Token',
          tokens: [tokenAddress],
          amounts: ['Max'],
          txFunction: 'approve',
      };

      return new Promise((resolve, reject) => {
          openPopup(approveDetails, async () => {
              try {
                  const tx = await tokenContract.approve(routerContract.address, ethers.constants.MaxUint256);
                  contractManager.sendTransaction(tx)
                  setTokenApproved(tokenAddress);
                  resolve(true);
              } catch (error) {
                  console.error(`Approve ${tokenAddress} failed:`, error);
                  reject(error);
              }
          });
      });
  };
  const approveLPToken = async (lpTokenAddress) => {
    console.log(lpTokenAddress)
    const tokenContract =contractManager.getContract('UniswapPair',lpTokenAddress);

    const approveDetails = {
        type: 'Approve LP Token',
        tokens: [lpTokenAddress],
        amounts: ['Max'],
        txFunction: 'approve',
    };
    console.log(tokenContract)

    return new Promise((resolve, reject) => {
        openPopup(approveDetails, async () => {
            try {
                const tx = await tokenContract.approve(routerContract.address, ethers.constants.MaxUint256);
                await contractManager.sendTransaction(tx);
                resolve(true);
            } catch (error) {
                console.error(`Approve LP Token ${lpTokenAddress} failed:`, error);
                reject(error);
            }
        });
    });
};
  const initiateAddLiquidity = async () => {
      if (!validateTokens()) return;
      console.log(selectedTokenA)
      try {
          // 检查池是否存在
          let pool = pools.find(p => 
              (p.symbol=== selectedTokenA.tokenSymbol+'/'+ selectedTokenB.tokenSymbol) ||
              (p.symbol === selectedTokenB.tokenSymbol+'/'+ selectedTokenA.tokenSymbol)
          );

          if (!pool) {
              const createPool = window.confirm('Pool 不存在，是否创建？');
              if (!createPool) {
                  return;
              }
              pool={};
              pool.tokenA=selectedTokenA.address;
              pool.tokenB=selectedTokenB.tokenSymbol;
              pool.symbol=selectedTokenA.tokenSymbol+'/'+selectedTokenB.tokenSymbol
              addPoolToLocalStorage(pool);
          }

          // 先授权 tokenA 和 tokenB
          await approveToken(selectedTokenA.address);
          await approveToken(selectedTokenB.address);

          // 执行添加流动性
          const amountADesired = ethers.utils.parseUnits(tokenAAmount, 18);
          const amountBDesired = ethers.utils.parseUnits(tokenBAmount, 18);
          const to = await signer.getAddress();
          const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 分钟后截止
          const tx = await routerContract.addLiquidity(
              selectedTokenA.address,
              selectedTokenB.address,
              amountADesired,
              amountBDesired,
              0,
              0,
              to,
              deadline
          );
         
         
          await contractManager.sendTransaction(tx);

          alert('Liquidity added successfully!');
      } catch (error) {
          console.error(error);
          alert('添加流动性失败！');
      }
  };

  const initiateRemoveLiquidity = async () => {
      if (!validateTokens()) return;

      try {
        
          let pool = pools.find(p => 
            (p.symbol=== selectedTokenA.tokenSymbol+'/'+ selectedTokenB.tokenSymbol) ||
            (p.symbol === selectedTokenB.tokenSymbol+'/'+ selectedTokenA.tokenSymbol)
        );
          if (!pool) {
              alert('对应的池信息不存在。');
              return;
          }
          const factoryContract = contractManager.getContract('SwapFactory');
          const pairAddress = await factoryContract.getPair(selectedTokenA.address, selectedTokenB.address);
          
          if (!pairAddress) {
              alert('LP Token 地址未定义。');
              return;
          }

          await approveLPToken(pairAddress);

          // 执行移除流动性
          const liquidity = ethers.utils.parseUnits(liquidityAmount, 18);
          const to = await signer.getAddress();
          const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
          console.log(selectedTokenA.address,
            selectedTokenB.address,
            liquidity,
            0,
            0,
            to,
            deadline)
          const tx = await routerContract.removeLiquidity(
              selectedTokenA.address,
              selectedTokenB.address,
              liquidity,
              0,
              0,
              to,
              deadline
          );
          await contractManager.sendTransaction(tx);

          // 不从 localStorage 删除池信息
          alert('Liquidity removed successfully!');
      } catch (error) {
          console.error(error);
          alert('移除流动性失败！');
      }
  };


    const initiateRemoveLiquidityWithPermit = async () => {
        if (!validateTokens()) return;

        try {
            let pool = pools.find(p => 
                (p.symbol=== selectedTokenA.tokenSymbol+'/'+ selectedTokenB.tokenSymbol) ||
                (p.symbol === selectedTokenB.tokenSymbol+'/'+ selectedTokenA.tokenSymbol)
            );
              if (!pool) {
                  alert('对应的池信息不存在。');
                  return;
              }
    
            const factoryContract = contractManager.getContract('SwapFactory');
            const pairAddress = await factoryContract.getPair(selectedTokenA.address, selectedTokenB.address);
            

            // 获取 Permit 签名
            const chainId = (await contractManager.provider.getNetwork()).chainId;
            const owner = await signer.getAddress();
            const spender = routerContract.address;
            const value = ethers.utils.parseUnits(liquidityAmount, 18);

            const lpTokenAddress = pairAddress; 
    
            const tokenContract = contractManager.getContract('UniswapPair',lpTokenAddress);
            const nonce = await tokenContract.nonces(owner);
            const domainSeparator = await tokenContract.DOMAIN_SEPARATOR();

            const domain = {
                name: "LPToken", 
                version: "1",
                chainId: chainId,
                verifyingContract: lpTokenAddress,
            };

            const types = {
                Permit: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "nonce", type: "uint256" },
                    { name: "deadline", type: "uint256" },
                ],
            };
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 分钟后截止

            const permitDeadline = deadline;

            const valueData = {
                owner,
                spender,
                value: value.toString(),
                nonce: nonce.toString(),
                deadline: permitDeadline,
            };

            const signatureDetails = {
                type: 'Permit Signature',
                tokens: [lpTokenAddress],
                amounts: [liquidityAmount],
                txFunction: 'permit',
            };

            await openPopup(signatureDetails, async () => {
                try {
                    console.log(domain, types, valueData)
                    const signature = await signer._signTypedData(domain, types, valueData);
                    const { v, r, s } = ethers.utils.splitSignature(signature);
                    console.log(selectedTokenA.address,
                        selectedTokenB.address,',',
                        value,',',
                        0,',',
                        0,',',
                        signer.getAddress(),',',
                        permitDeadline,',',
                        false, ',',// approveMax
                        v,',',
                        r,',',
                        s)
                    // 调用 removeLiquidityWithPermit
                    const tx = await routerContract.removeLiquidityWithPermit(
                        selectedTokenA.address,
                        selectedTokenB.address,
                        value,
                        0,
                        0,
                        signer.getAddress(),
                        permitDeadline,
                        false, // approveMax
                        v,
                        r,
                        s
                    );
                    await contractManager.sendTransaction(tx);

                    // 不从 localStorage 删除池信息
                    alert('Liquidity removed with permit successfully!');
                } catch (error) {
                    console.error(error);
                    alert('移除流动性失败！');
                }
            });

        } catch (error) {
            console.error(error);
            alert('移除流动性失败！');
        }
    };

  
        return (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  添加/移除流动性
                </Typography>
                {errors && <Alert severity="error" sx={{ mb: 2 }}>{errors}</Alert>}
                
                {/* Token A Selection */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Token A</InputLabel>
                  <Select
                    value={selectedTokenA ? JSON.stringify(selectedTokenA) : ""}
                    label="Token A"
                    onChange={(e) => setSelectedTokenA(JSON.parse(e.target.value))}
                  >
                    <MenuItem value="">选择 Token A</MenuItem>
                    {tokens.map((token, index) => (
                      <MenuItem key={index} value={JSON.stringify(token)}>
                        {token.tokenSymbol} ({token.tokenName})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
        
                {/* Token B Selection */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Token B</InputLabel>
                  <Select
                    value={selectedTokenB ? JSON.stringify(selectedTokenB) : ""}
                    label="Token B"
                    onChange={(e) => setSelectedTokenB(JSON.parse(e.target.value))}
                  >
                    <MenuItem value="">选择 Token B</MenuItem>
                    {tokens.map((token, index) => (
                      <MenuItem key={index} value={JSON.stringify(token)}>
                        {token.tokenSymbol} ({token.tokenName})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
        
                {/* Token A Amount */}
                <TextField
                  label="Token A 数量"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={tokenAAmount}
                  onChange={(e) => setTokenAAmount(e.target.value)}
                />
        
                {/* Token B Amount */}
                <TextField
                  label="Token B 数量"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={tokenBAmount}
                  onChange={(e) => setTokenBAmount(e.target.value)}
                />
        
                {/* Add Liquidity Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={initiateAddLiquidity}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  添加流动性
                </Button>
        
                <Typography variant="h6" sx={{ mt: 2 }}>
                  移除流动性
                </Typography>
        
                {/* Liquidity Amount */}
                <TextField
                  label="流动性数量"
                  type="number"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                />
        
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={initiateRemoveLiquidity}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  移除流动性
                </Button>
        
                <Button
                  variant="contained"
                  color="warning"
                  onClick={initiateRemoveLiquidityWithPermit}
                  fullWidth
                >
                  使用 Permit 移除流动性
                </Button>
              </CardContent>
            </Card>
          );

}

export default Liquidity;