import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Link } from '@mui/material';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const storedTx = JSON.parse(localStorage.getItem('transactions')) || [];
        setTransactions(storedTx);
    }, []);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    交易记录
                </Typography>
                {transactions.length === 0 ? (
                    <Typography variant="body1">暂无交易记录。</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>类型</TableCell>
                                <TableCell>代币</TableCell>
                                <TableCell>数量</TableCell>
                                <TableCell>交易哈希</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((tx, index) => (
                                <TableRow key={index}>
                                    <TableCell>{tx.type}</TableCell>
                                    <TableCell>{tx.token}</TableCell>
                                    <TableCell>{tx.amount}</TableCell>
                                    <TableCell>
                                        <Link href={`https://etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener">
                                            {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

export default TransactionHistory;
