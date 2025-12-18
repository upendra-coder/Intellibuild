import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Paper, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { model } from '../../services/gemini';
import { extractHtml } from '../../utils/codeParser';

// CHANGED: We now receive 'messages' and 'onNewMessage' from the parent (App.jsx)
const ChatInput = ({ messages, onNewMessage, onCodeGenerated, currentCode }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // 1. SEND USER MESSAGE TO PARENT
    const userText = input;
    setInput(''); // Clear immediately
    setLoading(true);
    
    // Notify App.jsx to add this message to history
    onNewMessage({ role: 'user', text: userText });

    try {
      // 2. CONSTRUCT PROMPT (Same logic as before)
      let systemPrompt = '';
      if (currentCode) {
        systemPrompt = `
          You are an expert Frontend Developer.
          Here is the CURRENT HTML CODE:
          \`\`\`html
          ${currentCode}
          \`\`\`
          USER REQUEST: "${userText}"
          TASK: Update the code. Ensure all elements have unique IDs. Return full HTML.
        `;
      } else {
        systemPrompt = `
          You are an expert Frontend Developer.
          TASK: Create a website.
          USER REQUEST: "${userText}"
          REQUIREMENTS: HTML/CSS/JS, unique IDs, modern style. Return raw HTML.
        `;
      }

      // 3. CALL API
      const result = await model.generateContent(systemPrompt);
      const response = await result.response;
      const text = response.text();
      const cleanHtml = extractHtml(text);

      // 4. SEND AI SUCCESS TO PARENT
      onNewMessage({ role: 'model', text: "Code updated! Check the preview." });
      onCodeGenerated(cleanHtml);

    } catch (error) {
      console.error("API Error:", error);
      // 5. SEND ERROR TO PARENT
      onNewMessage({ role: 'model', text: "Error: " + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* HISTORY AREA */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.length === 0 && (
          <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 2 }}>
            Start by describing your website...
          </Typography>
        )}
        
        {messages.map((msg, index) => (
          <Paper 
            key={index}
            sx={{ 
              p: 1.5, 
              bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '90%'
            }}
          >
            <Typography variant="body2">{msg.text}</Typography>
          </Paper>
        ))}
        <div ref={scrollRef} />
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* INPUT AREA */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type instruction..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSend} 
          disabled={loading}
          sx={{ minWidth: '50px' }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInput;