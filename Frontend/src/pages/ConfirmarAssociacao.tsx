import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { confirmarAssociacao } from "../api/cuidador";
import styles from "./ConfirmarAssociacao.module.css";

const ConfirmarAssociacao: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const cuidadorId = searchParams.get("cuidadorId");

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !cuidadorId) {
      setMensagem("Token inválido ou link incompleto.");
      setLoading(false);
      return;
    }

    const confirmar = async () => {
      try {
        const res = await confirmarAssociacao(token, cuidadorId);
        setMensagem(res.message || "Associação confirmada com sucesso!");
      } catch (err: any) {
        setMensagem(
          err?.response?.data?.message || "Erro ao confirmar associação."
        );
      } finally {
        setLoading(false);
      }
    };

    confirmar();
  }, [token, cuidadorId]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Confirmação de Associação</h2>

        <div
          className={`${styles.mensagem} ${mensagem.includes("sucesso") ? styles.sucesso : styles.erro
            }`}
        >
          {loading ? <span className={styles.loading}>Validando token...</span> : mensagem}
        </div>
      </div>
    </div>
  );
};

export default ConfirmarAssociacao;
