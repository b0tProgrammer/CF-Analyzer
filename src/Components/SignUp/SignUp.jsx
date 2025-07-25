import { useState } from "react";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

function SignUp() {

  const token = localStorage.getItem("token");
  if(token) {
    navigate("/");
  }

  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [mentorName, setmentorName] = useState("");
  const [email,setEmail] = useState("");

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  function isStrongPassword(pw) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pw);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role === "USER" && !mentorName) {
      setError("Please enter your Mentor's name.");
      return;
    }
    if (!userName) {
      setError("Please enter your userName.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email format.");
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
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.status === 208) {
        setError("user name already in use.");
        return;
      }
      if (response.status === 400) {
        setError("Please enter a correct Mentor Name.");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Sign up failed.");
        return;
      }

      alert("Account created successfully!");
      navigate("/signIn");
    } catch (err) {
      console.error("SignUp error:", err);
      setError("Could not connect to server.");
    }
  };

  return (
    <>
      <div className={styles.signUpContainer}>
        <div className={styles.signUpCard}>
          <form onSubmit={handleSubmit} className={styles.signUpForm}>
            <h2 className={styles.title}>Sign Up</h2>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.inputGroup} style={{ marginBottom: "1.2rem" }}>
              <label className={styles.label}>Sign up as:</label>
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

            {role === "USER" && (
              <div className={styles.inputGroup}>
                <label htmlFor="mentorName" className={styles.label}>
                  Mentor Name
                </label>
                <input
                  id="mentorName"
                  type="text"
                  className={styles.formInput}
                  value={mentorName}
                  onChange={(e) => setmentorName(e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}

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
                autoComplete="new-password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={styles.formInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            
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
              Sign Up
            </button>

            <p className={styles.footerText}>
              Already have an account?{" "}
              <span onClick={() => navigate("/signin")} className={styles.span}>
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SignUp;
