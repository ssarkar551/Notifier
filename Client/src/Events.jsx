import { useState, useEffect } from "react";
export default function Events() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() =>{
        const socket = new WebSocket('ws://localhost:3000/events');
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if(data.type === 'notification'){
                setNotifications(prev => [...prev, data])
            }

            return() => {
                socket.close()
            }
        }
    }, [])
    return (
        <div>
            <h1>Events</h1>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notif, idx) => (
                    <li key={idx}>{notif.message} <small>{new Date(notif.timestamp).toLocaleDateString()}</small></li>
                ))}
            </ul>
        </div>
        
    )
}