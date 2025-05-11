import requests

BASE_URL = "http://127.0.0.1:5000"

# Structured and normalized failure data extracted from phone note
failures_data = [
    {"batch_number": 17, "failures": [
        {"failure_type": "up-down"},
        {"failure_type": "DS20 bubble"}
    ]},
    {"batch_number": 22, "failures": [
        {"size": "large", "failure_type": "DS20 bubble"} for _ in range(5)
    ]},
    {"batch_number": 28, "failures": [
        {"failure_type": "up-down"},
        {"failure_type": "SS bubble"},
        {"failure_type": "SS bubble"},
        {"failure_type": "DS bubble"},
    ]},
    # ... more batches continue in same format ...
    {"batch_number": 129, "failures": [
        {"type": "thumb", "failure_type": "AB mismatch"}
    ]},
]


def batch_exists(batch_number):
    response = requests.get(f"{BASE_URL}/fingers/stats")  # Dummy call to ensure server is live
    if response.status_code != 200:
        raise ConnectionError("API not reachable")

    # You should ideally have a GET /batch/<batch_number> endpoint.
    # For now, we check by trying to re-create and seeing if it's rejected.
    resp = requests.post(f"{BASE_URL}/batch", json={"batch_number": batch_number})
    if resp.status_code == 201:
        print(f"Batch {batch_number} created.")
        return False  # Newly created
    elif resp.status_code == 400 and "already exists" in resp.text:
        print(f"Batch {batch_number} already exists.")
        return True
    else:
        print(f"Batch {batch_number} may already exist or request failed.")
        return True


def upload_failures():
    for entry in failures_data:
        batch_number = entry["batch_number"]
        failures = entry["failures"]

        batch_exists(batch_number)  # Create batch if not exists

        for failure in failures:
            payload = {
                "phase": "molding",
                "failure_type": failure["failure_type"],
                "finger_id": None  # Unknown in note data
            }
            resp = requests.post(f"{BASE_URL}/failure", json=payload)
            if resp.status_code == 201:
                print(f"Logged failure for batch {batch_number}: {failure['failure_type']}")
            else:
                print(f"Failed to log failure: {resp.status_code}, {resp.text}")


if __name__ == "__main__":
    upload_failures()
