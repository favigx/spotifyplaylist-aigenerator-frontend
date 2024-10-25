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
                    className="button" 
                    onClick={handleLogout} 
                    style={{ marginRight: '33px' }}>
                    Logga ut
                    </button>
                    <button
                    className={`button ${currentPage === "generateplaylist" ? "active" : ""}`}
                    onClick={() => setPage("generateplaylist")}
                    style={{ marginRight: '33px' }}>
                    Skapa spellista
                    </button>
                    <button
                    className={`button ${currentPage === "stripepaymentlink" ? "active" : ""}`}
                    onClick={() => setPage("stripepaymentlink")}>
                    Köp premium
                    </button>
                </>
            )}
        </div>
    );
}

export default Navigation;