import { useState, useEffect } from 'react';

export function useProjectManager() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('ai_builder_projects');
    return saved ? JSON.parse(saved) : [{
      id: Date.now(),
      name: 'My First Project',
      code: `<html><body style="font-family: sans-serif; padding: 50px; text-align: center;"><h1>🚀 Ready!</h1></body></html>`,
      messages: []
    }];
  });

  const [currentProjectId, setCurrentProjectId] = useState(() => {
    return localStorage.getItem('current_project_id') || (projects[0] ? projects[0].id : null);
  });

  const activeProject = projects.find(p => p.id === Number(currentProjectId)) || projects[0];

  useEffect(() => {
    localStorage.setItem('ai_builder_projects', JSON.stringify(projects));
    localStorage.setItem('current_project_id', currentProjectId);
  }, [projects, currentProjectId]);

  const createProject = () => {
    const newProj = {
      id: Date.now(),
      name: `Project ${projects.length + 1}`,
      code: '',
      messages: []
    };
    setProjects([...projects, newProj]);
    setCurrentProjectId(newProj.id);
  };

  const switchProject = (id) => setCurrentProjectId(id);

  const deleteProject = (id) => {
    if (projects.length <= 1) return alert("You must have at least one project!");
    if (!confirm("Delete this project?")) return;

    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (id === currentProjectId) setCurrentProjectId(remaining[0].id);
  };

  const updateActiveCode = (newCode) => {
    setProjects(prev => prev.map(p =>
      p.id === activeProject.id ? { ...p, code: newCode } : p
    ));
  };

  const addMessageToActive = (msg) => {
    setProjects(prev => prev.map(p =>
      p.id === activeProject.id ? { ...p, messages: [...p.messages, msg] } : p
    ));
  };

  return {
    projects,
    activeProject,
    createProject,
    switchProject,
    deleteProject,
    updateActiveCode,
    addMessageToActive
  };
}