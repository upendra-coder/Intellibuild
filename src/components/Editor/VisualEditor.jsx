import React, { useEffect, useState } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { DnDProvider } from '../../dnd-engine/DnDContext';
import Draggable from '../../dnd-engine/Draggable';

// --- HELPER: Convert "color: red; margin: 10px" -> { color: 'red', margin: '10px' } ---
const styleStringToObject = (styleString) => {
  if (!styleString) return {};
  const styleObj = {};
  
  styleString.split(';').forEach((style) => {
    const parts = style.split(':');
    if (parts.length === 2) {
      const prop = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase()); // camelCase
      const val = parts[1].trim();
      styleObj[prop] = val;
    }
  });
  return styleObj;
};

const VisualEditor = ({ code, onUpdate }) => {
  const [styles, setStyles] = useState('');

  // 1. EXTRACT GLOBAL CSS (Styles tags + Body styles)
  useEffect(() => {
    if (!code) return;
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    
    // Extract CSS from <style> tags
    const styleTags = doc.querySelectorAll('style');
    let cssString = '';
    styleTags.forEach(tag => cssString += tag.innerHTML);
    
    // Extract inline style from <body> to apply to our canvas
    const bodyStyle = doc.body ? doc.body.getAttribute('style') || '' : '';
    
    const finalStyles = `
      ${cssString}
      /* We wrap the content in a special class to simulate the body */
      .visual-editor-canvas {
        ${bodyStyle}
        min-height: 100vh;
        padding: 20px;
        position: relative;
        /* Ensure text is visible if they chose a dark theme */
        color: inherit; 
      }
      /* Basic fix for dark mode backgrounds */
      body[style*="background-color: black"] .visual-editor-canvas { color: white; }
    `;
    setStyles(finalStyles);
  }, [code]);

  // 2. HANDLE DRAG & DROP MOVE
  const handleMove = (draggedId, targetId) => {
    console.log(`Attempting to move ${draggedId} -> ${targetId}`);

    if (!onUpdate) {
      console.error("❌ Fatal: onUpdate prop is missing!");
      return;
    }
    if (draggedId === targetId) return;

    // A. Parse Source
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');

    // B. Find Elements
    const draggedEl = doc.getElementById(draggedId);
    const targetEl = doc.getElementById(targetId);

    // C. Validate
    if (!draggedEl || !targetEl) {
      console.error("❌ Failed: Could not find elements in source code.");
      alert("Error: One of the elements is missing an ID. Try regenerating the website.");
      return;
    }

    // D. Prevent "Parent into Child" Paradox
    if (draggedEl.contains(targetEl)) {
      alert("Cannot move a container into its own content!");
      return;
    }

    // E. SWAP LOGIC (Insert Before)
    try {
      targetEl.parentNode.insertBefore(draggedEl, targetEl);
      const newHtml = doc.documentElement.outerHTML;
      onUpdate(newHtml);
    } catch (err) {
      console.error("❌ Swap Error:", err);
    }
  };

  // 3. PARSER OPTIONS (The "Translator")
  const options = {
    replace: (domNode) => {
      // Skip structure tags (we only render their children)
      if (domNode.type === 'tag' && ['html', 'head', 'body'].includes(domNode.name)) {
        return <>{domToReact(domNode.children, options)}</>;
      }
      
      const draggableTags = ['section', 'div', 'header', 'footer', 'main', 'article', 'h1', 'h2', 'p', 'button', 'ul', 'li', 'a', 'span'];
      
      if (domNode.type === 'tag' && draggableTags.includes(domNode.name)) {
        // Fallback ID generation
        const id = domNode.attribs.id || `temp-${Math.random().toString(36).substr(2, 5)}`;
        
        // --- CRITICAL FIX START ---
        // 1. Convert 'class' to 'className'
        const props = { ...domNode.attribs, id, key: id };
        if (props.class) {
          props.className = props.class;
          delete props.class;
        }

        // 2. Convert 'style' string to Object (The Crash Fix)
        if (props.style && typeof props.style === 'string') {
          props.style = styleStringToObject(props.style);
        }
        // --- CRITICAL FIX END ---

        return (
          <Draggable id={id} type={domNode.name}>
             {React.createElement(
                domNode.name,
                props,
                domToReact(domNode.children, options)
             )}
          </Draggable>
        );
      }
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="visual-editor-canvas">
        <DnDProvider onDrop={handleMove}>
          {code ? parse(code, options) : <p style={{textAlign:'center', marginTop: 50}}>No code to edit</p>}
        </DnDProvider>
      </div>
    </>
  );
};

export default VisualEditor;