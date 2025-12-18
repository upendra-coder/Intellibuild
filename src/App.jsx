import React, { useState } from 'react';
import { Box, CssBaseline, Paper, Typography } from '@mui/material';

// Imports from our new clean structure
import { useProjectManager } from './hooks/useProjectManager';
import { useDeployment } from './hooks/useDeployment';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DeployDialog } from './components/Layout/DeployDialog';
import ChatInput from './components/Chat/ChatInput';
import VisualEditor from './components/Editor/VisualEditor';

function App() {
  // 1. Logic Hooks
  const projectManager = useProjectManager();
  const deployment = useDeployment();
  
  // 2. UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('preview');

  // Helper to close sidebar when switching projects
  const handleSwitch = (id) => {
    projectManager.switchProject(id);
    setSidebarOpen(false);
  };

  const handleNew = () => {
    projectManager.createProject();
    setSidebarOpen(false);
  };

  // 3. Render Helper (Workspace)
  const renderWorkspace = () => {
    const code = projectManager.activeProject.code || "";
    
    if (viewMode === 'visual') {
      return (
         <Box sx={{ height: '100%', overflow: 'auto', bgcolor: 'white' }}>
           <VisualEditor code={code} onUpdate={projectManager.updateActiveCode} />
         </Box>
      );
    }
    
    if (viewMode === 'code') {
      return (
        <Box sx={{ display: 'flex', height: '100%', width: '100%' }}>
          <Box sx={{ width: '50%', height: '100%', bgcolor: '#1e1e1e', display: 'flex', flexDirection: 'column', borderRight: '1px solid #444' }}>
             <Box sx={{ p: 1, bgcolor: '#252526', color: '#fff', borderBottom: '1px solid #333' }}>
                 <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>index.html</Typography>
             </Box>
             <textarea
               value={code}
               onChange={(e) => projectManager.updateActiveCode(e.target.value)}
               spellCheck="false"
               style={{ flexGrow: 1, width: '100%', backgroundColor: '#1e1e1e', color: '#d4d4d4', border: 'none', padding: '20px', fontFamily: 'monospace', resize: 'none', outline: 'none' }}
             />
          </Box>
          <Box sx={{ width: '50%', height: '100%', bgcolor: 'white' }}>
            <iframe title="Split Preview" srcDoc={code} sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none' }} />
          </Box>
        </Box>
      );
    }

    // Default: Preview
    return <iframe title="Preview" srcDoc={code} sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none', background: 'white' }} />;
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          projectName={projectManager.activeProject.name}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onDeploy={deployment.actions.openDialog}
        />

        <Sidebar 
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          projects={projectManager.projects}
          activeProjectId={projectManager.activeProject.id}
          onSwitch={handleSwitch}
          onDelete={projectManager.deleteProject}
          onNew={handleNew}
        />

        {/* MAIN WORKSPACE */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          
          {/* LEFT: CHAT */}
          <Box sx={{ 
            width: viewMode === 'preview' ? '350px' : '0px', 
            display: viewMode === 'preview' ? 'flex' : 'none',
            borderRight: '1px solid #ddd', flexDirection: 'column', bgcolor: '#f8f9fa', transition: 'width 0.3s'
          }}>
            <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
              <Paper sx={{ p: 2, minHeight: '300px' }}>
                <ChatInput 
                  messages={projectManager.activeProject.messages}
                  onNewMessage={projectManager.addMessageToActive}
                  onCodeGenerated={projectManager.updateActiveCode}
                  currentCode={projectManager.activeProject.code}
                />
              </Paper>
            </Box>
          </Box>

          {/* RIGHT: EDITOR/PREVIEW */}
          <Box sx={{ flexGrow: 1, bgcolor: '#e0e0e0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
             {renderWorkspace()}
          </Box>
        </Box>
      </Box>

      <DeployDialog 
        state={deployment.state}
        actions={deployment.actions}
        onDeploy={() => deployment.actions.deploy(projectManager.activeProject.code)}
      />
    </>
  );
}

export default App;