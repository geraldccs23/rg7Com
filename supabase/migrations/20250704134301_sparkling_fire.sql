/*
  # Sistema de autenticación y gestión de usuarios

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text) - 'super_admin' or 'director'
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references user_profiles)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for role-based access
    - Super admins can manage all users
    - Directors can only read their own profile
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('super_admin', 'director')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES user_profiles(id)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (SELECT role FROM user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT role = 'super_admin' FROM user_profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete profiles"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (is_super_admin(auth.uid()));

-- Update sales_records policies to require authentication
DROP POLICY IF EXISTS "Allow public read access" ON sales_records;
DROP POLICY IF EXISTS "Allow public insert access" ON sales_records;
DROP POLICY IF EXISTS "Allow public delete access" ON sales_records;

CREATE POLICY "Authenticated users can read sales records"
  ON sales_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert sales records"
  ON sales_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Super admins can delete sales records"
  ON sales_records
  FOR DELETE
  TO authenticated
  USING (is_super_admin(auth.uid()));

-- Function to handle user profile creation on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create profile if user doesn't exist (prevents duplicate key errors)
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = NEW.id) THEN
    INSERT INTO user_profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      COALESCE(NEW.raw_user_meta_data->>'role', 'director')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_by ON user_profiles(created_by);