import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      setAuth(res.token, res.username, res.role);
      navigate('/pos');
    } catch {
      push('Credenciales inválidas', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-8 rounded-2xl shadow-lg"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <h1 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
          Divino Encanto
        </h1>
        <p className="text-center mb-6" style={{ color: 'var(--fg-muted)' }}>Inicia sesión para continuar</p>

        <Input label="Usuario" value={username} onChange={setUsername} placeholder="Tu usuario" />
        <Input label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="••••••••" />

        <Button type="submit" loading={loading} className="w-full mt-4">
          Ingresar
        </Button>

        <p className="text-center mt-4 text-sm" style={{ color: 'var(--fg-muted)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="underline" style={{ color: 'var(--accent)' }}>
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
