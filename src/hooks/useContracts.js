
import { useContext, useEffect, useMemo, useState } from 'react';
import { AccountContext } from '../context/AccountContext';
import { useNetworkSigner } from '../context/NetworkSignerManager';
import ContractManager from '../services/ContractManager';

const useContracts = (contracts) => {
    const { selectedAccount } = useContext(AccountContext);
    const { provider } = useNetworkSigner();
    const [contractInstances, setContractInstances] = useState({});
    const [error, setError] = useState(null);

    // 使用 useMemo 缓存 ContractManager 实例
    const contractManager = useMemo(() => {
        if (!provider || !selectedAccount) return null;
        return new ContractManager(provider, selectedAccount);
    }, [provider, selectedAccount]);

    useEffect(() => {
        const initializeContracts = async () => {
            if (!contractManager || contracts.length === 0) return;

            try {
                const instances = {};
                contracts.forEach(({ contractName, address }) => {
                    instances[contractName] = contractManager.getContract(contractName, address);
                });
                setContractInstances(instances);
            } catch (err) {
                console.error('Failed to initialize contracts:', err);
                setError('Failed to initialize contracts.');
            }
        };

        initializeContracts();
    }, [contractManager, contracts]);

    return { contractInstances, contractManager, error };
};

export default useContracts;
