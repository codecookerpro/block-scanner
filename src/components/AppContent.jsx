import { useEffect, useRef, useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Button, CardActions, CardHeader, Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import LatestBlockInfo from './LatestBlockInfo';
import TransactionTable from './TransactionTable';

import Web3 from 'web3';

const web3 = new Web3('wss://mainnet.infura.io/ws/v3/a374855a4ae247cfaff639e3ca2879ff');

const AppContent = () => {
  const [blockInfo, setBlockInfo] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncStopped, setSyncStopped] = useState(false);

  const subscription = useRef();

  const updateBlockData = (blockNumber) => {
    setLoading(true);

    web3.eth.getBlock(blockNumber).then((blockData) => {
      if (!blockData) {
        return;
      }

      const requests = blockData.transactions.reduce((batch, transHash) => {
        batch.push(web3.eth.getTransaction(transHash));
        return batch;
      }, []);

      Promise.all(requests).then((transData) => {
        setSyncStopped(syncState => {
          if (!syncState) {
            setTransactions(transData.filter(d => d));
            setBlockInfo(blockData);
          }
          return syncState;
        });

        setLoading(false);
      });
    });
  };

  const stopSync = useCallback(() => {
    subscription.current.unsubscribe((error, success) => {
      if (success) {
        console.log('Successfully unsubscribed!');
      } else {
        console.error(`Unsubscrition went wrong! ${error}`);
      }
    });
    subscription.current = null;
    setLoading(false);
  }, []);

  const startSync = useCallback(() => {
    setLoading(true);
    subscription.current = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
      if (!error && blockHeader?.number) {
        updateBlockData(blockHeader.number);
      }
    });
  }, []);

  const handleSyncClick = useCallback(() => {
    setSyncStopped(!syncStopped);

    if (syncStopped) {
      startSync();
    } else {
      stopSync();
    }
  }, [syncStopped, startSync, stopSync]);

  useEffect(() => {
    startSync();
    web3.eth.getBlockNumber().then(updateBlockData);
    return () => stopSync();
    // eslint-disable-next-line
  }, []);

  return (
    <Box
      sx={{ bgcolor: '#cfe8fc', height: '100vh' }}
      display="flex"
      alignItems="center"
    >
      <Container maxWidth="xl">
        <Card elevation={8} sx={{ p: 2 }}>
          <CardHeader title="Latest Block Information" />
          <CardContent>
            <Grid container>
              <Grid item xs={4}>
                <LatestBlockInfo data={blockInfo} />
              </Grid>
              <Grid item xs={8}>
                <Typography component="div" gutterBottom variant="h6">
                  Transactions
                </Typography>
                <TransactionTable rows={transactions} />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={handleSyncClick}
            >
              {syncStopped ? 'Resume' : 'Pause'}
            </Button>
            {loading && !syncStopped && (
              <CircularProgress size={24} sx={{ ml: 2 }} />
            )}
          </CardActions>
        </Card>
      </Container>
    </Box>
  );
};

export default AppContent;