import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const LatestBlockInfo = ({ data = {} }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography variant="h6" component="div">
          Block number
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {data.number}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="div">
          Number of transactions
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {data.transactions?.length}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="div">
          Miner
        </Typography>
        <Typography gutterBottom variant="body2" color="text.secondary">
          {data.miner}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="div">
          Total difficulty
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.difficulty}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LatestBlockInfo;
