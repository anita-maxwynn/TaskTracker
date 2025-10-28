export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Workspace {
  id: number;
  name: string;
  image_url?: string;
  created_by: User;
  invite_link?: string;
}

export interface WorkspaceMember {
  id: number;
  user: User;
  role: 'admin' | 'member';
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  workspace: number | string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'in_review' | 'done' | 'backlog';
  project: number | string;
  assigned_to?: User;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
