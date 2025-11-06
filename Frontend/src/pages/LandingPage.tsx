import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
        <Link to="/" className={styles.brand}>
          <img src="/logotipo-menor.png" alt="PressioTrack" className={styles.logo} />
          </Link>
        </div>
        <nav>
          <a href="#beneficios">Benefícios</a>
          <a href="#como">Como funciona</a>
        </nav>
      </header >

      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Controle de saúde simplificado</span>
          <h1 className={styles.headline}>Monitore sua pressão arterial com clareza e segurança.</h1>
          <p className={styles.sub}>
            Registre, acompanhe sua evolução e tenha tudo organizado para você e para profissionais de saúde quando precisar.
          </p>
          <button
            className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg"
            onClick={() => navigate('/register')}
          >
            Criar minha conta
          </button>
        </div>

        <div className={styles.mockup}>
          <div className={styles.deviceTitle}>PressioTrack</div>
          <div className={styles.readingBox}>
            <div className={styles.bpValue}>
              119 / 75 <span className="text-xs text-gray-500">mmHg</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Última leitura: 11:21</div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="beneficios">
        <h2>Benefícios principais</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Visual claro</h3>
            <p>Interface limpa para qualquer idade, sem complexidade.</p>
          </div>
          <div className={styles.feature}>
            <h3>Histórico organizado</h3>
            <p>Acompanhe tendências e evolução ao longo do tempo.</p>
          </div>
          <div className={styles.feature}>
            <h3>Compartilhamento seguro</h3>
            <p>Envie suas medições apenas para quem você autorizar.</p>
          </div>
        </div>
      </section>

      <section className={styles.section} id="como">
        <h2>Como funciona</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <strong>1. Registrar</strong>
            Insira suas medições manualmente ou conecte seu aparelho.
          </div>
          <div className={styles.step}>
            <strong>2. Acompanhar</strong>
            Veja seus resultados e padrões de forma simples.
          </div>
          <div className={styles.step}>
            <strong>3. Compartilhar</strong>
            Gere relatórios e compartilhe quando quiser.
          </div>
        </div>
      </section>
      <section className={styles.ctaFinal}>
        <h2>Pronto para começar?</h2>
        <button
          className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg"
          onClick={() => navigate('/register')}
        >
          Criar minha conta agora
        </button>
      </section>

      <footer className={styles.footer}>
        &copy; 2025 PressioTrack. Todos os direitos reservados.
      </footer>
    </div >
  );
};

export default LandingPage;
