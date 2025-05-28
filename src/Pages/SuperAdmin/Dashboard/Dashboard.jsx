
const stats = [
    { label: "Total Users", value: 1200 },
    { label: "Active Schools", value: 35 },
    { label: "Pending Requests", value: 8 },
    { label: "System Uptime (days)", value: 99 },
];

const Dashboard = () => {
    return (
        <div style={{ padding: 32, fontFamily: "sans-serif" }}>
            <h1>Hemis Super Admin Dashboard</h1>
            <div style={{ display: "flex", gap: 24, marginTop: 32 }}>
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            background: "#f4f6fa",
                            borderRadius: 8,
                            padding: 24,
                            minWidth: 180,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            textAlign: "center",
                        }}
                    >
                        <div style={{ fontSize: 32, fontWeight: "bold", color: "#1976d2" }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 16, color: "#555" }}>{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
