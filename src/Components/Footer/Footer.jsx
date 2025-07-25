import styles from './Footer.module.css';
import { useNavigate } from 'react-router-dom';

function Footer() {

  const navigate = useNavigate();

  return (
    <footer className={styles.footerRoot}>
      <p className={styles.footerText}>© 2025 CF Analyzer</p>
      <span className={styles.span} onClick={() => navigate("/")}>Home</span>
    </footer>
  );
}

export default Footer;