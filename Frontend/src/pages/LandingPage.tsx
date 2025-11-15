import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  return (
    <div className={styles.container}>
      <header className={styles.cabecalho}>
        <div className={styles.marca}>
          <Link to="/" className={styles.marca}>
            <img
              src="/logotipo-menor.png"
              alt="PressioTrack"
              className={styles.logo}
            />
          </Link>
        </div>
        <nav className={styles.navContainer}>

          <div className={styles.navLinks}>
            <a href="#beneficios">Benefícios</a>
            <a href="#como-funciona">Como funciona</a>
          </div>

          {!isAuthPage && user && (
            <div className={styles.loggedButtons}>
              <button className={styles.button} onClick={handleDashboard}>
                DASHBOARD
              </button>
              <button className={styles.button} onClick={handlePerfil}>
                PERFIL
              </button>
              <button className={styles.button} onClick={handleLogout}>
                SAIR
              </button>
            </div>
          )}
        </nav>
      </header>

      <section className={styles.hero}>
        <div>
          <span className={styles.etiqueta}>Controle de saúde simplificado</span>
          <h1 className={styles.tituloPrincipal}>
            Monitore sua pressão arterial com clareza e segurança.
          </h1>
          <p className={styles.subtitulo}>
            Registre suas medições, acompanhe sua evolução e tenha tudo
            organizado para compartilhar com profissionais de saúde.
          </p>
          <button
            className="bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg"
            onClick={() => navigate('/register')}
          >
            Criar minha conta
          </button>
        </div>

        <div className={styles.caixaExemplo}>
          <div className={styles.tituloDispositivo}>PressioTrack</div>
          <div className={styles.caixaLeitura}>
            <div className={styles.valorPressao}>
              119 / 75 <span className="text-xs text-gray-500">mmHg</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Última leitura: 11:21
            </div>
          </div>
        </div>
      </section>

      <section className={styles.secao} id="beneficios">
        <h2>Benefícios principais</h2>
        <div className={styles.beneficios}>
          <div className={styles.beneficio}>
            <h3>Visual claro</h3>
            <p>Interface limpa e intuitiva para todas as idades.</p>
          </div>
          <div className={styles.beneficio}>
            <h3>Histórico organizado</h3>
            <p>Acompanhe sua evolução ao longo do tempo com facilidade.</p>
          </div>
          <div className={styles.beneficio}>
            <h3>Compartilhamento seguro</h3>
            <p>Envie suas medições apenas para quem você autorizar.</p>
          </div>
        </div>
      </section>

      <section className={styles.secao} id="como-funciona">
        <h2>Como funciona</h2>
        <div className={styles.passos}>
          <div className={styles.passo}>
            <strong>1. Registrar</strong>
            Insira suas medições manualmente ou conecte seu aparelho.
          </div>
          <div className={styles.passo}>
            <strong>2. Acompanhar</strong>
            Veja seus resultados e padrões de forma simples e clara.
          </div>
          <div className={styles.passo}>
            <strong>3. Compartilhar</strong>
            Gere relatórios e compartilhe com quem desejar.
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

      <footer className={styles.rodape}>
        &copy; 2025 PressioTrack. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default LandingPage;
