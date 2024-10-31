import PlaylistInterface from "./PlaylistInterface";

interface UserProfileInterface{
    email: string;
    username: string;
    password: string;
    profileImage?: string;
    playlistsCreated: number;
    playlists: PlaylistInterface[];
    premium: boolean;
}

export default UserProfileInterface;