from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

app = FastAPI(title="Industrial Telemetry Backend")
device_last_seen = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

telemetry_history = []
alerts = []


class Telemetry(BaseModel):
    deviceId: str
    timestamp: Optional[str] = None
    temperature: float
    voltage: float
    current: float
    rpm: int
    status: str


def check_alerts(data: Telemetry):
    new_alerts = []

    if data.temperature > 75:
        new_alerts.append("High temperature detected")

    if data.current > 6:
        new_alerts.append("High current draw detected")

    if data.rpm > 2800:
        new_alerts.append("High RPM detected")

    for alert in new_alerts:
        alerts.append({
            "deviceId": data.deviceId,
            "message": alert,
            "timestamp": datetime.utcnow().isoformat(),
            "severity": "warning"
        })


@app.get("/")
def root():
    return {"message": "Telemetry backend running"}

@app.post("/telemetry")
def receive_telemetry(data: Telemetry):
    device_last_seen[data.deviceId] = datetime.utcnow()
    telemetry_history.append(data.model_dump())

    if len(telemetry_history) > 100:
        telemetry_history.pop(0)

    check_alerts(data)

    return {
        "message": "Telemetry received",
        "data": data
    }


@app.get("/telemetry/latest")
def get_latest_telemetry():
    if not telemetry_history:
        return {"message": "No telemetry received yet"}

    return telemetry_history[-1]


@app.get("/telemetry/history")
def get_telemetry_history():
    return telemetry_history


@app.get("/alerts")
def get_alerts():
    return alerts[-20:]


@app.get("/devices")
def get_devices():
    devices = []

    now = datetime.utcnow()

    for device_id, last_seen in device_last_seen.items():
        online = (now - last_seen) < timedelta(seconds=10)

        devices.append({
            "deviceId": device_id,
            "lastSeen": last_seen.isoformat(),
            "status": "online" if online else "offline"
        })

    return devices
