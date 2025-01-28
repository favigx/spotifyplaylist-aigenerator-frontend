import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import './SpotifyLogin.css';

function SpotifyLogin() {
  const [spotifyLoginUrl, setSpotifyLoginUrl] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<{ sub: string }>(token);
  const loggedInUser = decodedToken.sub;

  useEffect(() => {
    fetch(`https://sea-turtle-app-le797.ondigitalocean.app/spotifylogin/${loggedInUser}`)
      .then((res) => res.text()) 
      .then((url) => setSpotifyLoginUrl(url))
      .catch((error) => console.error("Error fetching Spotify login URL:", error));
  }, [loggedInUser]);

  if (!spotifyLoginUrl) {
    return <p>Laddar...</p>;
  }

  return (
    <div>
      <div className="main-text">
      <h1>
        För att du ska kunna skapa spellistor till ditt Spotifykonto måste du logga in på Spotify
      </h1>
      </div>
      <a href={spotifyLoginUrl} rel="noopener noreferrer">
        <button className="button-alwaysshow">Logga in med Spotify</button>
      </a>
      <div className="small-text">
        <p>
          Inloggning till Spotify sker via deras egna hemsida. Den här applikationen sparar inga personliga uppgifter som är kopplat till ditt Spotifykonto.
          Den här applikationen är skapad med hjälp av Spotifys egna utvecklar-api.
        </p>

      </div>
    </div>
  );
}

export default SpotifyLogin;