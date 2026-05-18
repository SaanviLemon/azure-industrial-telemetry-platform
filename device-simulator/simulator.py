import time
import json
import random
# pyrefly: ignore [missing-import]
from azure.iot.device import IoTHubDeviceClient, Message

CONNECTION_STRING = "PASTE_CONNECTION_STRING_HERE"

client = IoTHubDeviceClient.create_from_connection_string(CONNECTION_STRING)

client.connect()

while True:
    telemetry = {
        "temperature": random.randint(30, 80),
        "voltage": round(random.uniform(11.5, 12.5), 2),
        "current": round(random.uniform(1.0, 5.0), 2),
        "rpm": random.randint(1000, 3000)
    }

    message = Message(json.dumps(telemetry))

    print("Sending:", telemetry)

    client.send_message(message)

    time.sleep(2)