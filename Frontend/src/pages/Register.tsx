import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Register.module.css';

const Register: React.FC = () => {
  const { user, Register } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<'ADMIN' | 'PACIENTE' | 'CUIDADOR'>('PACIENTE');
  const [telefone, setTelefone] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    
    value = value.replace(/\D/g, '');

    
    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{0,5})(\d{0,4})$/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    }

    setTelefone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await Register({ nome, email, senha, perfil, telefone });
    setLoading(false);
    if (res.ok) {
      setMessage('Usuário cadastrado com sucesso.');
      setNome(''); setEmail(''); setSenha(''); setPerfil('PACIENTE'); setTelefone('');
      navigate('/dashboard');
    } else {
      setMessage(res.message || 'Erro ao cadastrar.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Cadastrar Usuário</h2>
        {message && <div className={styles.message}>{message}</div>}

        <label className={styles.label}>Nome</label>
        <input className={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label className={styles.label}>Email</label>
        <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label className={styles.label}>Senha</label>
        <input type="password" className={styles.input} value={senha} onChange={(e) => setSenha(e.target.value)} minLength={6} required />

        <label className={styles.label}>Telefone</label>
        <input type="text" className={styles.input} value={telefone} onChange={handleTelefoneChange} required />

        <label className={styles.label}>Perfil</label>
        <select 
          className={`${styles.input} mb-4`}  
          value={perfil} 
          onChange={(e) => setPerfil(e.target.value as 'PACIENTE' | 'CUIDADOR')}
        >
          <option value="PACIENTE">Paciente</option>
          <option value="CUIDADOR">Cuidador</option>
        </select>
        
        <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg" type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        {/* Link para login dentro do formulário */}
        <div className="mt-4 text-center">
          <p>
            <span>Já tem uma conta?</span>
            <Link to="/login" className="text-blue-600 hover:underline"> Clique aqui para fazer login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
