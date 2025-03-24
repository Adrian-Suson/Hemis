const Loading = () => {
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f4f4f4",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "5px solid #ccc",
      borderTop: "5px solid #007bff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
    </div>
  );
};

export default Loading;
