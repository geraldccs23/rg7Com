export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'director';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  role: 'super_admin' | 'director';
}