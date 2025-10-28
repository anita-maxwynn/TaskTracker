import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectApi } from '../api/projects';
import type { Project } from '../types';
import '../styles/Projects.css';

const Projects: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [workspaceId]);

  const loadProjects = async () => {
    try {
      const data = await projectApi.getAll(Number(workspaceId));
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await projectApi.create({ ...newProject, workspace: Number(workspaceId) });
      setShowCreateModal(false);
      setNewProject({ name: '', description: '' });
      loadProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <button className="btn-back" onClick={() => navigate('/workspaces')}>
          ← Back to Workspaces
        </button>
        <h1>Projects</h1>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          Create Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => navigate(`/workspaces/${workspaceId}/projects/${project.id}/tasks`)}
          >
            {project.image_url && (
              <img src={project.image_url} alt={project.name} />
            )}
            <h3>{project.name}</h3>
            <p>{project.description || 'No description'}</p>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="name">Project Name</label>
                <input
                  type="text"
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
