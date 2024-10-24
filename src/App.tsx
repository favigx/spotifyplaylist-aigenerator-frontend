import { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Navigation from "./components/navigation/Navigation";
import SpotifyLogin from "./components/spotifylogin/SpotifyLogin";
import GeneratePlaylist from "./components/generateplaylist/GeneratePlaylist";


function App() {
  const [page, setPage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const savedState = localStorage.getItem("isLoggedIn");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    let pageUrl = page;
    if (!pageUrl) {
      const queryParameters = new URLSearchParams(window.location.search);
      const getUrl = queryParameters.get("page");
      if (getUrl) {
        pageUrl = getUrl;
        setPage(getUrl);
      } else {
        pageUrl = "login";
      }
    }
    window.history.pushState(null, "", "?page=" + pageUrl);
  }, [page]);

  return (
    <>
      <Navigation setPage={setPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> {}
      {{
        "register": <Register setPage={setPage} />,
        "login": <Login setPage={setPage} setIsLoggedIn={setIsLoggedIn} />,
        "spotifylogin": <SpotifyLogin />,
        "generateplaylist": <GeneratePlaylist />
      }[page]}
    </>
  );
}

export default App;