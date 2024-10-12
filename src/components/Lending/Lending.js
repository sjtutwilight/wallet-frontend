import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Alert } from '@mui/material';
import YourSupplies from './YourSupplies';
import YourBorrows from './YourBorrows';
import AssetsToSupply from './AssetsToSupply';
import AssetsToBorrow from './AssetsToBorrow';
import useContracts from '../../hooks/useContracts';

function Lending() {
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const storedTokens = JSON.parse(localStorage.getItem('tokens')) || [];
    setTokens(storedTokens);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#ffffff' }}>
        Borrowing & Lending
      </Typography>
      {errors && <Alert severity="error" sx={{ mb: 2 }}>{errors}</Alert>}
      <Grid container spacing={4}>
        {/* Your Supplies */}
        <Grid item xs={12} md={6}>
          <YourSupplies tokens={tokens} />
        </Grid>

        {/* Your Borrows */}
        <Grid item xs={12} md={6}>
          <YourBorrows tokens={tokens} />
        </Grid>

        {/* Assets to Supply */}
        <Grid item xs={12} md={6}>
          <AssetsToSupply tokens={tokens} />
        </Grid>

        {/* Assets to Borrow */}
        <Grid item xs={12} md={6}>
          <AssetsToBorrow tokens={tokens} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default Lending;
