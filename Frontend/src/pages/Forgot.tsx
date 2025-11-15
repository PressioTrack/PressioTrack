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

  const baseButtonClasses = "bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out w-full";
  const buttonClasses = `${baseButtonClasses} ${loading || !!sucesso ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`;


  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Esqueceu Sua Senha?</h2>
        
        <p className={`${styles.instruction} mb-4`}>
          Digite seu e-mail e enviaremos um link para você redefinir sua senha.
        </p>

        
        {erro && (
            <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-center font-medium" role="alert">
                {erro}
            </p>
        )}
        
       
        {sucesso && (
            <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-center font-medium" role="alert">
                {sucesso}
            </p>
        )}

       
        <form onSubmit={handleSubmit} className="flex flex-col gap-4"> 
          
          
          <div className="flex flex-col"> 
           
            <label htmlFor="email" className={`${styles.label} mb-1 text-center`}>Email</label> 
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
              disabled={loading || !!sucesso}
            />
          </div>

          
          <button
            type="submit"
            className={buttonClasses}
            disabled={loading || !!sucesso}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>

        
        <div className={`mt-6 text-center`}> 
          <Link 
            to="/login" 
            className={`${styles.link} inline-block py-2 px-4 text-sm font-medium text-gray-600 hover:text-green-600 transition duration-150`}
          >
            ← Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Forgot;