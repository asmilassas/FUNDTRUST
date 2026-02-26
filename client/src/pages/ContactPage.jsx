import { useState } from "react";

function ContactPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    alert("Message sent successfully!");
    setMessage("");
  };

  return (
    <div style={container}>
      <h1>Contact Us</h1>

      <p>Email: support@fundtrust.com</p>
      <p>Phone: +94 77 000 0000</p>

      <h3>Send Us a Message</h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
        style={textarea}
      />

      <button style={button} onClick={handleSubmit}>
        Send Message
      </button>
    </div>
  );
}

const container = {
  padding: "60px",
  maxWidth: "900px",
  margin: "auto",
};

const textarea = {
  width: "100%",
  height: "120px",
  padding: "10px",
  marginBottom: "10px",
};

const button = {
  padding: "10px 20px",
  background: "#2c7be5",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default ContactPage;