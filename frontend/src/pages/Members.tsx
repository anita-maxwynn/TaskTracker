import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaceApi } from '../api/workspaces';
import type { WorkspaceMember, Workspace } from '../types';
import '../styles/Members.css';

const Members: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [workspaceId]);

  const loadData = async () => {
    try {
      const [membersData, workspaceData] = await Promise.all([
        workspaceApi.getMembers(Number(workspaceId)),
        workspaceApi.getById(Number(workspaceId)),
      ]);
      setMembers(membersData);
      setWorkspace(workspaceData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: number, newRole: 'admin' | 'member') => {
    try {
      await workspaceApi.updateMember(memberId, newRole);
      loadData();
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId: number, username: string) => {
    if (window.confirm(`Are you sure you want to remove ${username} from this workspace?`)) {
      try {
        await workspaceApi.removeMember(memberId);
        loadData();
      } catch (error) {
        console.error('Failed to remove member:', error);
        alert('Failed to remove member');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="members-container">
      <div className="members-header">
        <button className="btn-back" onClick={() => navigate('/workspaces')}>
          ← Back to Workspaces
        </button>
        <h1>{workspace?.name} - Members</h1>
      </div>

      <div className="members-list">
        <div className="members-table">
          <div className="table-header">
            <div className="col-user">User</div>
            <div className="col-email">Email</div>
            <div className="col-role">Role</div>
            <div className="col-actions">Actions</div>
          </div>
          {members.map((member) => (
            <div key={member.id} className="table-row">
              <div className="col-user">
                <div className="user-avatar">{member.user.username.charAt(0).toUpperCase()}</div>
                <span>{member.user.username}</span>
              </div>
              <div className="col-email">{member.user.email}</div>
              <div className="col-role">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as 'admin' | 'member')}
                  className="role-select"
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
              <div className="col-actions">
                <button
                  className="btn-danger btn-small"
                  onClick={() => handleRemoveMember(member.id, member.user.username)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="empty-state">
            <p>No members found in this workspace.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
