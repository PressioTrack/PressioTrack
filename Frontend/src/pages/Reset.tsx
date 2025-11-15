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
                        className={`p-3 mb-4 text-sm border rounded-lg 
                    ${isSuccessMessage
                                ? 'text-green-700 bg-green-100 border-green-400'
                                : 'text-red-700 bg-red-100 border-red-400'
                            }`}
                        role="alert"
                    >
                        {erro}
                    </div>
                )}


                <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ display: isSuccessMessage ? 'none' : 'flex' }}>


                    <div className={styles.senhaContainer}>
                        <label htmlFor="senha" className="text-center text-sm font-medium mb-1 text-gray-700">Nova Senha</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="senha"
                                type={showSenha ? 'text' : 'password'}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className={styles.input}
                                required
                                minLength={6}
                                disabled={loading || !!erro}
                                placeholder="Mínimo de 6 caracteres"
                            />
                            <span className={styles.olho} onClick={() => setShowSenha(!showSenha)}>
                                {showSenha ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>

                    <div className={styles.senhaContainer}>
                        <label htmlFor="confirmarSenha" className="text-center text-sm font-medium mb-1 text-gray-700">Confirmar Nova Senha</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="confirmarSenha"
                                type={showConfirmar ? 'text' : 'password'}
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                className={`${styles.input} ${senhaInvalida ? 'border-red-500' : ''}`}
                                required
                                minLength={6}
                                disabled={loading || !!erro}
                                placeholder="Mínimo de 6 caracteres"
                            />
                            <span className={styles.olho} onClick={() => setShowConfirmar(!showConfirmar)}>
                                {showConfirmar ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>


                    {senhaInvalida && (
                        <p className="text-sm text-red-600 -mt-2">As senhas digitadas não são iguais.</p>
                    )}


                    <button
                        type="submit"
                        className={`
                                    w-full py-2 px-4 rounded-lg font-semibold transition duration-200 mt-2
                            ${isDisabled
                                ? 'bg-green-600 text-white opacity-50 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }
            `}
                        disabled={isDisabled}
                    >
                        {loading ? 'Salvando...' : 'Redefinir Senha'}
                    </button>
                </form>


                {(!token || !isSuccessMessage) && (
                    <div className="mt-6 text-center">
                        <a href="/forgot" className="text-sm font-medium text-gray-600 hover:text-green-600 transition duration-150">
                            Solicitar novo link de redefinição
                        </a>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Reset;