import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import styles from "./User.module.css";
import Footer from "../Footer/Footer";

function User() {

  const token = localStorage.getItem("token");
  if(!token) {
    return <p>Please login as mentor to access this feature</p>
  }

  const decodedToken = jwtDecode(token);
  const userName = decodedToken.sub;

  const [showChange, setShowChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMsg("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg("New passwords do not match.");
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword)) {
      setMsg(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    setMsg("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    try {
      const data = {
        oldPassWord : oldPassword,
        newPassWord : newPassword
      }
      const resp = await fetch(
        `http://localhost:8080/${userName}/changePassword`,
        {
          method : "POST",
          headers : {
            'Content-Type' : 'application/json',
            Authorization : `Bearer ${token}`
          },
          body : JSON.stringify(data),
        }
      );
      if(resp.ok) console.log("Successfully changed the password");
    } catch(er) {
      console.error(er);
    }
  }

  return (
    <>
      <div className={styles.userPageBg}>
        <div className={styles.userCard}>
          <h2 className={styles.title}>User Profile</h2>
          <div className={styles.details}>
            <div>
              <span>Username: {userName} </span>
            </div>
          </div>
          <button
            className={styles.submitButton}
            onClick={() => setShowChange((v) => !v)}
          >
            {showChange ? "Cancel" : "Change Password"}
          </button>
          {showChange && (
            <form onSubmit={handleChangePassword}>
              {msg && <div className={styles.msg}>{msg}</div>}
              <input
                type="password"
                placeholder="Old Password"
                className={styles.formInput}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                className={styles.formInput}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className={styles.formInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="submit" className={styles.submitButton}>
                Save
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
}
export default User;