import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

type Telemetry = {
  deviceId: string;
  timestamp?: string;
  temperature: number;
  voltage: number;
  current: number;
  rpm: number;
  status: string;
};

type Alert = {
  deviceId: string;
  message: string;
  timestamp: string;
  severity: string;
};

type Device = {
  deviceId: string;
  lastSeen: string;
  status: string;
};

function App() {
  const [latest, setLatest] = useState<Telemetry | null>(null);
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  async function fetchData() {
    try {
      const latestRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/telemetry/latest`);
      const historyRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/telemetry/history`);
      const alertsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/alerts`);
      const devicesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/devices`);

      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      const alertsData = await alertsRes.json();
      const devicesData = await devicesRes.json();

      if (!latestData.message) setLatest(latestData);
      setHistory(Array.isArray(historyData) ? historyData : []);
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      setDevices(Array.isArray(devicesData) ? devicesData : []);
    } catch (error) {
      console.error("Failed to fetch telemetry:", error);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="dashboard">
      <section className="header">
        <div>
          <p className="eyebrow">Azure Industrial Telemetry Platform</p>
          <h1>Factory Device Monitor</h1>
          <p className="subtitle">
            Real-time machine telemetry, device health, and alert monitoring.
          </p>
        </div>

        <div className={`status-pill ${latest?.status === "warning" ? "warning" : "normal"}`}>
          {latest ? latest.status.toUpperCase() : "WAITING"}
        </div>
      </section>

      <section className="cards">
        <MetricCard title="Temperature" value={latest?.temperature} unit="°C" />
        <MetricCard title="Voltage" value={latest?.voltage} unit="V" />
        <MetricCard title="Current" value={latest?.current} unit="A" />
        <MetricCard title="RPM" value={latest?.rpm} unit="" />
      </section>

      <section className="grid">
        <div className="panel chart-panel">
          <h2>Temperature Trend</h2>
          <TelemetryChart data={history} dataKey="temperature" />
        </div>

        <div className="right-panels">
          <div className="panel small-chart-panel">
            <h2>Voltage Trend</h2>
            <TelemetryChart data={history} dataKey="voltage" />
          </div>

          <div className="panel small-chart-panel">
            <h2>Current Trend</h2>
            <TelemetryChart data={history} dataKey="current" />
          </div>
        </div>

        <div className="panel alert-panel">
          <h2>Recent Alerts</h2>
          {alerts.length === 0 ? (
            <p className="muted">No alerts yet.</p>
          ) : (
            <div className="alerts">
              {alerts.slice().reverse().map((alert, index) => (
                <div className="alert" key={index}>
                  <strong>{alert.message}</strong>
                  <span>
                    {alert.deviceId} •{" "}
                    {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : "No time"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <h2>Devices</h2>
          <div className="devices">
            {devices.map((device, index) => (
              <div className="device-row" key={index}>
                <div>
                  <strong>{device.deviceId}</strong>
                </div>

                <div className={`device-status ${device.status}`}>
                  {device.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function TelemetryChart({
  data,
  dataKey,
}: {
  data: Telemetry[];
  dataKey: "temperature" | "voltage" | "current";
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="timestamp" hide />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MetricCard({
  title,
  value,
  unit,
}: {
  title: string;
  value?: number;
  unit: string;
}) {
  return (
    <div className="metric-card">
      <p>{title}</p>
      <h2>
        {value !== undefined ? value : "--"}
        <span>{unit}</span>
      </h2>
    </div>
  );
}

export default App;