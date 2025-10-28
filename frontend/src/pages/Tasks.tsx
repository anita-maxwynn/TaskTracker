import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../api/tasks';
import { workspaceApi } from '../api/workspaces';
import type { Task, WorkspaceMember } from '../types';
import '../styles/Tasks.css';

const Tasks: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    assigned_to: undefined as number | undefined,
    due_date: '',
  });
  const navigate = useNavigate();

  const statuses = ['todo', 'in_progress', 'in_review', 'done', 'backlog'];

  useEffect(() => {
    loadData();
  }, [projectId, workspaceId]);

  const loadData = async () => {
    try {
      const [tasksData, membersData] = await Promise.all([
        taskApi.getAll(Number(projectId)),
        workspaceApi.getMembers(Number(workspaceId)),
      ]);
      setTasks(tasksData);
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const data = await taskApi.getAll(Number(projectId));
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData: any = {
        ...newTask,
        project: Number(projectId),
      };
      
      // Only include assigned_to if it's set
      if (!newTask.assigned_to) {
        delete taskData.assigned_to;
      }
      
      // Only include due_date if it's set
      if (!newTask.due_date) {
        delete taskData.due_date;
      }
      
      await taskApi.create(taskData);
      setShowCreateModal(false);
      setNewTask({ title: '', description: '', status: 'todo', assigned_to: undefined, due_date: '' });
      loadTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await taskApi.update(taskId, { status: newStatus as any });
      loadTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.delete(taskId);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const formatStatusLabel = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <button className="btn-back" onClick={() => navigate(`/workspaces/${workspaceId}/projects`)}>
          ← Back to Projects
        </button>
        <h1>Tasks Board</h1>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          Create Task
        </button>
      </div>

      <div className="kanban-board">
        {statuses.map((status) => (
          <div key={status} className="kanban-column">
            <div className="kanban-column-header">
              <h3>{formatStatusLabel(status)}</h3>
              <span className="task-count">{getTasksByStatus(status).length}</span>
            </div>
            <div className="kanban-column-content">
              {getTasksByStatus(status).map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h4>{task.title}</h4>
                    <button className="btn-delete" onClick={() => handleDelete(task.id)}>
                      ×
                    </button>
                  </div>
                  {task.description && <p className="task-description">{task.description}</p>}
                  <div className="task-footer">
                    {task.assigned_to && (
                      <span className="assignee-badge">
                        {task.assigned_to.username}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="due-date">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                    )}
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="status-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {formatStatusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optional)</label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {formatStatusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="assigned_to">Assign To (optional)</label>
                <select
                  id="assigned_to"
                  value={newTask.assigned_to || ''}
                  onChange={(e) => setNewTask({ 
                    ...newTask, 
                    assigned_to: e.target.value ? Number(e.target.value) : undefined 
                  })}
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.user.id}>
                      {member.user.username} ({member.user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date (optional)</label>
                <input
                  type="date"
                  id="due_date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
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

export default Tasks;
