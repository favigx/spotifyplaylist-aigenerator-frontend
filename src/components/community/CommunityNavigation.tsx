import React from "react";

interface Props {
    setCurrentSection: (section: string) => void;
    currentSection: string;
}

const CommunityNavigation: React.FC<Props> = ({ setCurrentSection, currentSection }) => {
    return (
        <div className="community-navigation">
            <button
                className={`b ${currentSection === "country" ? "active" : ""}`}
                onClick={() => setCurrentSection("country")}
                style={{ marginRight: "33px" }}
            >
                Country
            </button>
            <button
                className={`b ${currentSection === "rock" ? "active" : ""}`}
                onClick={() => setCurrentSection("rock")}
                style={{ marginRight: "33px" }}
            >
                Rock
            </button>
            <button
                className={`b ${currentSection === "soul" ? "active" : ""}`}
                onClick={() => setCurrentSection("soul")}
                style={{ marginRight: "33px" }}
            >
                Soul
            </button>
            <button
                className={`b ${currentSection === "hiphop" ? "active" : ""}`}
                onClick={() => setCurrentSection("hiphop")}
            >
                Hip Hop
            </button>
        </div>
    );
};

export default CommunityNavigation;