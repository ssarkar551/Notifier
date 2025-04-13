import axios from "axios";
import { useState, useEffect } from "react";

export default function Notifications() {
  //const [notifications, setNotifications] = useState([]);
  const [longNotification, setLongNotification] = useState();

  //   useEffect(() => {
  //     const fetchNotifications = async () => {
  //       try {
  //         const response = await axios.get("http://localhost:3000/notifications/shortpolling");
  //         setNotifications((prev) => [...prev, response.data]);
  //       } catch (err) {
  //         console.error("Error in fetching notifications: ", err);
  //       }
  //     };
  //     fetchNotifications();
  //     const interval = setInterval(fetchNotifications, 10000);

  //     return () => clearInterval(interval);
  //   }, []);

  useEffect(() => {
    console.log("inside useffect");

    const getNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/notifications");
        console.log("response: ", response);
        setLongNotification(response.data);
      } catch (err) {
        console.log("Error in fetching long polling notifications: ", err);
        setTimeout(getNotifications, 5000);
      }
    };

    getNotifications();
  }, []);

  console.log("notifications: ", longNotification);
  return (
    <div>
      <h1>Notifications</h1>
      {/* <h2>Short Polling</h2>
      <ul>
        {Array.isArray(notifications) &&
          notifications.map((notif, index) => (
            <li key={index}>
              {notif.message} - {notif.timestamp}
            </li>
          ))}
      </ul> */}

      <h2>Long Polling</h2>
      {longNotification ? (
        <p>{longNotification.message}</p>
      ) : (
        <p>Loading notification...</p>
      )}
    </div>
  );
}
