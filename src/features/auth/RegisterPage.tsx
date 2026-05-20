import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useToastStore } from '../../store/toast.store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.register({ username, password, role });
      push('Registro exitoso. Ahora inicia sesión.', 'success');
      navigate('/login');
    } catch {
      push('Error al registrar usuario', 'error');
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
          Crear Cuenta
        </h1>

        <Input label="Usuario" value={username} onChange={setUsername} placeholder="Tu usuario" />
        <Input label="Contraseña" value={password} onChange={setPassword} type="password" placeholder="••••••••" />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>Rol</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-2">
          Registrarse
        </Button>

        <p className="text-center mt-4 text-sm" style={{ color: 'var(--fg-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="underline" style={{ color: 'var(--accent)' }}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
