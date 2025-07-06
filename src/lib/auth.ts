import { supabase } from './supabase';
import { UserProfile, LoginCredentials, CreateUserData } from '../types/auth';

export async function signIn(credentials: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    console.log('Getting current user...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting auth user:', userError);
      return null;
    }
    
    if (!user) {
      console.log('No authenticated user');
      return null;
    }
    
    console.log('Auth user found:', user.email);
    
    // Try to get profile with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timeout')), 10000)
    );
    
    const profilePromise = supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    const { data: profile, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile doesn't exist, try to create it from auth user metadata
      if (error.code === 'PGRST116') {
        console.log('Profile not found, creating from auth metadata...');
        
        const newProfile = {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
          role: user.user_metadata?.role || 'director',
          is_active: true
        };
        
        const { data, error } = await supabase
        .from('user_profiles')  // 👈 aquí está intentando leer la tabla
        .select('*')
        .eq('id', user.id)
        .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }
        
        return createdProfile;
      }
      
      return null;
    }
    
    console.log('Profile found:', profile.email);
    return profile;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

export async function createUser(userData: CreateUserData): Promise<{ success: boolean; error?: string }> {
  try {
    // First, create the user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role
        }
      }
    });
    
    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'No se pudo crear el usuario' };
    }

    // Then create the profile manually
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        is_active: true
      });

    if (profileError) {
      console.error('Error creating profile:', profileError);
      return { success: false, error: 'Error al crear el perfil del usuario' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in createUser:', error);
    return { success: false, error: 'Error creating user' };
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data || [];
}

export async function updateUser(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error updating user' };
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // First delete the profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      return { success: false, error: profileError.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Error deleting user' };
  }
}

// Debug function to check database connection
export async function testDatabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing database connection...');
    
    // Test with a simple query with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), 10000)
    );
    
    const queryPromise = supabase
      .from('user_profiles')
      .select('count(*)')
      .limit(1);
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
    
    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection successful');
    return { success: true };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, error: 'Database connection failed' };
  }
}