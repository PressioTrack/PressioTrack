import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updatePerfil } from "../api/userPerfil";
import { useNavigate } from "react-router-dom";
import styles from "./Perfil.module.css";

type MessageType = "success" | "error" | null;

const Perfil: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [idade, setIdade] = useState("0");
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>(null);
    const [salvando, setSalvando] = useState(false);
    const [pressaoSistolicaNormal, setPressaoSistolicaNormal] = useState<number>(120);
    const [pressaoDiastolicaNormal, setPressaoDiastolicaNormal] = useState<number>(80);
    const [naoSeiPressao, setNaoSeiPressao] = useState(false);

    useEffect(() => {
        if (user) {
            setNome(user.nome || "");
            setEmail(user.email || "");
            setTelefone(user.telefone || "");
            setIdade(user.idade?.toString() || "0");

            if (user.dadosSaude) {
                setPressaoSistolicaNormal(user.dadosSaude.pressaoSistolicaNormal || 120);
                setPressaoDiastolicaNormal(user.dadosSaude.pressaoDiastolicaNormal || 80);
            } else {
                setPressaoSistolicaNormal(120);
                setPressaoDiastolicaNormal(80);
            }
        }
    }, [user]);

    const displayMessage = (text: string, type: MessageType = "error") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 4000);
    };

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

    const limparCampos = () => {
        if (user) {
            setNome(user.nome || "");
            setEmail(user.email || "");
            setTelefone(user.telefone || "");
            setIdade(user.idade?.toString() || "0");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        setMessage(null);

        if (!nome || !email || !telefone || !idade || Number(idade) <= 0) {
            displayMessage("Todos os campos são obrigatórios e idade deve ser maior que 0.", "error");
            setSalvando(false);
            return;
        }

        try {
            const sistolica = naoSeiPressao ? 120 : pressaoSistolicaNormal;
            const diastolica = naoSeiPressao ? 80 : pressaoDiastolicaNormal;
            const idadeNumber = Number(idade) || 0;
            await updatePerfil({ nome, email, telefone, idade: idadeNumber, pressaoSistolicaNormal: sistolica, pressaoDiastolicaNormal: diastolica, naoSeiPressao });
            await refreshUser();
            displayMessage("Perfil atualizado com sucesso!", "success");
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            console.error(err);
            displayMessage("Erro ao atualizar perfil.", "error");
        } finally {
            setSalvando(false);
        }
    };

    const handleCancel = () => {
        limparCampos();
        navigate("/dashboard");
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Meu Perfil</h1>

            {message && (
                <p className={`${styles.message} ${messageType === "success" ? styles.success : styles.error}`}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>Nome:</label>
                <input className={styles.input} type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                <label className={styles.label}>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} />

                <label className={styles.label}>Telefone:</label>
                <input type="text" className={styles.input} value={telefone} onChange={handleTelefoneChange} required />

                <label className={styles.label}>Idade: </label>
                <input className={styles.input} type="number" value={idade} onChange={(e) => setIdade(e.target.value)} min={0} />

                <label className={styles.label}>Pressão Sistólica Normal:</label>
                <input className={styles.input} type="number" value={pressaoSistolicaNormal} onChange={(e) => setPressaoSistolicaNormal(Number(e.target.value))} disabled={naoSeiPressao} />

                <label className={styles.label}>Pressão Diastólica Normal:</label>
                <input className={styles.input} type="number" value={pressaoDiastolicaNormal} onChange={(e) => setPressaoDiastolicaNormal(Number(e.target.value))} disabled={naoSeiPressao} />

                <div className={styles.checkboxContainer}>
                    <input type="checkbox" id="naoSeiPressao" checked={naoSeiPressao} onChange={(e) => setNaoSeiPressao(e.target.checked)}/>
                    <label htmlFor="naoSeiPressao">Não sei minha pressão normal</label>
                </div>
                <div className={styles.buttons}>
                    <button type="submit" className={styles.button} disabled={salvando}>
                        {salvando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                    <button className={styles.botaoCancelar} type="button" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div >
    );
};

export default Perfil;
