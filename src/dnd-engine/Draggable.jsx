// src/dnd-engine/Draggable.jsx
import React, { useState } from 'react';
import { useDnD } from './DnDContext';
import { Box } from '@mui/material';

const Draggable = ({ id, children, type = 'block' }) => {
  const { startDrag, handleDrop } = useDnD();
  const [isOver, setIsOver] = useState(false);

  // 1. NATIVE HANDLERS
  const handleDragStart = (e) => {
    e.stopPropagation(); // Prevent parent from also dragging
    startDrag(id);
    e.dataTransfer.effectAllowed = 'move';
    // Small transparent image to hide the default ghost if you wanted, 
    // but default is fine for now.
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.stopPropagation();
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    handleDrop(id);
  };

  // 2. VISUAL STYLES FOR "EDIT MODE"
  // We add a dashed border when hovering to show it's interactable
  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleOnDrop}
      style={{
        cursor: 'grab',
        position: 'relative',
        border: isOver ? '2px solid #2196f3' : '2px dashed transparent', // Blue line on hover
        transition: 'all 0.2s',
        padding: '2px', // Give a little grab space
      }}
      // Add a hover effect via CSS class or inline style
      onMouseEnter={(e) => { e.currentTarget.style.border = '1px dashed #ccc'; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = isOver ? '2px solid #2196f3' : '2px dashed transparent'; }}
    >
      
      {/* Optional: Add a little "Handle" or Label */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        fontSize: '10px', 
        background: '#eee', 
        zIndex: 10,
        pointerEvents: 'none' // Click through to the element
      }}>
        {type}
      </div>

      {children}
    </div>
  );
};

export default Draggable;