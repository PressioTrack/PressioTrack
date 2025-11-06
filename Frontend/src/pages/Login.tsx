import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, senha);
    if (result.ok) {
      navigate('/dashboard');
    }
    else {
      setErro(result.message || 'Erro ao fazer login');
    }

  };

  const limparCampos = () => {
    setEmail('');
    setSenha('');
    setErro('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Entrar</h2>

        {erro && <p className={styles.error}>{erro}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <label className={styles.label}>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.input}
          />


           <div className="flex justify-between gap-4 mt-4">
            <button type="submit" className={styles.button}>
              Entrar
            </button>

            <button
              type="button"
              onClick={limparCampos}
              className={styles.button}
            >
              Limpar
            </button>
          </div>

        </form>

        <div className="mt-8 text-center">
          <p>
            <span>Não tem uma conta?</span>
            <Link to="/register" className="text-blue-600 hover:underline"> Clique aqui para fazer cadastro</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
