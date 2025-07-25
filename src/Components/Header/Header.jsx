import { jwtDecode } from 'jwt-decode';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';


function Header() {
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decodedToken = token ? jwtDecode(token) : null;
  const userName = decodedToken ? decodedToken.sub : 'Enter';

  function go() {
    if (userName === 'Enter') {
      navigate('/signin');
    } else {
      navigate('/user');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }


  return (
    <>
      <nav className={styles.navbarRoot}>
        <div className={styles.navbarContent}>
          <h1 className={styles.navbarTitle}>CF Analyzer</h1>
          <h2 className={styles.navbarSubtitle}>
            Manage and analyze your student profiles without effort
          </h2>
          <div className={styles.userInfo}>
            <span onClick={() => go()} className={styles.span}>{userName}</span>
            <span className={styles.span} onClick={() => logout()}>Logout</span>
            <span className={styles.span} onClick={() => navigate('/')}>Home</span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;