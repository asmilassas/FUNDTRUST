import { useEffect, useState } from "react";
import api from "../services/api";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/users/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1>Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        notifications
          .slice()
          .reverse()
          .map((note, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                marginBottom: "15px",
                border: "1px solid #ddd",
                borderRadius: "6px"
              }}
            >
              <p>{note.message}</p>
              <small>
                {new Date(note.createdAt).toLocaleString()}
              </small>
            </div>
          ))
      )}
    </div>
  );
}

export default NotificationsPage;