import { useState } from "react";
import CommunityNavigation from "./CommunityNavigation";
import Country from "./Country";
import Soul from "./Soul";
import Rock from "./Rock";
import HipHop from "./HipHop";
import './Community.css';

import iconImage from './5FCFE46F-DE0A-436D-9C02-10EC1D47547C..jpg';

function Community() {
    const [currentSection, setCurrentSection] = useState<string>(""); 
  
    return (
        <>
            {currentSection === "" && (
                <>
                    <div className="main-text-communitycontainer">
                        <h1 className="main-text-community">Gå med i ett community</h1>
                        <h1 className="main-text-community">Dela spellistor</h1>
                        <h1 className="main-text-community">Diskutera</h1>
                    </div>
                    
                    <CommunityNavigation setCurrentSection={setCurrentSection} currentSection={currentSection}/>

                    <div className="icon-container">
                        <img 
                            src={iconImage} 
                            alt="Description of icon" 
                            className="iconcommunity" 
                        />
                    </div>
                </>
            )}
            
            <div className="user-profile-container">
                <div className="user-profile-content">
                    {currentSection === "country" && <Country />}
                    {currentSection === "rock" && <Rock />}
                    {currentSection === "soul" && <Soul />}
                    {currentSection === "hiphop" && <HipHop />}
                </div>
            </div>
        </>
    );
}

export default Community;