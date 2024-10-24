interface Props {
    setPage: (page: string) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
}

function Navigation({ setPage, isLoggedIn, setIsLoggedIn }: Props) {
    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setPage("login");
    };

    return (
        <div className="header">
            {!isLoggedIn ? (
                <>
                    <button className="button" onClick={() => setPage("register")}>
                        Registrera dig
                    </button>
                    <button className="button" onClick={() => setPage("login")}>
                        Logga in
                    </button>
                </>
            ) : (
                <>
                    <button className="button" onClick={handleLogout}>
                        Logga ut
                    </button>
                    <button className="button" onClick={() => setPage("generateplaylist")}>
                        Skapa spellista
                    </button>
                </>
            )}
        </div>
    );
}

export default Navigation;