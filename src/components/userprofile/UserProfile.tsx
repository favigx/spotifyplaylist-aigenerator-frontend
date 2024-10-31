import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import UserProfileInterface from "../../interfaces/UserProfileInterface";
import UserProfileNavigation from "./UserProfileNavigation";
import './UserProfile.css';
import Playlist from "./PlayList";
import UploadProfilePicture from "./UploadProfilePicture";

function UserProfile() {
    const [userProfile, setUserProfile] = useState<UserProfileInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentSection, setCurrentSection] = useState<string>("playlists"); 
    const token = localStorage.getItem("token") || "";
    const decodedToken = jwtDecode<{ sub: string }>(token);
    const loggedInUser = decodedToken.sub;

    useEffect(() => {
        fetch(`https://shark-app-j7qxa.ondigitalocean.app/user/${loggedInUser}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Något gick fel vid hämtning av användardata");
                }
                return res.json();
            })
            .then((data: UserProfileInterface) => {
                setUserProfile(data);
            })
            .catch((error) => console.error("Fel:", error))
            .finally(() => setLoading(false));
    }, [loggedInUser, userProfile]);

    if (loading) {
        return <p>Laddar...</p>;
    }

    if (!userProfile) {
        return <p>Ingen användardata tillgänglig.</p>;
    }

    return (
        <>
            <h1 className="profile">Din profil</h1>
            <div>
                <UserProfileNavigation setCurrentSection={setCurrentSection} currentSection={currentSection} />
            </div>
            <div className="user-profile-container">
                <div className="user-profile-content">
                    {currentSection === "playlists" && (
                        <div className="playlist-container">
                            {userProfile.playlists.length > 0 ? (
                                <ul>
                                    <Playlist />
                                </ul>
                            ) : (
                                <p>Du har inga skapade spellistor.</p>
                            )}
                        </div>
                    )}

                    {currentSection === "settings" && (
                        <div>
                            <h2>Kontoinställningar</h2>
                            <UploadProfilePicture />
                        </div>
                    )}

                    {currentSection === "information" && (
                        <div className="center-container">
                            <div className="user-info">
                            {userProfile.profileImage && (
                                    <div>
                                        <img 
                                            src={`data:image/png;base64,${userProfile.profileImage}`} 
                                            alt="Profilbild" 
                                            className="profile-image" 
                                        />
                                    </div>
                                )}
                                <p><strong>Användarnamn<br/></strong></p>
                                <p className="pinfo">{userProfile.username}</p><br/>
                                <p><strong>Email<br/></strong></p> 
                                <p className="pinfo">{userProfile.email}</p><br/>
                                <p><strong>Spellistor skapade<br/></strong></p>
                                <p className="pinfo">{userProfile.playlistsCreated}</p><br/>
                                <p><strong>Premium<br/></strong></p>
                                <p className="pinfo">{userProfile.premium ? "Ja" : "Nej"}</p>

                               
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default UserProfile;