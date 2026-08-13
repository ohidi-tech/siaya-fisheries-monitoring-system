import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icons
const createMarkerIcon = (color) => {
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export default function App() {
  const [mapView, setMapView] = useState('mockup');

  const gisSites = [
    { name: "Usenge BMU", lat: 0.47, lng: 33.96, status: "High Production", color: "#16a34a" },
    { name: "Uhanya BMU", lat: 0.35, lng: 33.98, status: "Normal", color: "#2563eb" },
    { name: "Wichlum BMU", lat: 0.28, lng: 34.15, status: "Inspection Due", color: "#ea580c" },
    { name: "Luanda Kotieno", lat: 0.15, lng: 34.32, status: "Top Performer", color: "#9333ea" },
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2>GIS Monitoring Map</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setMapView('interactive')}
              style={{
                padding: '8px 16px',
                background: mapView === 'interactive' ? '#2563eb' : '#e2e8f0',
                color: mapView === 'interactive' ? 'white' : '#0f172a',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Interactive Map
            </button>
            <button
              onClick={() => setMapView('mockup')}
              style={{
                padding: '8px 16px',
                background: mapView === 'mockup' ? '#2563eb' : '#e2e8f0',
                color: mapView === 'mockup' ? 'white' : '#0f172a',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Mockup View
            </button>
          </div>
        </div>

        {mapView === 'interactive' ? (
          <div style={{ height: '420px', borderRadius: '16px', overflow: 'hidden', marginTop: '10px' }}>
            <MapContainer center={[0.35, 34.1]} zoom={8} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {gisSites.map((site, index) => (
                <Marker
                  key={index}
                  position={[site.lat, site.lng]}
                  icon={createMarkerIcon(site.color)}
                >
                  <Popup>
                    <div>
                      <strong>{site.name}</strong>
                      <br />
                      Status: {site.status}
                      <br />
                      <small>Coordinates: {site.lat.toFixed(2)}, {site.lng.toFixed(2)}</small>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
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

            {gisSites.map((site, index) => {
              const xPositions = ["20%", "38%", "55%", "72%"];
              const yPositions = ["35%", "52%", "42%", "60%"];
              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: xPositions[index],
                    top: yPositions[index],
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      background: site.color,
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
              );
            })}

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
              <div>🟢 High Production</div>
              <div>🔵 Normal</div>
              <div>🟠 Inspection Required</div>
              <div>🟣 Top Performer</div>
            </div>
          </div>
        )}
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