import React, { useEffect, useState } from "react";
import { getPacientesVinculados } from "../api/cuidador";
import { useNavigate } from "react-router-dom";
import styles from "./ListarPacientes.module.css";

const MeusPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPacientesVinculados();
        setPacientes(data);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pacientes Vinculados</h2>

      {pacientes.length === 0 && <p className={styles.semPacientes}>Nenhum paciente vinculado.</p>}

      <ul className={styles.listaPacientes}>
        {pacientes.map((p) => (
          <li key={p.id} className={styles.pacienteCard} onClick={() => navigate(`/paciente/${p.id}/medicoes`)}>
            <span className={styles.pacienteNome}>{p.nome}</span><br></br>
             <span className={styles.pacienteEmail}>{p.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeusPacientes;
