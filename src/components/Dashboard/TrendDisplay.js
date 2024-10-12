import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function TrendDisplay() {
    const [trendData, setTrendData] = useState([]);

    useEffect(() => {
        const fetchTrendData = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
                    params: {
                        vs_currency: 'usd',
                        days: '7',
                        interval: 'daily',
                    },
                });
                const prices = response.data.prices.map(([timestamp, price]) => ({
                    date: new Date(timestamp).toLocaleDateString(),
                    price: price.toFixed(2),
                }));
                setTrendData(prices);
            } catch (error) {
                console.error('获取趋势数据失败：', error);
            }
        };

        fetchTrendData();
    }, []);

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    ETH 价格趋势 (过去7天)
                </Typography>
                {trendData.length === 0 ? (
                    <Typography variant="body1">加载中...</Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <XAxis dataKey="date" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="price" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

export default TrendDisplay;
