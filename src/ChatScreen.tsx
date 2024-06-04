import React, { useState, useEffect } from "react";
import { useSocket } from "./providers/SocketProvider";
import { useMessage } from "./store/message";
import './style/chatScreen.css'

function ChatInput() {
    const [message, setMessage] = useState("");
    const { newMessage } = useMessage();
    const socket = useSocket();

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                socket.send({ type: "chat-message", content: message });
                setMessage("");
                newMessage(message);
            }}
        >
            <input
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
            />
            <button type="submit">Send</button>
        </form>
    );
}

function Message({ children }: { children: ReactNode }) {
    return <p>{children}</p>;
}

function isChatEvent(
    event: unknown
): event is { type: "chat-message"; content: string } {
    return (
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event["type"] === "chat-message"
    );
}

function MessageList() {
    const { message: messagesApp, newMessage } = useMessage();
    const socket = useSocket();

    useEffect(() => {
        const handleMessage = (message: unknown) => {
            if (!isChatEvent(message)) {
                return;
            }

            newMessage(message.content);
        };

        return socket.onMessage(handleMessage);
    }, [socket]);

    return (
        <div>
            {messagesApp.map((message) => (
                <Message key={message.id}>{message.content}</Message>
            ))}
        </div>
    );
}

export function ChatScreen() {
    return (
        <div>
            {/* <MessageList /> <ChatInput /> */}
            <Allchats />
        </div>
    );
}

interface AllChatType {
    id: number;
    number: number;
}

function Allchats(): JSX.Element {
    const allChats: AllChatType[] = [
        { id: 1, number: 1 },
        { id: 2, number: 2 },
        { id: 3, number: 3 },
    ];

    return (
        <div className="all-chats">
            {allChats.map((chat) => (
                <button key={chat.id}>Chat n° {chat.number}</button>
            ))}
        </div>
    );
}

function ParticularChat(number) {
    const socket = useSocket();

    socket.on("conversation/" + number);

    return (
        <>
            <div></div>
        </>
    );
}

