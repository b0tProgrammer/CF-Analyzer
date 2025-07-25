import { jwtDecode } from "jwt-decode";
import { useState, useEffect, use } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Students.module.css";
import FadeLoader from "react-spinners/FadeLoader";

function Students() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div>
        <h2>Please Sign In to view student profiles</h2>
      </div>
    );
  }
  const decodedToken = jwtDecode(token);
  const userName = decodedToken.sub;
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [admin, setAdmin] = useState({});
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

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
          setStudents(newAdmin.handles);
          setAdmin(newAdmin);
          setAdmin(data);
          if(userName !== data.userName) setRole("USER"); 
          else setRole("ADMIN");
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
      fetchAdmin();
      setStep(3);
    }
  }, [userName]);

  useEffect(() => {
    if (step === 3) {
      const m = (role) => {
        switch(role) {
          case "ADMIN" : 
            return <p>Add students to view details</p>
          case "USER" :
            return <p>No student data to show</p>
          default : 
            return <p>Please Log in / sign in to view the details</p>
        }
      }
      setMessage(m(role));
      async function fetchStandings() {
        if (!students.length) {
          setStandings([]);
          return;
        }
        setLoading(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = Math.floor(today.getTime() / 1000);
        const results = await Promise.all(
          students.map(async (student) => {
            const details = student.split('*');
            const handle = details[1];
            const name = details[0];
            if (!details) return null;
            try {
              const resp = await fetch(
                `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=1000`
              );
              if (!resp.ok)
                return {
                  handle : handle || "TBU",
                  score: 0,
                  solved: 0,
                  name: name || "TBU",
                };
              const data = await resp.json();
              const solvedSet = new Set();
              let score = 0;
              let solved = 0;
              data.result.forEach((sub) => {
                if (
                  sub.verdict === "OK" &&
                  sub.creationTimeSeconds >= todayTimestamp
                ) {
                  const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
                  if (!solvedSet.has(problemKey)) {
                    solvedSet.add(problemKey);
                    solved += 1;
                    score += sub.problem.rating ? sub.problem.rating : 800;
                  }
                }
              });
              return { handle : handle, score, solved, name: name};
            } catch {
              return {
                handle : handle || "TBU",
                score: 0,
                solved: 0,
                name: name || "TBU",
              };
            }
          })
        );
        const filtered = results
          .filter(Boolean)
          .sort((a, b) => b.score - a.score);
        setStandings(filtered);
        setLoading(false);
      }
      fetchStandings();
      setStep(4);
    }
  },[admin]);

  const handleDelete = async (name) => {
    const data = {
      userName : admin.userName
    }
    try {
      const response = await fetch(`http://localhost:8080/${name}/delete`, {
          method: "DELETE",
          headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(data),
      });
      if(response.ok) {
        console.log("Successfully deleted");
        window.location.reload();
      }
    } catch(er) {
      console.error(er);
    }
  };

  return (
    <>
      {userName === "Enter" ? (
        <div>
          <h2>Please Sign In to view student profiles</h2>
        </div>
      ) : (
        <>
          <div className={styles.container}>
            <div className={styles.search}>
              <input
                type="text"
                id="queryName"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by handle"
                className={styles.formInput}
              />
            </div>
            <div className={styles.recent} >
              <span className={styles.stats} onClick={() => navigate("/stats")}>
                recent contest standings
              </span>
            </div>
            <div className={styles.but}>
              {role === "ADMIN" ? (
                <button
                  onClick={() => navigate("/addStudent")}
                  className={styles.addButton}
                >
                  Add student?
                </button>
              ) : (
                <button
                  onClick={() => navigate("/changeAdmin")}
                  className={styles.addButton}
                >
                  Change Admin?
                </button>
              )}
            </div>
          </div>
          <h3 style={{ marginTop: "2rem", textAlign : "center"}}>Today's Standings</h3>
            {
              loading && (
                <div className={styles.loaderOverlay}>
                  <FadeLoader
                    color={"#ccccccff"}
                    loading={loading}
                    height={15}
                    width={5}
                    radius={2}
                    margin={2}
                  />
                </div>
              )
            }
            { 
              students.length > 0 ? 
              <ul className={styles.listContainer}>
                {standings.map((student) => (
                  <li key={student.handle} className={styles.listItem}>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>{student.name}</div>
                      <Link to={`https://codeforces.com/profile/${student.handle}`} className={styles.studentHandle} >{student.handle}</Link>
                      <div className={styles.studentStats}>
                        <span>
                          Solved:{" "}
                          {student.solved > 0 ? (
                            <strong className={styles.statValue}>{student.solved}</strong>
                          ) : (
                            <span className={styles.statZero}>0</span>
                          )}
                        </span>
                        <span className={styles.statLabel}>
                          Score:{" "}
                          <strong className={styles.statValue}>
                            {student.solved > 0 ? student.score : "-"}
                          </strong>
                        </span>
                      </div>
                    </div>
                    {role === "ADMIN" && (
                      <div className={styles.actionArea}>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleDelete(student.name)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul> : 
                <div className={styles.matter}>
                  {message}
                </div>
            }
        </>
      )}
    </>
  );
}

export default Students;
