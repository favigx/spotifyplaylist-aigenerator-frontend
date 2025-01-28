import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

import PlaylistInterface from "../../interfaces/PlaylistInterface";


function Playlist() {
  const [playlists, setPlaylists] = useState<PlaylistInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<{ sub: string }>(token);
  const loggedInUser = decodedToken.sub;

  useEffect(() => {
    fetch(`https://sea-turtle-app-le797.ondigitalocean.app/playlists/${loggedInUser}`)
      .then((res) => res.json())
      .then((data) => {
        setPlaylists(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Laddar spellistor...</p>;
  }

  const handleDragStart = (e: React.DragEvent, spotifyLink: string) => {
    e.dataTransfer.setData("text/plain", spotifyLink);
  };

  return (
    <div className="playlists-container">
      <div className="playlists-grid">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="playlist-card"
            draggable
            onDragStart={(e) => handleDragStart(e, `spotify:playlist:${playlist.id}`)}
          >
            <a href={`spotify:playlist:${playlist.id}`} target="_blank" rel="noopener noreferrer">
              <img src={playlist.artworkUrl} alt={`${playlist.name} artwork`} className="playlist-artwork" />
            </a>
            <h2>{playlist.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;