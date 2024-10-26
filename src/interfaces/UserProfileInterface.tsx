import PlaylistInterface from "./PlaylistInterface";

interface UserProileInterface{
    email: string;
    username: string;
    password: string;
    playlistsCreated: number;
    playlists: PlaylistInterface[];
    premium: boolean;
}

export default UserProileInterface;