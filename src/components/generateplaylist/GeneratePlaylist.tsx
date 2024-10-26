import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import PrompInterface from "../../interfaces/PromptInterface";
import './GeneratePlaylist.css';

function GeneratePlaylist() {
    const [newPrompt, setNewPrompt] = useState<PrompInterface>({ 
        playlistName: "",
        prompt: ""
     });

    const [playlistLink, setPlaylistLink] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const token = localStorage.getItem("token") || "";
    const decodedToken = jwtDecode<{ sub: string }>(token);
    const loggedInUser = decodedToken.sub;

    const sendPrompt = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setPlaylistLink(null);
        setErrorMessage(null); 

        fetch(`https://shark-app-j7qxa.ondigitalocean.app/aichat/${loggedInUser}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                playlistName: newPrompt.playlistName,
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

            setNewPrompt({ 
                playlistName: "",
                prompt: "" 
            });
        })
        .catch((error) => {
            console.error("Fel vid sparande av spellista:", error);
            setErrorMessage("Det verkar som att du inte har loggat in på Spotify");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div>
            <form onSubmit={sendPrompt}>
                <h1 className="main-text-playlist">Använd AI-teknik för att skapa din perfekta spellista</h1>
                <br />
            <input className="inputForm"
                type="text"
                maxLength={50}
                required
                style={{
                    width: "296px",
                    height: "20px",
                    resize: "none",
                    overflow: "hidden",
                    borderRadius: "3px",
                }}
                value={newPrompt.playlistName}
                onChange={(e) =>
                setNewPrompt({ ...newPrompt, playlistName: e.target.value })
                }
                
                
            ></input>
           <p className="playlist-name" 
                style={{ 
                    marginTop: "8px", 
                    marginBottom: "40px"
                }}>
                    Ange ett namn för den önskade spellistan
                </p>
            
                <textarea
                    className="inputForm textarea"
                    maxLength={140}
                    required
                    style={{
                        width: "296px",
                        height: "56px",
                        resize: "none",
                        overflow: "hidden",
                        borderRadius: "3px"

                    }}
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
                />

                <div className="small-text-playlist">
                    <p>Exempel på prompt: Skapa en spellista med 20 låtar som liknar Free Bird av Lynyrd Skynyrd</p>
                </div>
                
                <button className="button-alwaysshow-playlist" type="submit" disabled={loading}>
                {loading ? (
                    <div className="spinner"></div>
                ) : (
                    "Skapa Spellista"
                )}
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