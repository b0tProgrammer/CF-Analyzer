import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Footer from "../Footer/Footer";
import styles from "./RecentContests.module.css";
import FadeLoader from "react-spinners/FadeLoader";
function RecentContest() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <p>Please login as mentor to access this feature</p>;
  }

  const decodedToken = jwtDecode(token);
  const userName = decodedToken.sub;

  const [students, setStudents] = useState([]);
  const [contestId, setContestId] = useState();
  const [contestName, setContestName] = useState("");
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) {
      setLoading(true);
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
            handles: data.handles || [],
          };
          setStudents(newAdmin.handles);
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
      fetchAdmin();
      setStep(1);
    }
  }, [token]);

  useEffect(() => {
    if (step === 1) {
      async function recentContest() {
        try {
          const response = await fetch(
            `https://codeforces.com/api/contest.list?gym=false`
          );
          if (!response.ok) throw new Error("Failed to fetch contest id");
          const data = await response.json();
          const arr = data.result;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].phase === "FINISHED") {
              setContestId(arr[i].id);
              setContestName(arr[i].name);
              break;
            }
          }
        } catch (error) {
          console.error("Error fetching contest id:", error);
        }
      }
      recentContest();
      setStep(2);
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      async function fetchRatingsAndRanks() {
        if (!contestId || students.length === 0) {
          setRanks([]);
          return;
        }
        try {
          const response = await fetch(
            `https://codeforces.com/api/contest.ratingChanges?contestId=${contestId}`
          );
          if (!response.ok) throw new Error("Failed to fetch rating changes");
          const data = await response.json();
          const ratingMap = {};
          data.result.forEach((entry) => {
            ratingMap[entry.handle.toLowerCase()] = entry;
          });
          const rankList = students.map((student) => {
            const handle = student.split("*")[1].toLowerCase();
            const info = ratingMap[handle];
            return {
              name: student.split("*")[0],
              handle: handle,
              rank: info?.rank ?? null,
              oldRating: info?.oldRating ?? null,
              newRating: info?.newRating ?? null,
              ratingChange:
                info?.oldRating != null && info?.newRating != null
                  ? info.newRating - info.oldRating
                  : null,
            };
          });
          rankList.sort((a, b) => {
            if (a.rank && b.rank) return a.rank - b.rank;
            if (a.rank) return -1;
            if (b.rank) return 1;
            return a.name.localeCompare(b.name);
          });
          setRanks(rankList);
        } catch (error) {
          console.error("Error fetching rating changes:", error);
          setRanks([]);
        }
      }
      fetchRatingsAndRanks();
      setStep(3);
    }
  }, [contestId, students, step]);

  useEffect(() => {
    if(step === 3 && students.length > 0) {
      setLoading(false);
    }
  }, [step])

  return (
    <>
      <div
        className="recent-contest"
        style={{
          maxWidth: 600,
          margin: "2rem auto",
          background: "rgba(30,30,30,0.95)",
          borderRadius: "1rem",
          padding: "2rem",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Recent Contest Standings</h2>
        {contestName && (
          <h3 style={{ textAlign: "center", marginBottom: "2rem" }}>
            {contestName}
          </h3>
        )}
        {loading ? (
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
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #444" }}>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Handle</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>Rank</th>
                <th style={{ padding: "0.5rem", textAlign: "left" }}>
                  Rating Change
                </th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((student, idx) => (
                <tr
                  key={student.handle}
                  style={{ background: idx % 2 ? "#1c1c1c" : "#121212" }}
                >
                  <td style={{ padding: "0.5rem" }}>{student.name}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <a
                      href={`https://codeforces.com/profile/${student.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#58a6ff", textDecoration: "none" }}
                    >
                      {student.handle}
                    </a>
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {student.rank ? (
                      <span style={{ color: "#22d3ee", fontWeight: 600 }}>
                        {student.rank}
                      </span>
                    ) : (
                      <span style={{ color: "#dc2626", fontWeight: 600 }}>
                        Not Attempted
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {student.ratingChange != null ? (
                      <span
                        style={{
                          color:
                            student.ratingChange >= 0 ? "#3fb950" : "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        {student.ratingChange >= 0 ? "+" : ""}
                        {student.ratingChange}
                      </span>
                    ) : (
                      <span style={{ color: "#888" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && ranks.length === 0 && (
          <p style={{ textAlign: "center" }}>
            No students or no contest data available.
          </p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default RecentContest;
