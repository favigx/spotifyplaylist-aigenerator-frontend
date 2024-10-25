import { useState } from "react";
import UserDetailsRegisterInterface from "../../interfaces/UserDetailsRegisterInterface";
import './Login.css';

interface Props {
  setPage: (page: string) => void;
}

function Register({ setPage }: Props) {
  const [newUser, setNewUser] = useState<UserDetailsRegisterInterface>({
    email: "",
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("http://localhost:8080/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...newUser }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Användarnamnet är upptaget, prova ett annat namn!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Användare lades till: ", data);
        setErrorMessage("");
        setSuccessMessage(
          "Du är nu registrerad! Omdirigeras till login om 3 sek..."
        );
        setTimeout(() => {
          setPage("login");
        }, 3000);
      })
      .catch((error) => {
        console.error("Fel vid tillägning: ", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <div className="background-container">
      <div className="form-container">
      <form onSubmit={registerUser}>

      <p className="credentials2">
         Email
       </p>
          <input
            className="inputForm"
            type="text"
            required
            value={newUser.email}
            onChange={(e) =>
              setNewUser({ ...newUser, email: e.target.value })
            }
          ></input>
       <p className="credentials1">
         Användarnamn
       </p>
          <input
            className="inputForm"
            type="text"
            required
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
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
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          ></input>
        <br />
        <br />
        <button className="button-alwaysshow-register" type="submit">
          Registrera ny användare
        </button>
        {errorMessage && <p style={{ fontSize: "10px" }}>{errorMessage}</p>}
        {successMessage && <p style={{ fontSize: "10px" }}>{successMessage}</p>}
      </form>
      </div>
    </div>
  );
}

export default Register;