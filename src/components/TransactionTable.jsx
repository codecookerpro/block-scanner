import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Web3 from 'web3';
import _ from 'lodash';

const TransactionTable = ({ rows = [] }) => {
  const sortedRows = React.useMemo(() =>
    rows.sort((a, b) => b.value - a.value)
      .map(row => ({ ...row, eth: _.round(Web3.utils.fromWei(row.value, 'ether'), 4) })),
    [rows]
  );

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
      <Table sx={{ minWidth: 650, minHeight: 400 }} aria-label="transaction table">
        <TableHead>
          <TableRow>
            <TableCell>Hash</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow
              key={row.hash}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.hash}
              </TableCell>
              <TableCell align="right">{row.eth} ETH</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default TransactionTable;