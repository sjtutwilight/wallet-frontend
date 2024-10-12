// src/abis/index.js

import RouterABI from './Router.json';
import MyERC20ABI from './MyERC20.json';
import ERC20ABI from './ERC20.json';

import SwapFactoryABI from './SwapFactory.json';
import CloneFactoryABI from './CloneFactory.json';
import UniswapPairABI from './UniswapPair.json';
import LoanPoolABI from './LoanPool.json';
// 导入其他合约的 ABI

const ABIs = {
    Router: RouterABI,
    MyERC20: MyERC20ABI,
    SwapFactory:SwapFactoryABI,
    CloneFactory:CloneFactoryABI,
    UniswapPair:UniswapPairABI,
    ERC20:ERC20ABI,
    Pool:LoanPoolABI
    // 添加其他合约
};
const Address={
    Router: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
    SwapFactory:'0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1',
    CloneFactory:'0x3Aa5ebB10DC797CAC828524e59A333d0A371443c',
    MyERC20:'0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E',
    Pool:'0x09635F643e140090A9A8Dcd712eD6285858ceBef'
}

export  {ABIs,Address};

