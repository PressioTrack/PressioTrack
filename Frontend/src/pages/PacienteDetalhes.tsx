import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMedicoesPaciente, gerarRelatorioPDF } from "../api/cuidador";
import Grafico from "../pages/Grafico";
import styles from "./PacienteDetalhes.module.css";

const PacienteDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [medicoes, setMedicoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicoes = async () => {
      try {
        setLoading(true);
        const data = await getMedicoesPaciente(Number(id));
        setMedicoes(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar medições.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicoes();
  }, [id]);

  const handleExportPDF = async () => {
    try {
      const blob = await gerarRelatorioPDF(Number(id));
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_paciente_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PDF.");
    }
  };

  if (loading) return <div>Carregando medições...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Medições do Paciente</h2>

      <button className={styles.exportButton} onClick={handleExportPDF}>
        Exportar PDF
      </button>

      {loading && <div className={styles.loadingMessage}>Carregando medições...</div>}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.graficoContainer}>
        <Grafico medicoes={medicoes} />
      </div>
    </div>
  );
};

export default PacienteDetalhes;
