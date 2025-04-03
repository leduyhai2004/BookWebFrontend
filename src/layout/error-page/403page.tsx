import React from "react";

const Error403: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>403</h1>
      <h2 style={styles.message}>Forbidden</h2>
      <p style={styles.description}>You don’t have permission to access this page.</p>
      <a href="/" style={styles.homeLink}>Go to Homepage</a>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    fontFamily: "Arial, sans-serif",
  },
  code: {
    fontSize: "6rem",
    fontWeight: "bold",
    margin: 0,
  },
  message: {
    fontSize: "2rem",
    margin: "10px 0",
  },
  description: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  homeLink: {
    fontSize: "1rem",
    color: "#721c24",
    textDecoration: "none",
    border: "1px solid #721c24",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#f5c6cb",
    transition: "0.3s",
  },
};

export default Error403;