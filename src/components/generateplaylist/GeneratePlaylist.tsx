import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import PrompInterface from "../../interfaces/PromptInterface";
import './GeneratePlaylist.css';

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
                const link = data[0].match(/https?:\/\/[^\s]+/);
                if (link) {
                    setPlaylistLink(link[0]); 
                }
            }
            setNewPrompt({ prompt: "" });
        })
        .catch((error) => {
            console.error("Fel vid sparande av spellista:", error);
        });
    };
    return (
        <div className="main-text-playlist">
            <form onSubmit={sendPrompt}>
                <h1>
                    Använd AI för att skapa din perfekta spellista
                    </h1>
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
                    <p>
                        Exempel på prompt: Skapa en spellista med 20 låtar som liknar Sultans Of Swing av Dire Straits
                    </p>
                

                </div>
                
                <button className="button-alwaysshow" type="submit">
                    Skapa Spellista
                </button>
            </form>

            {playlistLink && (
                <div>
                    <br />
                    <button><a href={playlistLink} target="_blank" rel="noopener noreferrer" className="button">
                        {playlistLink}
                    </a></button>
                    
                </div>
            )}
        </div>
    );
}

export default GeneratePlaylist;