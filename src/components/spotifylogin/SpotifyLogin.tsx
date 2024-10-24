import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function SpotifyLogin() {
  const [spotifyLoginUrl, setSpotifyLoginUrl] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";
  const decodedToken = jwtDecode<{ sub: string }>(token);
  const loggedInUser = decodedToken.sub;

  useEffect(() => {
    fetch(`http://localhost:8080/spotifylogin/${loggedInUser}`)
      .then((res) => res.text()) 
      .then((url) => setSpotifyLoginUrl(url))
      .catch((error) => console.error("Error fetching Spotify login URL:", error));
  }, [loggedInUser]);

  if (!spotifyLoginUrl) {
    return <p>Laddar...</p>;
  }

  return (
    <div>
      <h3>
        För att använda den här applikationen måste du koppla ditt Spotify-konto med oss, var god tryck på knappen för att logga in på ditt Spotify
      </h3>
      <a href={spotifyLoginUrl} rel="noopener noreferrer">
        <button>Logga in med Spotify</button>
      </a>
    </div>
  );
}

export default SpotifyLogin;