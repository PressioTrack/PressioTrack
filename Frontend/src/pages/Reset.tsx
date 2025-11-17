import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Reset.module.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Reset: React.FC = () => {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [senhaInvalida, setSenhaInvalida] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);

    useEffect(() => {
        if (!token) {
            setErro('Token de redefinição não encontrado. Por favor, solicite um novo.');
        }
    }, [token]);

    useEffect(() => {
        if (senha && confirmarSenha && senha !== confirmarSenha) {
            setSenhaInvalida(true);
        } else {
            setSenhaInvalida(false);
        }
    }, [senha, confirmarSenha]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        if (!token) {
            setErro('Token inválido ou expirado. Solicite um novo link.');
            return;
        }

        if (senha !== confirmarSenha) {
            setErro('As senhas digitadas não são iguais.');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);

        try {
            const result = await resetPassword(token, senha);

            if (result.ok) {

                setErro('Sua senha foi redefinida com sucesso! Redirecionando para o login...');

                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            } else {
                setErro(result.message || 'Erro ao redefinir a senha. O link pode ter expirado.');
            }
        } catch (error) {
            setErro('Erro de conexão ou inesperado. Tente novamente.');
            console.error('Erro inesperado ao redefinir senha:', error);
        } finally {
            if (!erro.includes('sucesso')) {
                setLoading(false);
            }
        }
    };

    const isSuccessMessage = erro.includes('sucesso');
    const isDisabled = loading || senhaInvalida || !senha || !confirmarSenha || isSuccessMessage;


    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Criar Nova Senha</h2>

                {erro && (
                    <div
                        className={`${styles.alert} ${isSuccessMessage ? styles.success : styles.error}`} role="alert">{erro}
                    </div>
                )}

                {!isSuccessMessage && (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.senhaContainer}>
                            <label htmlFor="senha" className={styles.label}>
                                Nova Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <input id="senha" type={showSenha ? 'text' : 'password'} value={senha} onChange={(e) => setSenha(e.target.value)} className={styles.input} placeholder="Mínimo de 6 caracteres" minLength={6} disabled={loading} required />
                                <span className={styles.olho} onClick={() => setShowSenha(!showSenha)}>
                                    {showSenha ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                            </div>
                        </div>

                        <div className={styles.senhaContainer}>
                            <label htmlFor="confirmarSenha" className={styles.label}>
                                Confirmar Nova Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <input id="confirmarSenha" type={showConfirmar ? 'text' : 'password'} value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className={`${styles.input} ${senhaInvalida ? styles.inputError : ''}`} placeholder="Mínimo de 6 caracteres" minLength={6} disabled={loading} required />
                                <span className={styles.olho} onClick={() => setShowConfirmar(!showConfirmar)}>
                                    {showConfirmar ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                </span>
                            </div>
                        </div>

                        {senhaInvalida && (
                            <p className={styles.errorText}>As senhas digitadas não são iguais.</p>
                        )}

                        <button type="submit" className={`${styles.button} ${isDisabled ? styles.disabled : ''}`} disabled={isDisabled}>
                            {loading ? 'Salvando...' : 'Redefinir Senha'}
                        </button>
                    </form>
                )}

                {(!token || !isSuccessMessage) && (
                    <div className={styles.linkContainer}>
                        <a href="/forgot" className={styles.link}>
                            Solicitar novo link de redefinição
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reset;