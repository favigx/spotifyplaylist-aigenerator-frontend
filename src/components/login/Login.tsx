import { useState } from "react";
import UserDetailsInterface from "../../interfaces/UserDetailsLoginInterface";
import './Login.css';

interface Props {
  setPage: (page: string) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
}

function Login({ setPage, setIsLoggedIn }: Props) {
  const [newLogin, setNewLogin] = useState<UserDetailsInterface>({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  const loginUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("https://sea-turtle-app-le797.ondigitalocean.app/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newLogin }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fel användarnamn eller lösenord, prova igen!");
        }
        return response.text();
      })
      .then((token) => {
        console.log("Mottagen JWT-token:", token);

        localStorage.setItem("token", token);

        setPage("spotifylogin");
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="background-container">
      <div className="form-container">
      <form onSubmit={loginUser}>
  
        
          <p className="credentials1">
            Användarnamn
          </p>
         
          <input
            className="inputForm"
            type="text"
            required
            value={newLogin.username}
            onChange={(e) =>
              setNewLogin({ ...newLogin, username: e.target.value })
            }
          ></input>
        
        <br />
        <br />
        
        <p className="credentials">
            Lösenord
          </p>
       
          <input
            className="inputForm"
            type="password"
            required
            value={newLogin.password}
            onChange={(e) =>
              setNewLogin({ ...newLogin, password: e.target.value })
            }
          ></input>
        
        <br />
        <br />
        
        <button className="button-alwaysshow-login" type="submit">
          Logga in
        </button>
        {errorMessage && <p style={{ fontSize: "11px" }}>{errorMessage}</p>}
      </form>
      </div>
    </div>
  );
}

export default Login;