import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import PrompInterface from "../../interfaces/PromptInterface";
import './GeneratePlaylist.css';

function GeneratePlaylist() {
    const [newPrompt, setNewPrompt] = useState<PrompInterface>({ prompt: "" });
    const [playlistLink, setPlaylistLink] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const token = localStorage.getItem("token") || "";
    const decodedToken = jwtDecode<{ sub: string }>(token);
    const loggedInUser = decodedToken.sub;

    const sendPrompt = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        fetch(`https://shark-app-j7qxa.ondigitalocean.app/${loggedInUser}`, {
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
                return response.text().then((data) => {
                    console.log("Felmeddelande från servern:", data);
                    setErrorMessage(data);
                    setPlaylistLink(null);
                    throw new Error(data);
                });
            }
            return response.text();
        })
        .then((data) => {
            console.log("Svar från servern:", data);
            const playlistCreatedRegex = /https?:\/\/[^\s]+/;
            const match = data.match(playlistCreatedRegex);

            if (match) {
                setPlaylistLink(match[0]);
                setErrorMessage(null);
            } else {
                setPlaylistLink(null);
                setErrorMessage(data);
            }

            setNewPrompt({ prompt: "" });
        })
        .catch((error) => {
            console.error("Fel vid sparande av spellista:", error);
            setErrorMessage("Det verkar som att du inte har loggat in på Spotify");
        });
    };

    return (
        <div className="main-text-playlist">
            <form onSubmit={sendPrompt}>
                <h1>Använd AI för att skapa din perfekta spellista</h1>
                <br />
                <textarea
                    className="inputForm textarea"
                    maxLength={129}
                    required
                    style={{
                        width: "296px",
                        height: "56px",
                        resize: "none",
                        overflow: "hidden"
                    }}
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt({ prompt: e.target.value })}
                />

                <div className="small-text-playlist">
                    <p>Exempel på prompt: Skapa en spellista med 20 låtar som liknar Sultans Of Swing av Dire Straits</p>
                </div>
                
                <button className="button-alwaysshow-playlist" type="submit">
                    Skapa Spellista
                </button>
            </form>
            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p> 
                </div>
            )}

            {playlistLink && (
                <div>
                    <br />
                    <button className="playlistlinkbutton">
                        <a href={playlistLink} target="_blank" rel="noopener noreferrer" className="playlistlinkbutton">
                            {playlistLink} 
                        </a>
                    </button>
                </div>
            )}
        </div>
    );
}

export default GeneratePlaylist;