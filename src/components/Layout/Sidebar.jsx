import React from 'react';
import { Drawer, Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

export const Sidebar = ({ open, onClose, projects, activeProjectId, onSwitch, onDelete, onNew }) => (
  <Drawer anchor="left" open={open} onClose={onClose}>
    <Box sx={{ width: 250, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
          <Typography variant="h6" fontWeight="bold">My Projects</Typography>
          <Button variant="contained" fullWidth startIcon={<AddIcon />} sx={{ mt: 1 }} onClick={onNew}>
            New Project
          </Button>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {projects.map((proj) => (
          <ListItem button key={proj.id} selected={proj.id === activeProjectId} onClick={() => onSwitch(proj.id)}>
            <ListItemIcon><FolderIcon color={proj.id === activeProjectId ? "primary" : "action"} /></ListItemIcon>
            <ListItemText primary={proj.name} secondary={`ID: ${proj.id.toString().slice(-4)}`} />
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(proj.id); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);