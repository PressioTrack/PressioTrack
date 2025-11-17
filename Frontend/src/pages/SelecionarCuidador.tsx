import React, { useState } from "react";
import { solicitarAssociacao, removerCuidador } from "../api/cuidador";
import { useAuth } from "../context/AuthContext";
import styles from "./SelecionarCuidador.module.css";

const SolicitarCuidador: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const jaTemCuidador = Boolean(user?.cuidadorId);
  const cuidadorInfo = user?.cuidador;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const res = await solicitarAssociacao(email);
      setMensagem(res.message || "Convite enviado com sucesso!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Erro ao enviar o convite ao cuidador.";
      setMensagem(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoverCuidador = async () => {
    if (!window.confirm("Deseja realmente remover o cuidador vinculado?")) return;

    try {
      setLoading(true);
      const res = await removerCuidador();

      setMensagem(res.message || "Cuidador removido com sucesso!");

      if (user) {
        updateUser({ ...user, cuidadorId: null });
      }

    } catch (err: any) {
      setMensagem(err?.response?.data?.message || "Erro ao remover cuidador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {jaTemCuidador ? "Cuidador Vinculado" : "Convidar Cuidador"}
        </h2>

        {mensagem && (
          <div
            className={`${styles.message} ${mensagem.includes("sucesso")
              ? styles.messageSuccess
              : styles.messageError
              }`}
          >
            {mensagem}
          </div>
        )}

        {jaTemCuidador ? (
          <>
            <div className={styles.infoBox}>
              <p><strong>Nome:</strong> {cuidadorInfo?.nome || "—"}</p>
              <p><strong>E-mail:</strong> {cuidadorInfo?.email || "—"}</p>
            </div>
            <p className={styles.infoText}>
              Você já possui um cuidador vinculado.
            </p>

            <button
              type="button"
              onClick={handleRemoverCuidador}
              disabled={loading}
              className={`${styles.button} ${styles.buttonRemover}`}
            >
              {loading ? "Removendo..." : "Remover Cuidador"}
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>E-mail do Cuidador</label>

            <input type="email" placeholder="exemplo@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} disabled={loading} />

            <button type="submit" disabled={loading} className={`${styles.button} ${loading ? styles.buttonDisabled : ""}`}>
              {loading ? "Enviando..." : "Enviar Convite"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SolicitarCuidador;
