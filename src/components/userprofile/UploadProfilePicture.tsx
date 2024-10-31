import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import './UploadProfilePicture.css';

function UploadProfilePicture() {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("Ingen fil vald");
    const [statusMessage, setStatusMessage] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setStatusMessage("");
        } else {
            setFileName("Ingen fil vald");
        }
    };

    const handleUpload = async () => {
        const token = localStorage.getItem("token") || "";
        const decodedToken = jwtDecode<{ sub: string }>(token);
        const loggedInUser = decodedToken.sub;

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        }

        try {
            const response = await fetch(`https://shark-app-j7qxa.ondigitalocean.app/profile-image/${loggedInUser}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Fel vid uppladdning av profilbild");
            }

            const result = await response.text();
            console.log(result);
            setStatusMessage("Profilbild har laddats upp");
        } catch (error) {
            console.error("Fel vid uppladdning: ", error);
            setStatusMessage("Fel vid uppladdning av profilbild.");
        }
    };

    return (
        <div>
            <input
                id="file-input"
                className="inputForm-profilepicture"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="custom-file-button">Välj en profilbild</label>
            <span>{fileName}</span>
            <button className="button-alwaysshow-profilepicture" onClick={handleUpload}>Ladda upp profilbild</button>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
}

export default UploadProfilePicture;