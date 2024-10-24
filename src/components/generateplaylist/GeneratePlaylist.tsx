import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import PrompInterface from "../../interfaces/PromptInterface";

function GeneratePlaylist() {
  const [newPrompt, setNewPrompt] = useState<PrompInterface>({ prompt: "" });
  const [playlistLink, setPlaylistLink] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<{ sub: string }>(token);
  const loggedInUser = decodedToken.sub;

  const sendPrompt = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(`http://localhost:8080/aichat/${loggedInUser}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: newPrompt.prompt
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kunde inte skapa spellista");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Svar från servern:", data);
        if (data.length > 0) {
          setPlaylistLink(data[0]);
        }
        setNewPrompt({ prompt: "" });
      })
      .catch((error) => {
        console.error("Fel vid sparande av spellista:", error);
      });
  };

  return (
    <div>
      <h3>Ny spellista</h3>
      <form onSubmit={sendPrompt}>
        <label>
          Skriv vilka artister du vill ha en spellista baserad på, glöm inte att ange hur många låtar du vill att spellistan ska innehålla.
          <br />
          <textarea
            className="inputForm textarea"
            maxLength={124}
            required
            style={{ width: "212px", height: "70px" }}
            value={newPrompt.prompt}
            onChange={(e) => setNewPrompt({ prompt: e.target.value })}
          />
        </label>
        <br />
        <br />
        <button className="button" type="submit">
          Skapa Spellista
        </button>
      </form>

      {playlistLink && (
        <div>
          <br />
          <a href={playlistLink} target="_blank" rel="noopener noreferrer">
            <button className="button">Öppna Spellista</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default GeneratePlaylist;