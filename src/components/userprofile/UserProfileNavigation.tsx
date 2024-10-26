import React from "react";

interface Props {
    setCurrentSection: (section: string) => void;
    currentSection: string;
}

const UserProfileNavigation: React.FC<Props> = ({ setCurrentSection, currentSection }) => {
    return (
        <div className="user-profile-navigation">
            <button
                className={`b ${currentSection === "playlists" ? "active" : ""}`}
                onClick={() => setCurrentSection("playlists")}
                style={{ marginRight: "33px" }}
            >
                Dina spellistor
            </button>
            <button
                className={`b ${currentSection === "information" ? "active" : ""}`}
                onClick={() => setCurrentSection("information")}
                style={{ marginRight: "33px" }}
            >
                Information
            </button>
            <button
                className={`b ${currentSection === "settings" ? "active" : ""}`}
                onClick={() => setCurrentSection("settings")}
            >
                Inställningar
            </button>
        </div>
    );
};

export default UserProfileNavigation;