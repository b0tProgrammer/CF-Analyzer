import { useState,useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

function changeAdmin() {

    const token = localStorage.getItem("token");
    if(!token) {
        return <p>Please login as mentor to access this feature</p>
    }

    const navigate = useNavigate();
    const [name,setName] = new useState("");
    const userName = jwtDecode(token).sub;
    const [step, setStep] = useState(0);
    const [adminName,setAdminName] = useState(""); 
    const [password,setPassword] = useState("");

    useEffect(() => {
        if (step === 0) {
            async function fetchAdmin() {
                try {
                    const response = await fetch(
                        `http://localhost:8080/${userName}/isAdmin`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    if (!response.ok) throw new Error("Failed to fetch admin data");
                    const data = await response.json();
                    setAdminName(data.userName);
                } catch (error) {
                    console.error("Error fetching admin data:", error);
                }
            }
            fetchAdmin();
            setStep(2);
        }
    }, [userName]);

    const handleSubmit = async (e) => {
      e.preventDefault();
        const data = {
            userName : userName,
            mentorName : name,
            password
        };
        try {
            const response = await fetch(`http://localhost:8080/${userName}/changeAdmin`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                console.error("Failed to change Admin");
                return;
            } else {
                alert("Changed Admin successfully");    
                setName("");
                setPassword("");
                navigate("/");
            }
        } catch(er) {
            console.error(er);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Your current Admin name : {adminName}</h2>
                <label>Enter new Admin Name</label>
                <input 
                    type="text" 
                    required placeholder="Ex: Mohith"
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="handle"
                />
                <label>Enter Your password to confirm</label>
                <input 
                    type="password" 
                    required 
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="name"
                />
                <button type="submit">Change Admin</button>
            </form>
            <Footer/>
        </>
    )
}

export default changeAdmin;