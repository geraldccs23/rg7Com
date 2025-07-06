import React, { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, AlertCircle, Database, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { testDatabaseConnection } from '../../lib/auth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; error?: string; loading: boolean }>({ 
    connected: false, 
    loading: true 
  });
  const { signIn, loading, error } = useAuth();

  useEffect(() => {
    // Test database connection on component mount
    const checkDatabase = async () => {
      setDbStatus({ connected: false, loading: true });
      
      try {
        const result = await testDatabaseConnection();
        setDbStatus({ 
          connected: result.success, 
          error: result.error,
          loading: false
        });
      } catch (error) {
        setDbStatus({ 
          connected: false, 
          error: 'Connection test failed',
          loading: false
        });
      }
    };
    
    checkDatabase();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      // Error is handled by the context
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600">
              Dashboard de Ventas Automotriz
            </p>
          </div>

          {/* Database Status */}
          <div className={`mb-6 p-3 rounded-lg flex items-center text-sm ${
            dbStatus.loading
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              : dbStatus.connected 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {dbStatus.loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                Verificando conexión...
              </>
            ) : dbStatus.connected ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Base de datos conectada
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Error de conexión: {dbStatus.error}
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <div>
                <p className="text-red-700 text-sm font-medium">Error de autenticación</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="tu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || !dbStatus.connected || dbStatus.loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Debug Info */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">
              <strong>Para crear el primer Super Admin:</strong>
            </p>
            <ol className="text-xs text-gray-600 space-y-1">
              <li>1. Ve a tu dashboard de Supabase</li>
              <li>2. Sección "Authentication" → "Users"</li>
              <li>3. Clic en "Add user" → "Create new user"</li>
              <li>4. Completa email y contraseña</li>
              <li>5. En "User Metadata" agrega:</li>
              <li className="ml-4 font-mono text-xs">{"{"}</li>
              <li className="ml-6 font-mono text-xs">"full_name": "Tu Nombre",</li>
              <li className="ml-6 font-mono text-xs">"role": "super_admin"</li>
              <li className="ml-4 font-mono text-xs">{"}"}</li>
            </ol>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Necesitas acceso? Contacta al administrador del sistema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}