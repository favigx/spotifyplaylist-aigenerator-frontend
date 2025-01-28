import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { jwtDecode } from "jwt-decode";
import  "./Community.css"
import Playlist from "../userprofile/PlayList";
import iconImageSend from './image0.png';
import UserProfileInterface from "../../interfaces/UserProfileInterface";

interface Chat {
    id: string;
    content: string;
    sender: string;
    roomName: string;
    timestamp: string;
}

function Country() {
    const token = localStorage.getItem("token") || "";
    const decodedToken = jwtDecode<{ sub: string }>(token);
    const loggedInUser = decodedToken.sub;

    const stompClient = useRef<Client | null>(null);
    const [activeUsers, setActiveUsers] = useState<string[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const [messages, setMessages] = useState<Chat[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
    const roomName = "country";
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const chatContainerRef = useRef<HTMLUListElement | null>(null);
    const [userProfiles, setUserProfiles] = useState<Map<string, UserProfileInterface>>(new Map());

    useEffect(() => {
        const fetchUserProfiles = async () => {
            const newProfiles = new Map(userProfiles);
            const fetchPromises = activeUsers.map(async (user) => {
                if (!newProfiles.has(user)) {
                    try {
                        const response = await fetch(`https://sea-turtle-app-le797.ondigitalocean.app/user/${user}`);
                        if (response.ok) {
                            const data: UserProfileInterface = await response.json();
                            newProfiles.set(user, data);
                        }
                    } catch (error) {
                        console.error(`Error fetching profile for ${user}:`, error);
                    }
                }
            });
            await Promise.all(fetchPromises);
            setUserProfiles(newProfiles);
        };
    
        if (activeUsers.length > 0) {
            fetchUserProfiles();
        }
    }, [activeUsers]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`https://sea-turtle-app-le797.ondigitalocean.app/chat/${roomName}`);
                if (!response.ok) throw new Error("Något gick fel vid hämtning av meddelanden.");
                const data: Chat[] = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Fel vid hämtning av meddelanden:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [roomName]);

    useEffect(() => {
        const socket = new SockJS("https://sea-turtle-app-le797.ondigitalocean.app/websocket");
        stompClient.current = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                stompClient.current?.subscribe(`/topic/${roomName}`, (message) => {
                    const roomInfo = JSON.parse(message.body);
                    setActiveUsers(roomInfo.users.split(", "));
                    setUserCount(roomInfo.userCount);
                });

                stompClient.current?.subscribe(`/topic/chat/${roomName}`, (message) => {
                    const chatMessage: Chat = JSON.parse(message.body);
                    console.log("Received message:", chatMessage);
                    setMessages((prevMessages) => [...prevMessages, chatMessage]);
                });

                sendHello(loggedInUser);
            },
            onStompError: (frame) => {
                console.error("Broker reported error: ", frame.headers["message"]);
                console.error("Additional details: ", frame.body);
            },
        });

        stompClient.current.activate();

        return () => {
            sendLeave(loggedInUser);
            stompClient.current?.deactivate();
        };
    }, [loggedInUser]);

    const sendHello = (name: string) => {
        if (stompClient.current && stompClient.current.connected) {
            const message = JSON.stringify({ name });
            stompClient.current.publish({ destination: `/app/room/${roomName}`, body: message });
        } else {
            console.warn("STOMP client is not connected. Cannot send 'Hello' message.");
        }
    };

    const sendLeave = (name: string) => {
        if (stompClient.current && stompClient.current.connected) {
            const message = JSON.stringify({ name });
            stompClient.current.publish({ destination: `/app/leave/${roomName}`, body: message });
        } else {
            console.warn("STOMP client is not connected. Cannot send 'Leave' message.");
        }
    };

    const sendChatMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (stompClient.current && stompClient.current.connected && newMessage.trim()) {
            const chatMessage: Chat = {
                id: Date.now().toString(),
                content: newMessage,
                sender: loggedInUser,
                roomName: roomName,
                timestamp: new Date().toISOString(),
            };
            console.log("Sending message:", chatMessage);
            stompClient.current.publish({ destination: `/app/chat/${roomName}`, body: JSON.stringify(chatMessage) });
            setNewMessage("");
        } else {
            console.warn("STOMP client is not connected. Cannot send chat message.");
        }
    };

    const parseMessageContent = (content: string) => {
        const combinedRegex = /(https?:\/\/[^\s]+|spotify:playlist:[^\s]+)/g;

        const parts = content.split(combinedRegex);

        return parts.map((part, index) => {
            if (part) {
                if (/https?:\/\/[^\s]+/.test(part)) {
                    return (
                        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                            {part}
                        </a>
                    );
                } else if (/spotify:playlist:[^\s]+/.test(part)) {
                    return (
                        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
                            {part}
                        </a>
                    );
                }
                return <span key={index}>{part}</span>;
            }
            return null;
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedLink = e.dataTransfer.getData("text/plain");

        if (droppedLink && /spotify:playlist:[^\s]+/.test(droppedLink)) {
            setNewMessage((prev) => prev + " " + droppedLink);
        } else if (droppedLink) {
            setNewMessage((prev) => prev + " " + droppedLink);
        }
    };

    const handleScroll = () => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 1);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current && isScrolledToBottom) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isScrolledToBottom]);

    return (
        <div className="country-container">
            <div className="joined-room-container">
                <strong>
                    <p className="active-header">
                        {userCount} personer aktiva
                        <span className="status-circle"></span>
                    </p>
                </strong>
                <ul className="joined-room-list">
                    {activeUsers.map((user, index) => (
                        <li key={index}>
                            {userProfiles.has(user) && userProfiles.get(user)?.profileImage && (
                                <img
                                    src={`data:image/png;base64,${userProfiles.get(user)?.profileImage}`}
                                    alt={`${user}'s profilbild`}
                                    className="profile-image-chat-active"
                                />
                            )}
                            {user} {user === loggedInUser ? <span className="user-indicator">(du)</span> : ""}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="total-container">
                <div className="chat-container">
                    <ul className="chat-messages" ref={chatContainerRef} onScroll={handleScroll}>
                        {loading ? (
                            <li className="chat-message">Laddar meddelanden...</li>
                        ) : messages.length > 0 ? (
                            messages.map((message) => (
                                <li
                                    key={message.id}
                                    className={`chat-message ${message.sender === loggedInUser ? "my-message" : "other-message"}`}
                                >
                                    <div>
                                        {message.sender !== loggedInUser && userProfiles.has(message.sender) && userProfiles.get(message.sender)?.profileImage && (
                                            <img
                                                src={`data:image/png;base64,${userProfiles.get(message.sender)?.profileImage}`}
                                                alt={`${message.sender}'s profilbild`}
                                                className="profile-image-chat"
                                            />
                                        )}
                                    </div>
                                    <div className="message-wrapper">
                                        {message.sender !== loggedInUser && (
                                            <div className="username">{message.sender}</div>
                                        )}
                                        <div className="message-bubble">
                                            <span>{parseMessageContent(message.content)}</span>
                                           
                                                <div className="tooltip">{new Date(message.timestamp).toLocaleString()}</div>
                            
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="chat-message">Påbörja ett samtal</li>
                        )}
                        <div ref={messagesEndRef} />
                    </ul>
                </div>

                <div className="input-container">
                    <form onSubmit={sendChatMessage}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Meddelande"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        />
                        <button className="button-alwaysshow-chat" type="submit">
                            <img src={iconImageSend} className="button-icon" />
                        </button>
                        <details open={true} className="details">
                            <summary>Drag och släpp spellistor i meddelandefältet</summary>
                            <div className="playlist-scrollbox">
                                <Playlist />
                            </div>
                        </details>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Country;