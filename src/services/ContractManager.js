import { ethers } from 'ethers';
import { ABIs, Address } from '../abis/index.js';

class ContractManager {
    constructor(provider, signer) {
        this.provider = provider;
        console.log(provider,signer)
        this.signer = signer.connect(provider);
        this.contracts = {};
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // 监听 LiquidityAdded 事件
        // this.listenToEvent('UniswapPair', 'Mint', (tokenA, tokenB, amountA, amountB, provider) => {
        //     const pool = {
        //         tokenA,
        //         tokenB,
        //         amountA: ethers.utils.formatUnits(amountA, 18),
        //         amountB: ethers.utils.formatUnits(amountB, 18),
        //         provider,
        //         timestamp: Date.now(),
        //     };
        //     this.saveEventToLocalStorage(pool);
        // });

        // // 监听 LiquidityRemoved 事件
        // this.listenToEvent('Router', 'LiquidityRemoved', (tokenA, tokenB, liquidity, provider) => {
        //     const poolRemoval = {
        //         tokenA,
        //         tokenB,
        //         liquidity: ethers.utils.formatUnits(liquidity, 18),
        //         provider,
        //         timestamp: Date.now(),
        //     };
        //     this.saveEventToLocalStorage(poolRemoval);
        // });

        // 添加更多事件监听
    }


    getContract(contractName, address = null) {
        if (!ABIs[contractName]) {
            throw new Error(`ABI for contract "${contractName}" not found.`);
        }

        address = address || Address[contractName];
        if (!address) {
            throw new Error(`Address for contract "${contractName}" is not provided.`);
        }
        if (this.contracts[address]) {
            return this.contracts[address];
        }


        const contract = new ethers.Contract(
            address,
            ABIs[contractName],
            this.signer ? this.signer : this.provider
        );

      
        this.contracts[address] = contract;

        return contract;
    }

    // 发送事务
    async sendTransaction(txPromise) {
        try {
            const tx = await txPromise;
            console.log(`Transaction sent: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(receipt)
            console.log(`Transaction confirmed: ${receipt.transactionHash}`);
            return receipt;
        } catch (error) {
            console.error("Transaction failed:", error);
            throw error;
        }
    }

    // 监听事件并保存到 localStorage，支持传入地址监听特定实例
    listenToEvent(contractName, eventName, callback, address = null) {
        const contract = this.getContract(contractName, address);
        contract.on(eventName, (...args) => {
            console.log(`Event ${eventName} emitted:`, args);
            callback(...args);

            // 将事件数据保存到 localStorage
            const eventData = {
                args,
                event: eventName,
                contract: contractName,
                address: contract.address,
                timestamp: Date.now(),
            };
            this.saveEventToLocalStorage(eventData);
        });
    }

    saveEventToLocalStorage(eventData) {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        events.push(eventData);
        localStorage.setItem('events', JSON.stringify(events));
    }
}

export default ContractManager;
