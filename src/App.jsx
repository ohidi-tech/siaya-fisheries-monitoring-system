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
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: '🏠 Executive Dashboard', icon: '🏠' },
    { id: 'gis', label: '🗺 GIS Monitoring', icon: '🗺' },
    { id: 'sites', label: '🐟 Fish Drying Sites', icon: '🐟' },
    { id: 'cooperatives', label: '👥 Cooperatives', icon: '👥' },
    { id: 'bmus', label: '⚓ BMUs', icon: '⚓' },
    { id: 'analytics', label: '📈 Performance Analytics', icon: '📈' },
    { id: 'inspections', label: '📋 Inspections', icon: '📋' },
    { id: 'revenue', label: '💰 Revenue Tracking', icon: '💰' },
    { id: 'reports', label: '📄 Reports', icon: '📄' },
    { id: 'settings', label: '⚙ Settings', icon: '⚙' },
  ];

  const gisSites = [
    { name: "Usenge BMU", lat: 0.47, lng: 33.96, status: "High Production", color: "#16a34a" },
    { name: "Uhanya BMU", lat: 0.35, lng: 33.98, status: "Normal", color: "#2563eb" },
    { name: "Wichlum BMU", lat: 0.28, lng: 34.15, status: "Inspection Due", color: "#ea580c" },
    { name: "Luanda Kotieno", lat: 0.15, lng: 34.32, status: "Top Performer", color: "#9333ea" },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: sidebarOpen ? '280px' : '80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px 0',
        transition: 'width 0.3s ease',
        position: 'fixed',
        height: '100vh',
        overflow: 'auto',
        zIndex: 1000,
      }}>
        <div style={{ padding: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5em', margin: '0 0 5px 0' }}>🎣</h2>
          {sidebarOpen && <p style={{ fontSize: '0.85em', margin: '5px 0 0 0' }}>Siaya Fisheries</p>}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                background: activePage === item.id ? 'rgba(255,255,255,0.25)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.95em',
                transition: 'all 0.3s ease',
                borderLeft: activePage === item.id ? '4px solid white' : '4px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              title={!sidebarOpen ? item.label : ''}
            >
              <span style={{ fontSize: '1.2em', minWidth: '25px', textAlign: 'center' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label.split(' ').slice(1).join(' ')}</span>}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            padding: '15px',
            cursor: 'pointer',
            margin: '20px',
            borderRadius: '8px',
            width: 'calc(100% - 40px)',
            fontSize: '1em',
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: sidebarOpen ? '280px' : '80px',
        flex: 1,
        padding: '30px',
        transition: 'margin-left 0.3s ease',
        overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', marginBottom: '2px', fontSize: '0.95em', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Siaya County Government</p>
          <p style={{ color: '#0f172a', marginBottom: '8px', fontSize: '0.9em', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department of Fisheries</p>
          <h1 style={{ color: '#0f172a', marginBottom: '0', fontSize: '1.8em', fontWeight: '700' }}>Fish Drying Cooperative Monitoring System</h1>
        </div>

        {/* Dashboard Page */}
        {activePage === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '15px', marginBottom: '30px' }}>
              <Card title="Registered Cooperatives" value="28" color="#2563eb" />
              <Card title="Active BMUs" value="17" color="#16a34a" />
              <Card title="Fish Processed" value="12.4 Tons" color="#ea580c" />
              <Card title="Production Value" value="KES 7.9M" color="#9333ea" />
              <Card title="Women Beneficiaries" value="1,246" color="#16a34a" />
              <Card title="Youth Beneficiaries" value="892" color="#2563eb" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(350px,1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3>Top Performing Cooperatives</h3>
                <ul style={{ marginTop: '15px' }}>
                  <li>🥇 Usenge Fish Processors Cooperative</li>
                  <li>🥈 Uhanya Women Fish Dryers Cooperative</li>
                  <li>🥉 Bondo Fisheries Cooperative</li>
                  <li>🏅 Rarieda Fish Traders Cooperative</li>
                </ul>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3>County Alerts</h3>
                <ul style={{ marginTop: '15px' }}>
                  <li style={{ color: '#ea580c' }}>⚠ Wichlum BMU inspection overdue</li>
                  <li style={{ color: '#16a34a' }}>✓ Luanda Kotieno exceeded target</li>
                  <li style={{ color: '#2563eb' }}>✓ 91% GPS verification coverage</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* GIS Monitoring Page */}
        {activePage === 'gis' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>GIS Monitoring Map</h2>
            <div style={{ height: '500px', borderRadius: '12px', overflow: 'hidden', marginTop: '15px' }}>
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
          </div>
        )}

        {/* Fish Drying Sites Page */}
        {activePage === 'sites' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>🐟 Fish Drying Sites</h2>
            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #e0e0e0' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Site Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Capacity</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Usenge Fish Drying Facility', location: 'Siaya Town', capacity: '50 tons/month', status: 'Operational' },
                  { name: 'Uhanya Drying Yard', location: 'Kanyoza', capacity: '35 tons/month', status: 'Operational' },
                  { name: 'Wichlum Processing Center', location: 'Kisumu Road', capacity: '60 tons/month', status: 'Maintenance' },
                  { name: 'Luanda Kotieno Facility', location: 'Yala', capacity: '45 tons/month', status: 'Operational' },
                ].map((site, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '12px' }}><strong>{site.name}</strong></td>
                    <td style={{ padding: '12px' }}>{site.location}</td>
                    <td style={{ padding: '12px' }}>{site.capacity}</td>
                    <td style={{ padding: '12px' }}><span style={{ background: site.status === 'Operational' ? '#c6f6d5' : '#feebc8', padding: '4px 8px', borderRadius: '4px' }}>{site.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cooperatives Page */}
        {activePage === 'cooperatives' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>👥 Cooperatives Directory</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px', marginTop: '15px' }}>
              {['Usenge Fish Processors', 'Uhanya Women Fish Dryers', 'Bondo Fisheries', 'Rarieda Fish Traders'].map((coop, idx) => (
                <div key={idx} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2563eb' }}>
                  <h4 style={{ marginTop: '0' }}>{coop} Cooperative</h4>
                  <p style={{ marginBottom: '8px' }}><strong>Members:</strong> {45 + idx * 10}</p>
                  <p style={{ marginBottom: '8px' }}><strong>Production:</strong> {200 + idx * 30} tons/month</p>
                  <p style={{ marginBottom: '0' }}><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Active</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BMUs Page */}
        {activePage === 'bmus' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>⚓ Beach Management Units (BMUs)</h2>
            <div style={{ marginTop: '15px' }}>
              {gisSites.map((bmu, idx) => (
                <div key={idx} style={{ background: '#f8f9fa', padding: '15px', marginBottom: '10px', borderRadius: '8px', borderLeft: `4px solid ${bmu.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ marginTop: '0' }}>{bmu.name}</h4>
                      <p style={{ marginBottom: '0', color: '#666' }}>Coordinates: {bmu.lat.toFixed(2)}°, {bmu.lng.toFixed(2)}°</p>
                    </div>
                    <span style={{ background: bmu.color, color: 'white', padding: '8px 12px', borderRadius: '6px' }}>{bmu.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Analytics Page */}
        {activePage === 'analytics' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>📈 Performance Analytics</h2>
            <div style={{ marginTop: '20px', padding: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.2em', margin: '0' }}>📊 Advanced Analytics Dashboard</p>
              <p style={{ marginTop: '10px', opacity: 0.9 }}>Performance trends, production metrics, and compliance tracking</p>
              <p style={{ marginTop: '15px', fontSize: '0.9em' }}>Data visualization features ready for integration</p>
            </div>
          </div>
        )}

        {/* Inspections Page */}
        {activePage === 'inspections' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>📋 Inspections & Compliance</h2>
            <div style={{ marginTop: '15px' }}>
              {[
                { site: 'Usenge BMU', date: '2026-08-10', inspector: 'John Doe', status: 'Passed' },
                { site: 'Uhanya BMU', date: '2026-08-08', inspector: 'Jane Smith', status: 'Passed' },
                { site: 'Wichlum BMU', date: '2026-07-25', inspector: 'Peter Omondi', status: 'Failed - Retesting' },
                { site: 'Luanda Kotieno', date: '2026-08-12', inspector: 'Mary Kipchoge', status: 'Pending' },
              ].map((inspection, idx) => (
                <div key={idx} style={{ background: '#f8f9fa', padding: '15px', marginBottom: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ marginTop: '0', marginBottom: '5px' }}>{inspection.site}</h4>
                    <p style={{ marginBottom: '0', color: '#666', fontSize: '0.9em' }}>Inspector: {inspection.inspector} | Date: {inspection.date}</p>
                  </div>
                  <span style={{ background: inspection.status.includes('Passed') ? '#c6f6d5' : inspection.status.includes('Failed') ? '#fecaca' : '#feebc8', color: inspection.status.includes('Passed') ? '#166534' : '#7c2d12', padding: '8px 12px', borderRadius: '6px' }}>
                    {inspection.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Tracking Page */}
        {activePage === 'revenue' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>💰 Revenue Tracking</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '15px', marginTop: '15px' }}>
              <Card title="Total Monthly Revenue" value="KES 7.9M" color="#059669" />
              <Card title="This Month (Aug)" value="KES 2.1M" color="#2563eb" />
              <Card title="Last Month (Jul)" value="KES 1.8M" color="#ea580c" />
              <Card title="Avg Per Cooperative" value="KES 282K" color="#9333ea" />
            </div>
            <div style={{ marginTop: '30px', padding: '20px', background: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #059669' }}>
              <h4 style={{ marginTop: '0' }}>Revenue Distribution</h4>
              <p style={{ marginBottom: '8px' }}>Usenge BMU: 28% (KES 2.2M)</p>
              <p style={{ marginBottom: '8px' }}>Uhanya BMU: 22% (KES 1.7M)</p>
              <p style={{ marginBottom: '8px' }}>Wichlum BMU: 31% (KES 2.4M)</p>
              <p style={{ marginBottom: '0' }}>Luanda Kotieno: 19% (KES 1.5M)</p>
            </div>
          </div>
        )}

        {/* Reports Page */}
        {activePage === 'reports' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>📄 Reports & Documents</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px', marginTop: '15px' }}>
              {[
                { title: 'Monthly Report', date: 'August 2026', icon: '📋' },
                { title: 'Production Analysis', date: 'August 2026', icon: '📊' },
                { title: 'Financial Summary', date: 'August 2026', icon: '💼' },
                { title: 'Quality Assessment', date: 'August 2026', icon: '✓' },
                { title: 'Compliance Status', date: 'August 2026', icon: '📋' },
                { title: 'Annual Report', date: 'July 2026', icon: '📈' },
              ].map((report, idx) => (
                <div key={idx} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s', border: '1px solid #e0e0e0' }}>
                  <p style={{ fontSize: '2em', margin: '0 0 10px 0' }}>{report.icon}</p>
                  <h4 style={{ marginTop: '0', marginBottom: '5px' }}>{report.title}</h4>
                  <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.9em' }}>{report.date}</p>
                  <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9em' }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Page */}
        {activePage === 'settings' && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>⚙ Settings</h2>
            <div style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
                <h3>System Settings</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                  <span>Enable GPS Monitoring</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                  <span>Email Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
                  <span>Mobile Alerts</span>
                </label>
              </div>

              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
                <h3>User Management</h3>
                <p>Current User: Fisheries Monitoring Officer</p>
                <p>Email: officer@siaya.gov.ke</p>
                <button style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>Change Password</button>
              </div>

              <div>
                <h3>About</h3>
                <p>Siaya Fisheries Monitoring System v1.0</p>
                <p>© 2026 Siaya County Government</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h4 style={{ color: '#666', margin: '0 0 10px 0' }}>{title}</h4>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color, margin: '10px 0 0 0' }}>
        {value}
      </div>
    </div>
  );
}