import { useState, useEffect } from "react";
export default function Events() {
    const [notifications, setNotifications] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // useEffect(() =>{
    //     const socket = new WebSocket('ws://localhost:3000/ws');
    //     socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);

    //         if(data.type === 'notification'){
    //             setNotifications(prev => [...prev, data])
    //         }

    //         return() => {
    //             socket.close()
    //         }
    //     }
    // }, []);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/events');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setAlerts(prev => [...prev, data])
        };

        eventSource.onerror = (err) => {
            console.error('Error in eventstream: ', err);
            eventSource.close()
        }

        return () => {
            eventSource.close();
        }
    }, []);
    
    return (
        <div>
            <h1>Events</h1>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notif, idx) => (
                    <li key={idx}>{notif.message} <small>{new Date(notif.timestamp).toLocaleDateString()}</small></li>
                ))}
            </ul>
            <ul>
                {alerts.map((alert, idx) => (
                    <li key={idx}>{alert.message} <small>{new Date(alert.timestamp).toLocaleTimeString()}</small></li>
                ))}
            </ul>
        </div>
        
    )
}