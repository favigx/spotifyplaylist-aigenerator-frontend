interface Props {
    setPage: (page: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    currentPage: string;
}

function Navigation({ setPage, isLoggedIn, setIsLoggedIn, currentPage }: Props) {
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setPage("login");
    };

    return (
        <div className="header">
            {!isLoggedIn ? (
               <>
                    <div className="headerlogin">
                    <button
                    className={`button ${currentPage === "register" ? "active" : ""}`}
                    onClick={() => setPage("register")}
                    style={{ marginRight: "33px" }}
                    >
                    Registrera dig
                    </button>
                    <button
                    className={`button ${currentPage === "login" ? "active" : ""}`}
                    onClick={() => setPage("login")}
                    >
                    Logga in
                    </button>
                </div>
            </>
            ) : (
                <>
                    <button
                    className={`button ${currentPage === "generateplaylist" ? "active" : ""}`}
                    onClick={() => setPage("generateplaylist")}
                    style={{ marginRight: '33px' }}>
                    Skapa spellista
                    </button>
                    <button
                    className={`button ${currentPage === "stripepaymentlink" ? "active" : ""}`}
                    onClick={() => setPage("stripepaymentlink")}
                    style={{ marginRight: '33px' }}>
                    Köp premium
                    </button>
                    <button
                    className={`button ${currentPage === "spotifylogin" ? "active" : ""}`}
                    onClick={() => setPage("spotifylogin")}
                    style={{ marginRight: '33px' }}>
                    Spotify
                    </button>
                    <button 
                    className="button" 
                    onClick={handleLogout} 
                    >
                    Logga ut
                    </button>
                </>
            )}
        </div>
    );
}

export default Navigation;