# Azure Industrial Telemetry Platform

## Overview
Real-time industrial telemetry monitoring platform built with React, FastAPI, and Azure IoT Hub.

The system simulates factory machine telemetry, processes live sensor data through a cloud-connected pipeline, generates alerts for abnormal conditions, and visualizes telemetry in a real-time dashboard.

---

## Architecture
Device Simulator → Azure IoT Hub → FastAPI Backend → React Dashboard
![System Architecture](docs/architecture-diagram.png)

---

## Features

- Real-time telemetry simulation
- Azure IoT Hub cloud ingestion
- FastAPI REST API backend
- React dashboard visualization
- Live temperature trend charts
- Alert generation for abnormal telemetry
- Device monitoring/status tracking

---

## Tech Stack
Python, FastAPI, React, TypeScript, Azure IoT Hub, Azure App Service, Azure Static Web Apps

### Frontend
- React
- TypeScript
- Vite
- Recharts

### Backend
- FastAPI
- Python

### Cloud
- Azure IoT Hub

---

## Screenshots

### Dashboard
![alt text](image.png)

### Swagger API Docs
![alt text](image-1.png)

---

## How to Run

### Backend

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

### Device Simulator

```bash
cd device-simulator
source venv/bin/activate
python simulator.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Future Improvements

- Replace simulated telemetry with physical Arduino/Raspberry Pi sensor input
- Store historical telemetry in Azure Cosmos DB or PostgreSQL
- Add user authentication for protected device dashboards
- Add WebSocket support for lower-latency real-time updates
- Implement anomaly detection for predictive maintenance
- Add CI/CD testing for backend and frontend deployments