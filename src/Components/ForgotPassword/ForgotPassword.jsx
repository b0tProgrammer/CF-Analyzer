import styles from "./ForgotPassword.module.css";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();
    const [code,setCode] = useState("");
    const [email,setEmail] = useState("");
    const [sent,isSent] = useState(false);
    const [error,setError] = useState(false);
    const [errorMessage,setErrorMessage] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            const data = {
                email : email
            }
            const resp = await fetch(`http://localhost:8080/verifyEmail`, {
                method : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if(resp.status === 400) {
                setError(true);
                setErrorMessage("Account Doesn't exists. Please Sign In");
            } else if(resp.ok){
                isSent(true);
            }
        } catch (er) {
            console.error(er);
        }
    }

    async function handleNewSubmit(e) {
        e.preventDefault();
        const data = {
            email : email,
            code : code,
            password : password
        }
        try {
            const resp = await fetch(`http://localhost:8080/verifyCode`, {
                method : "POST",
                headers : {"Content-Type": "application/json"},
                body : JSON.stringify(data),
            });
            if(resp.ok) {
                navigate("/");
            } else {
                setError("Try Again");
            }
        } catch(er) {
            console.error(er);
        }
    }

    return(
        <div className={styles.forgotPasswordContainer}>
            <div className={styles.forgotPasswordCard}>
                {error && <div className={styles.error}>{errorMessage}</div>}
                <h2 className={styles.cardTitle}>Forgot Your Password?</h2>
                <p className={styles.cardInstructions}>
                No problem. Enter the email address associated with your account, and we'll send you a code to reset your password.
                </p>
                {!sent &&
                    <form className={styles.cardForm} onSubmit={handleSubmit}>
                        <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.formInput}
                            placeholder="you@example.com"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit" className={styles.submitButton}>
                            Send Code
                        </button>
                    </form>
                }
                {sent && 
                    <form onSubmit={handleNewSubmit}>
                        <label htmlFor="code" className={styles.formLabel}>Enter the Code</label>
                        <input
                            type="text"
                            id="code"
                            className={styles.formInput}
                            required
                            onChange={(e) => setCode(e.target.value)}
                        />
                        
                        <label htmlFor="password" className={styles.formLabel}>
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
                        
                        <label htmlFor="confirmPassword" className={styles.formLabel}>
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
                        <button type="submit" className={styles.submitButton}>
                            verify and logIn
                        </button>
                    </form>
                }
                <div className={styles.backToLogin}>
                    <span onClick={() => navigate("/signIn")}>← Back to Login</span>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;