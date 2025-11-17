import React, { useMemo } from "react";
import styles from "./Grafico.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

type Medicao = {
    sistolica: number;
    diastolica: number;
    dataMedicao: string;
};

type GraficoProps = {
    medicoes: Medicao[];
};

const Grafico: React.FC<GraficoProps> = ({ medicoes }) => {

    const ultimasMedicoes = useMemo(() => {
        const ordenadas = [...medicoes].sort(
            (a, b) => new Date(a.dataMedicao).getTime() - new Date(b.dataMedicao).getTime()
        );
        return ordenadas.slice(-7);
    }, [medicoes]);

    const data = useMemo(() => {
        return ultimasMedicoes.map((m) => ({
            data: new Date(m.dataMedicao).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            sistolica: m.sistolica,
            diastolica: m.diastolica,
        }));
    }, [ultimasMedicoes]);

    const sistolicas = ultimasMedicoes.map((m) => Number(m.sistolica));
    const diastolicas = ultimasMedicoes.map((m) => Number(m.diastolica));

    const calcularMedia = (valores: number[]): number => {
        if (valores.length === 0) return 0;
        return valores.reduce((acc, val) => acc + val, 0) / valores.length;
    };

    const calcularDesvioPadrao = (valores: number[]): number => {
        if (valores.length === 0) return 0;
        const media = calcularMedia(valores);
        const somaQuadrados = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0);
        return Math.sqrt(somaQuadrados / valores.length);
    };

    const mediaSist = calcularMedia(sistolicas);
    const mediaDia = calcularMedia(diastolicas);

    const desvioSist = calcularDesvioPadrao(sistolicas);
    const desvioDia = calcularDesvioPadrao(diastolicas);

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Gráfico de Medições (7 últimas)</h3>

            <div id="grafico-pdf">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value, name) => [`${value}`, name]} labelFormatter={(label) => `Horário: ${label}`} />
                        <Legend verticalAlign="top" height={40} className={styles.legend} />
                        <Line type="monotone" dataKey="sistolica" stroke="var(--sistolic-color)" strokeWidth={3} name="Sistólica" dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="diastolica" stroke="var(--diastolic-color)" strokeWidth={3} name="Diastólica" dot={{ r: 5 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.desvioContainer}>
                <h4 className={styles.desvioTitle}>Desvio Padrão das Medições</h4>
                <p className={styles.desvioItem}>
                    <strong>Sistólica:</strong> desvio {desvioSist.toFixed(2)} mmHg - média {mediaSist.toFixed(1)}
                </p>
                <p className={styles.desvioItem}>
                    <strong>Diastólica:</strong> desvio {desvioDia.toFixed(2)} mmHg - média {mediaDia.toFixed(1)}
                </p>
                <p className={styles.desvioInfo}>
                    O desvio padrão indica a variação das medições. Valores menores significam
                    medições mais consistentes; valores maiores indicam maior variação da pressão.
                </p>
            </div>
        </div>
    );
};


export default Grafico;