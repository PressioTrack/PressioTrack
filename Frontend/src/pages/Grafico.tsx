import React, { useState, useEffect } from "react";
import styles from "./Grafico.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { getMedicoes } from "../api/medicoes";

type Medicao = {
    sistolica: number;
    diastolica: number;
    dataMedicao: string;
};

type MessageType = "success" | "error" | null;

const Grafico: React.FC = () => {
    const [medicoes, setMedicoes] = useState<Medicao[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<MessageType>(null);

    const displayMessage = (text: string, type: MessageType = "error") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage(null);
            setMessageType(null);
        }, 6000);
    };

    const carregarMedicoes = async () => {
        try {
            const res = await getMedicoes();
            setMedicoes(res.slice(-7));
        } catch (err) {
            console.error("Erro ao carregar medições:", err);
            displayMessage("Erro ao carregar medições.", "error");
        }
    };

    useEffect(() => {
        carregarMedicoes();
    }, []);

    const data = medicoes.map((m) => ({
        data: new Date(m.dataMedicao).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        sistolica: m.sistolica,
        diastolica: m.diastolica,
    }));

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Gráfico de Medições (7 dias)</h3>

            {message && (
                <div className={`${styles.message} ${styles[messageType!]}`}>
                    {message}
                </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
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
    );
};

export default Grafico;
