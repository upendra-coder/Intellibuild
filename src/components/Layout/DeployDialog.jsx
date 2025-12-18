import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, CircularProgress, Box, Typography } from '@mui/material';

export const DeployDialog = ({ state, actions, onDeploy }) => (
  <Dialog open={state.open} onClose={() => actions.setOpen(false)}>
    <DialogTitle>Deploy Website</DialogTitle>
    <DialogContent>
      <DialogContentText>Enter unique name. Updates existing sites.</DialogContentText>
      {state.status === 'success' ? (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">Success!</Typography>
            <a href={state.url} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold' }}>{state.url}</a>
          </Box>
      ) : (
          <>
            <TextField margin="dense" label="Site Name" fullWidth value={state.siteName} onChange={(e) => actions.setSiteName(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
            <TextField margin="dense" label="Netlify Token" type="password" fullWidth value={state.token} onChange={(e) => actions.setToken(e.target.value)} sx={{ mt: 2 }} />
          </>
      )}
      {state.status === 'error' && <Typography color="error" sx={{ mt: 2 }}>{state.error}</Typography>}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => actions.setOpen(false)}>Close</Button>
      {state.status !== 'success' && (
        <Button onClick={onDeploy} variant="contained" disabled={state.status === 'deploying'}>
          {state.status === 'deploying' ? <CircularProgress size={24} /> : "Deploy Now"}
        </Button>
      )}
    </DialogActions>
  </Dialog>
);