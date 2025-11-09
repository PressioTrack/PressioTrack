import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";

import {
  getMedicoes,
  createMedicao,
  updateMedicao,
  deleteMedicao,
} from "../api/medicoes";

type MessageType = "success" | "error" | null;

const Dashboard: React.FC = () => {
  const [sistolica, setSistolica] = useState("");
  const [diastolica, setDiastolica] = useState("");
  const [observacao, setObservacao] = useState("");
  const [medicoes, setMedicoes] = useState<any[]>([]);
  const [ultimaMedicao, setUltimaMedicao] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>(null);
  const [editando, setEditando] = useState<any>(null);

  const displayMessage = (text: string, type: MessageType = "error") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 4000);
  };

  const carregarMedicoes = async () => {
    try {
      const res = await getMedicoes();
      const hoje = new Date();
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(hoje.getDate() - 30);

      const ultimos30dias = res.filter((m: any) => {
        const dataMedicao = new Date(m.dataMedicao);
        return dataMedicao >= trintaDiasAtras;
      });

      setMedicoes(ultimos30dias);
      setUltimaMedicao(ultimos30dias[0] || null);
    } catch (err) {
      console.error(err);
      displayMessage("Erro ao carregar medições.", "error");
    }
  };

  useEffect(() => {
    carregarMedicoes();
  }, []);

  const limparFormulario = () => {
    setSistolica("");
    setDiastolica("");
    setObservacao("");
  };

  const cancelarEdicao = () => {
    limparFormulario();
    setEditando(null);
    displayMessage("Edição cancelada.", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sistolica || !diastolica)
      return displayMessage("Preencha os campos de pressão.", "error");

    const sist = Number(sistolica);
    const dia = Number(diastolica);

    if (isNaN(sist) || isNaN(dia))
      return displayMessage("Valores de pressão inválidos.", "error");

    const obs =
      observacao && observacao.trim().length > 0
        ? observacao.trim()
        : "Sem observação";

    let status = "NORMAL";
    if (sist >= 140 || dia >= 90) status = "HIPERTENSÃO";
    else if (sist < 90 || dia < 60) status = "BAIXA";

    const payload = {
      sistolica: sist,
      diastolica: dia,
      observacao: obs,
      status: status,
    };

    try {
      if (editando) {
        await updateMedicao(editando.id, payload);
        displayMessage("Medição atualizada com sucesso!", "success");
      } else {
        await createMedicao(payload);
        displayMessage("Medição registrada com sucesso!", "success");
      }

      limparFormulario();
      setEditando(null);
      carregarMedicoes();
    } catch (error: any) {
      console.error("Erro ao salvar medição:", error);
      displayMessage("Erro ao salvar medição. Tente novamente.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta medição?")) return;
    try {
      await deleteMedicao(id);
      displayMessage("Medição excluída com sucesso.", "success");
      carregarMedicoes();
    } catch {
      displayMessage("Erro ao excluir medição.", "error");
    }
  };

  const handleEdit = (m: any) => {
    setEditando(m);
    setSistolica(String(m.sistolica));
    setDiastolica(String(m.diastolica));
    setObservacao(m.observacao || "");
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardEsquerda}>
        <div className={styles.statusAtual}>
          {ultimaMedicao ? (
            <>
              <h2 className={styles.pressaoAtual}>
                {ultimaMedicao.sistolica} / {ultimaMedicao.diastolica} mmHg
              </h2>
              <span
                className={`${styles.status} ${ultimaMedicao.status === "NORMAL"
                  ? styles.statusNormal
                  : ultimaMedicao.status === "HIPERTENSÃO"
                    ? styles.statusAlta
                    : styles.statusBaixa
                  }`}
              >
                {ultimaMedicao.status}
              </span>
              <p className={styles.ultimaMedicao}>
                Última medição:{" "}
                {new Date(ultimaMedicao.dataMedicao).toLocaleString()}
              </p>
            </>
          ) : (
            <h2 className={styles.pressaoAtual}>-- / -- mmHg</h2>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <h3 className={styles.sectionTitle}>
            {editando ? "Editar Medição" : "Registrar Medição"}
          </h3>

          {message && (
            <div className={`${styles.message} ${styles[messageType!]}`}>
              {message}
            </div>
          )}

          <div className={styles.inputsRow}>
            <input
              type="number"
              placeholder="Sistólica (contração do coração)"
              value={sistolica}
              onChange={(e) => setSistolica(e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Diastólica (relaxamento do coração)"
              value={diastolica}
              onChange={(e) => setDiastolica(e.target.value)}
              className={styles.input}
            />
          </div>

          <textarea
            placeholder="Observação (ex: após exercício, café, em jejum...)"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            className={styles.textarea}
            rows={2}
          />

          <div className={styles.linhaBotoes}>
            <button type="submit" className={styles.button}>
              {editando ? "Salvar Alterações" : "Registrar"}
            </button>

            <button
              type="button"
              onClick={limparFormulario}
              className={`${styles.botaoLimpar}`}
            >
              Limpar
            </button>

            {editando && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className={`${styles.botaoCancelar}`}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.cardDireita}>
        <h3 className={styles.sectionTitle}>Últimas medições (30 dias)</h3>
        <div className={styles.listaMedicoes}>
          {medicoes.length === 0 ? (
            <p className={styles.noMedicoes}>
              Nenhuma medição registrada nos últimos 30 dias.
            </p>
          ) : (
            medicoes.map((m) => (
              <div key={m.id} className={styles.medicaoCard}>
                <div className={styles.medicaoInfo}>
                  <p className={styles.medicaoValor}>
                    {m.sistolica}/{m.diastolica} mmHg
                    <span
                      className={`${styles.status} ${m.status === "NORMAL"
                        ? styles.statusNormal
                        : m.status === "HIPERTENSÃO"
                          ? styles.statusAlta
                          : styles.statusBaixa
                        }`}
                    >
                      {m.status}
                    </span>
                  </p>
                  <p className={styles.data}>
                    {new Date(m.dataMedicao).toLocaleString()}
                  </p>
                  {m.observacao && (
                    <p className={styles.observacao}>“{m.observacao}”</p>
                  )}
                </div>

                <div className={styles.buttons}>
                  <button
                    type="button"
                    onClick={() => handleEdit(m)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className={styles.deleteButton}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
