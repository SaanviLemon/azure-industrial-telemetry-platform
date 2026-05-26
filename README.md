# Azure Industrial Telemetry Platform

## Overview
Real-time industrial telemetry monitoring platform built with React, FastAPI, and Azure IoT Hub.

The system simulates factory machine telemetry, processes live sensor data through a cloud-connected pipeline, generates alerts for abnormal conditions, and visualizes telemetry in a real-time dashboard.

---

## Architecture

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
(Add dashboard screenshot here)

### Swagger API Docs
(Add Swagger screenshot here)

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

- Persistent database storage
- Authentication and user roles
- Real IoT hardware integration
- WebSocket real-time streaming
- Historical analytics dashboard
- Docker deployment