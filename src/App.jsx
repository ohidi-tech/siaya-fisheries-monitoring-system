export default function App() {
  const gisSites = [
    { name: "Usenge BMU", x: "20%", y: "35%", status: "High Production" },
    { name: "Uhanya BMU", x: "38%", y: "52%", status: "Normal" },
    { name: "Wichlum BMU", x: "55%", y: "42%", status: "Inspection Due" },
    { name: "Luanda Kotieno", x: "72%", y: "60%", status: "Top Performer" },
  ];

  return (
    <div
      style={{
        padding: "20px",
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ color: "#0f172a" }}>
            Fish-Drying Cooperative Monitoring System
          </h1>
          <p style={{ color: "#64748b" }}>
            County Fisheries Monitoring Dashboard • Siaya County Government
          </p>
        </div>

        <button
          style={{
            background: "#059669",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Export Dashboard
        </button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <Card title="Registered Cooperatives" value="28" color="#2563eb" />
        <Card title="Active BMUs" value="17" color="#16a34a" />
        <Card title="Fish Processed" value="12.4 Tons" color="#ea580c" />
        <Card title="Production Value" value="KES 7.9M" color="#9333ea" />
      </div>

      {/* GIS Map */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "18px",
          marginBottom: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>GIS Monitoring Map (Mockup)</h2>

        <div
          style={{
            height: "420px",
            position: "relative",
            borderRadius: "16px",
            background:
              "linear-gradient(to bottom right,#bfdbfe,#dcfce7,#a5f3fc)",
            overflow: "hidden",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "5%",
              top: "10%",
              background: "#bbf7d0",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            Lake Victoria Shoreline
          </div>

          {gisSites.map((site, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: site.x,
                top: site.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  background: "red",
                  borderRadius: "50%",
                  border: "3px solid white",
                }}
              />

              <div
                style={{
                  background: "white",
                  padding: "8px",
                  borderRadius: "8px",
                  marginTop: "5px",
                  fontSize: "12px",
                  minWidth: "120px",
                }}
              >
                <strong>{site.name}</strong>
                <br />
                {site.status}
              </div>
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              background: "white",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>Legend</strong>
            <div>🔴 BMU Monitoring Site</div>
            <div>🟢 High Production Zone</div>
            <div>🟡 Inspection Required</div>
          </div>
        </div>
      </div>

      {/* Beneficiaries */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <Card title="Women Beneficiaries" value="1,246" color="#16a34a" />
        <Card title="Youth Beneficiaries" value="892" color="#2563eb" />
        <Card title="Quality Compliance" value="94%" color="#9333ea" />
      </div>

      {/* Tables */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "18px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Top Performing Cooperatives</h2>

          <ul>
            <li>🥇 Usenge Fish Processors Cooperative</li>
            <li>🥈 Uhanya Women Fish Dryers Cooperative</li>
            <li>🥉 Bondo Fisheries Cooperative</li>
            <li>🏅 Rarieda Fish Traders Cooperative</li>
          </ul>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "18px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>County Alerts</h2>

          <ul>
            <li style={{ color: "#ea580c" }}>
              ⚠ Wichlum BMU inspection overdue
            </li>
            <li style={{ color: "#16a34a" }}>
              ✓ Luanda Kotieno exceeded target
            </li>
            <li style={{ color: "#2563eb" }}>
              ✓ 91% GPS verification coverage
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "18px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ color: "#475569" }}>{title}</h3>
      <div
        style={{
          fontSize: "30px",
          fontWeight: "bold",
          color,
          marginTop: "10px",
        }}
      >
        {value}
      </div>
    </div>
  );
}