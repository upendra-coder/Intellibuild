import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DesignServicesIcon from '@mui/icons-material/DesignServices';

export const Header = ({ onMenuClick, projectName, viewMode, setViewMode, onDeploy }) => (
  <AppBar position="static" elevation={1} sx={{ zIndex: 1201 }}>
    <Toolbar variant="dense">
      <IconButton edge="start" color="inherit" sx={{ mr: 2 }} onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
          {projectName}
      </Typography>
      
      <Box sx={{ mr: 2, display: 'flex', gap: 1 }}>
          <Button variant={viewMode === 'visual' ? 'outlined' : 'text'} color="inherit" startIcon={<DesignServicesIcon />} onClick={() => setViewMode('visual')}>Visual</Button>
          <Button variant={viewMode === 'code' ? 'outlined' : 'text'} color="inherit" startIcon={<CodeIcon />} onClick={() => setViewMode('code')}>Code</Button>
          <Button variant={viewMode === 'preview' ? 'outlined' : 'text'} color="inherit" startIcon={<VisibilityIcon />} onClick={() => setViewMode('preview')}>Preview</Button>
      </Box>

      <Button variant="contained" color="secondary" startIcon={<RocketLaunchIcon />} onClick={onDeploy}>
        Deploy Live
      </Button>
    </Toolbar>
  </AppBar>
);