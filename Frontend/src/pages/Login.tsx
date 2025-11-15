import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showSenha, setShowSenha] = useState(false);
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
          <label className={styles.label}>Email: </label>
          <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <div className={styles.senhaContainer}>
          <label className={styles.label}>Senha: </label>
            <input className={styles.input} type={showSenha ? 'text' : 'password'} value={senha} onChange={(e) => setSenha(e.target.value)} />

            <span className={styles.olho} onClick={() => setShowSenha(!showSenha)} >
              {showSenha ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button type="submit" className={styles.button}>
              Entrar
            </button>

            <button
              type="button" className={styles.button} onClick={limparCampos}>
              Limpar
            </button>
          </div>

        </form>

        <div className="mt-8 text-center">
          <p>
            <span>Não tem uma conta?</span>
            <Link to="/register" className={styles.link}> Clique aqui para fazer cadastro</Link>
          </p>
          <p>
            <span>Esqueceu a senha?</span>
            <Link to="/forgot" className={styles.link}> Clique aqui para redefinir a senha</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
