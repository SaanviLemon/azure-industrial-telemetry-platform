import requests
import json
import random
import time
import os
from datetime import datetime, timezone

from azure.iot.device import IoTHubDeviceClient, Message
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("AZURE_IOT_CONNECTION_STRING")

if not CONNECTION_STRING:
    raise ValueError("Missing AZURE_IOT_CONNECTION_STRING in .env file")

client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)


def generate_telemetry():
    abnormal = random.random() < 0.15  # 15% chance of abnormal condition

    if abnormal:
        temperature = round(random.uniform(75, 95), 2)
        current = round(random.uniform(6.0, 9.0), 2)
        rpm = random.randint(2800, 3400)
        status = "warning"
    else:
        temperature = round(random.uniform(35, 65), 2)
        current = round(random.uniform(1.5, 5.5), 2)
        rpm = random.randint(1000, 2600)
        status = "normal"

    voltage = round(random.uniform(11.6, 12.4), 2)

    return {
        "deviceId": "factory-device-001",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "temperature": temperature,
        "voltage": voltage,
        "current": current,
        "rpm": rpm,
        "status": status
    }


def main():
    print("Connecting to Azure IoT Hub...")
    client.connect()
    print("Connected. Sending telemetry...")

    try:
        while True:
            telemetry = generate_telemetry()
            message = Message(json.dumps(telemetry))

            message.content_encoding = "utf-8"
            message.content_type = "application/json"

            print("Sending:", telemetry)
            client.send_message(message)
            
            try:
                response = requests.post("http://127.0.0.1:8000/telemetry", json=telemetry)
                print("Backend response:", response.status_code)
            except requests.exceptions.RequestException:
                print("Backend not reachable")
                
            time.sleep(2)

    except KeyboardInterrupt:
        print("\nStopping simulator...")

    finally:
        client.disconnect()
        print("Disconnected.")


if __name__ == "__main__":
    main()
