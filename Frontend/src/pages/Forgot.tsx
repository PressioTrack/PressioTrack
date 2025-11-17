import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Forgot.module.css';
import { Link } from 'react-router-dom';

const Forgot: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.ok) {
        setSucesso(
          'Se o e-mail estiver cadastrado, você receberá um link de redefinição. Verifique sua caixa de entrada.'
        );
      } else {
        setErro('Não foi possível processar a solicitação. Por favor, verifique o e-mail e tente novamente.');
      }
    } catch (error) {
      setErro('Erro de conexão ou inesperado. Tente novamente.');
      console.error('Erro ao solicitar redefinição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Esqueceu Sua Senha?</h2>

        <p className={styles.instruction}>
          Digite seu e-mail e enviaremos um link para você redefinir sua senha.
        </p>

        {erro && <p className={`${styles.alert} ${styles.error}`}>{erro}</p>}
        {sucesso && <p className={`${styles.alert} ${styles.success}`}>{sucesso}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className={`${styles.label} text-center`}>Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required disabled={loading || !!sucesso} />
          </div>

          <button type="submit" className={`${styles.button} ${loading || !!sucesso ? styles.disabled : ''}`} disabled={loading || !!sucesso} >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className={styles.link}>
            ← Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forgot;