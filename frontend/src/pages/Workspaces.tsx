import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workspaceApi } from '../api/workspaces';
import { uploadToCloudinary } from '../utils/cloudinary';
import type { Workspace } from '../types';
import '../styles/Workspaces.css';

const Workspaces: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', image_url: '' });
  const [uploading, setUploading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await workspaceApi.getAll();
      setWorkspaces(data);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await workspaceApi.create(newWorkspace);
      setShowCreateModal(false);
      setNewWorkspace({ name: '', image_url: '' });
      loadWorkspaces();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadToCloudinary(file);
      setNewWorkspace({ ...newWorkspace, image_url: response.secure_url });
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      
      // Show specific error message
      if (error.message && error.message.includes('Upload preset not found')) {
        alert(
          'Cloudinary upload preset not configured.\n\n' +
          'Please either:\n' +
          '1. Create an upload preset named "jira_uploads" in your Cloudinary dashboard\n' +
          '2. Or enter an image URL manually in the field below'
        );
      } else {
        alert('Failed to upload image: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await workspaceApi.join(inviteLink);
      setShowJoinModal(false);
      setInviteLink('');
      loadWorkspaces();
      alert('Successfully joined workspace!');
    } catch (error) {
      console.error('Failed to join workspace:', error);
      alert('Failed to join workspace. Please check the invite link.');
    }
  };

  const handleShowInvite = (workspace: Workspace, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWorkspace(workspace);
    setShowInviteModal(true);
  };

  const handleRegenerateInvite = async () => {
    if (!selectedWorkspace) return;
    try {
      const response = await workspaceApi.regenerateInvite(selectedWorkspace.id);
      setSelectedWorkspace({ ...selectedWorkspace, invite_link: response.invite_link });
      loadWorkspaces();
    } catch (error) {
      console.error('Failed to regenerate invite:', error);
    }
  };

  const copyInviteLink = () => {
    if (selectedWorkspace?.invite_link) {
      navigator.clipboard.writeText(selectedWorkspace.invite_link);
      alert('Invite link copied to clipboard!');
    }
  };

  const handleManageMembers = (workspaceId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/workspaces/${workspaceId}/members`);
  };

  if (loading) {
    return <div className="loading">Loading workspaces...</div>;
  }

  return (
    <div className="workspaces-container">
      <div className="workspaces-header">
        <h1>Your Workspaces</h1>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowJoinModal(true)}>
            Join Workspace
          </button>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            Create Workspace
          </button>
        </div>
      </div>

      <div className="workspaces-grid">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="workspace-card"
            onClick={() => navigate(`/workspaces/${workspace.id}/projects`)}
          >
            {workspace.image_url && (
              <img src={workspace.image_url} alt={workspace.name} />
            )}
            <h3>{workspace.name}</h3>
            <p>Created by: {workspace.created_by.username}</p>
            <div className="workspace-actions">
              <button 
                className="btn-small btn-secondary" 
                onClick={(e) => handleManageMembers(workspace.id, e)}
              >
                👥 Members
              </button>
              <button 
                className="btn-small btn-secondary" 
                onClick={(e) => handleShowInvite(workspace, e)}
              >
                🔗 Invite
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Workspace</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="name">Workspace Name</label>
                <input
                  type="text"
                  id="name"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
                  required
                  placeholder="Enter workspace name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_upload">Workspace Image (optional)</label>
                <input
                  type="file"
                  id="image_upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p className="upload-status">Uploading image...</p>}
                {newWorkspace.image_url && (
                  <div className="image-preview">
                    <img src={newWorkspace.image_url} alt="Preview" />
                    <button
                      type="button"
                      onClick={() => setNewWorkspace({ ...newWorkspace, image_url: '' })}
                      className="btn-remove-image"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Or enter image URL</label>
                <input
                  type="url"
                  id="image_url"
                  value={newWorkspace.image_url}
                  onChange={(e) => setNewWorkspace({ ...newWorkspace, image_url: e.target.value })}
                  placeholder="Enter image URL"
                  disabled={uploading}
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

      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Join Workspace</h2>
            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label htmlFor="inviteLink">Invite Link</label>
                <input
                  type="text"
                  id="inviteLink"
                  value={inviteLink}
                  onChange={(e) => setInviteLink(e.target.value)}
                  required
                  placeholder="Paste the invite link here"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowJoinModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && selectedWorkspace && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Invite to {selectedWorkspace.name}</h2>
            <div className="invite-content">
              <p>Share this link with others to invite them to the workspace:</p>
              <div className="invite-link-box">
                <input
                  type="text"
                  value={selectedWorkspace.invite_link || 'No invite link available'}
                  readOnly
                  className="invite-link-input"
                />
                <button type="button" className="btn-primary" onClick={copyInviteLink}>
                  Copy
                </button>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleRegenerateInvite}>
                  Regenerate Link
                </button>
                <button type="button" className="btn-primary" onClick={() => setShowInviteModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspaces;
