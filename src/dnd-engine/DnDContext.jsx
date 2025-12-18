// src/dnd-engine/DnDContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DnDContext = createContext();

export const useDnD = () => useContext(DnDContext);

export const DnDProvider = ({ children, onDrop }) => {
  const [draggedId, setDraggedId] = useState(null);

  // Called when dragging starts
  const startDrag = (id) => {
    setDraggedId(id);
    console.log("Started dragging:", id);
  };

  // Called when dropping occurs
  const handleDrop = (targetId) => {
    if (draggedId === targetId) return; // Dropped on itself
    console.log(`Dropped ${draggedId} onto ${targetId}`);
    
    // Trigger the actual reordering logic passed from parent
    if (onDrop) {
      onDrop(draggedId, targetId);
    }
    
    setDraggedId(null);
  };

  return (
    <DnDContext.Provider value={{ draggedId, startDrag, handleDrop }}>
      {children}
    </DnDContext.Provider>
  );
};