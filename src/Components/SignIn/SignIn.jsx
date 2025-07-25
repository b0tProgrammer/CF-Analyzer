import { useState } from "react";
import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import FadeLoader from "react-spinners/FadeLoader";

function SignIn() {

  const token = localStorage.getItem("token");
  if(token) {
    navigate("/");
  }
  const navigate = useNavigate();
  const [userName, setuserName] = useState("");
  const [mentorName, setrMentorName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading,setIsLoading] = useState(false);
  const [email,setEmail] = useState("");

  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (role === "USER" && !mentorName) {
      setError("Please enter your Mentor's name.");
      return;
    }

    if (role === "ADMIN" && !userName) {
      setError("Please enter your userName.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");

    const data = {
      role,
      userName,
      password,
      email,
      ...(role === "USER" && { mentorName }),
    };

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/signIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if(response.status === 401) {
        setIsLoading(false);
        setError("Enter correct User Name and Password");
        return;
      }

      if(response.status === 400) {
        setIsLoading(false);
        setError("Bad Credentials");  
        return;
      }

      if (!response.ok) {
        setIsLoading(false);
        setError("Sign in failed.Try again");
        return;
      }
      const token = await response.text();
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <FadeLoader
            color={"#ccccccff"}
            loading={isLoading}
            height={15}
            width={5}
            radius={2}
            margin={2}
          />
        </div>
      )}
      <div className={styles.signInContainer}>
        <div className={styles.signInCard}>
          <form onSubmit={handleSubmit} className={styles.signInForm}>
            <h2 className={styles.title}>Sign In</h2>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup} style={{ marginBottom: "1.2rem" }}>
              <label className={styles.label}>Sign in as:</label>
              <label style={{ marginRight: "1.5rem" }}>
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={role === "USER"}
                  onChange={() => setRole("USER")}  
                  style={{ marginRight: "0.4rem" }}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={role === "ADMIN"}
                  onChange={() => setRole("ADMIN")}
                  style={{ marginRight: "0.4rem" }}
                />
                Mentor
              </label>
            </div>

            {role === "USER" ? (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="userName" className={styles.label}>
                    User Name
                  </label>
                  <input
                    id="userName"
                    type="text"
                    className={styles.formInput}
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    autoComplete="userName"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="mentorName" className={styles.label}>
                    Mentor Name
                  </label>
                  <input
                    id="mentorName"
                    type="text"
                    className={styles.formInput}
                    value={mentorName}
                    onChange={(e) => setrMentorName(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles.inputGroup}>
                  <label htmlFor="userName" className={styles.label}>
                    User Name
                  </label>
                  <input
                    id="userName"
                    type="text"
                    className={styles.formInput}
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    autoComplete="userName"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={styles.formInput}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </>
            )}

            {role === "USER" && (
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Enter Email</label>
              <input
                  id="email"
                  type="text"
                  className={styles.formInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
            </div>

            <button type="submit" className={styles.submitButton}>
              Sign In
            </button>

            <p className={styles.footerText}>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/signUp")}
                className={styles.span}
              >
                Sign Up
              </span>
            </p>
            <span  
              onClick={() => navigate("/forgotPassword")}
              className={styles.span}
            >
              Forgot password?
            </span>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignIn;