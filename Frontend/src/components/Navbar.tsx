import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={`${styles.nav} ${isAuthPage ? styles.authNav : styles.loggedNav}`}>
      <div className={isAuthPage ? styles.center : styles.left}>
        <Link to="/" className={styles.brand}>
          <img src="/logotipo-menor.png" alt="PressioTrack" className="h-12" />
        </Link>
      </div>

      {!isAuthPage && (
        <div className={styles.right}>
          <button className={styles.button} onClick={handleLogout}>
            SAIR
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
