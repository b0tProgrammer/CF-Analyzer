import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import styles from "./AddStudent.module.css";

function AddStudent() {

  const token = localStorage.getItem("token");
  if(!token) {
    return <p>Please login as mentor to access this feature</p>
  }

  const navigate = useNavigate();
  const[handle,setHandle] = new useState("");
  const[name,setName] = new useState("");
  const userName = jwtDecode(token).sub;
  const [step, setStep] = useState(0);
  const [admin,setAdmin] = useState({}); 
  const [role, setRole] = useState("");

  useEffect(() => {
      if (step === 0) {
        async function fetchAdmin() {
          try {
            const response = await fetch(
              `http://localhost:8080/${userName}/isAdmin`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (!response.ok) throw new Error("Failed to fetch admin data");
            const data = await response.json();
            const newAdmin = {
              id: data.id,
              userName: data.userName,
              role: "ADMIN",
              handles: data.handles || [],
            };
            setAdmin(newAdmin);
            setAdmin(data);
            if(userName !== data.userName) setRole("USER"); 
            else setRole("ADMIN");
          } catch (error) {
            console.error("Error fetching admin data:", error);
          }
        }
        fetchAdmin();
        setStep(2);
      }
    }, [userName]);

    if(step === 2 && role !== "ADMIN") {
      return (
        <div>
          <h2>You are not authorized to add students</h2>
        </div>
      );
    }

  const handleSubmit = async (e) => {
      e.preventDefault();
      const data = {
          name,
          handle
      };
      try {
          const response = await fetch(`http://localhost:8080/${userName}/addStudent`, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
              },
              body: JSON.stringify(data),
          });
          if(response.status === 400) {
            console.error("Student Already exists");
            return;
          }
          if (!response.ok) {
              console.error("Failed to add student");
              return;
          } else {
              setName("");
              setHandle("");
              navigate("/");
          }
      } catch(er) {
          console.error(er);
      }
  }

  return (
      <>
        <div className={styles.addStudentContainer}>
          <div className={styles.addStudentCard}>
            <h2 className={styles.cardTitle} >Add Student</h2>
            <form onSubmit={handleSubmit} className={styles.cardForm} >
                <label>Enter student name</label>
                <input 
                    type="text" 
                    required placeholder="Ex: Mohith"
                    onChange={(e) => setName(e.target.value)}
                    className={styles.formInput}
                    autoComplete="handle"
                  />
                <label>Enter codeforces handle name</label>
                <input 
                  type="text" 
                  required placeholder="Ex: not_mohith" 
                  onChange={(e) => setHandle(e.target.value)}
                  className={styles.formInput}
                  autoComplete="name"
                />
                <button type="submit" className={styles.submitButton} >Add Student</button>
            </form>
          </div>
        </div>
        <Footer/>
      </>
  )
}

export default AddStudent;