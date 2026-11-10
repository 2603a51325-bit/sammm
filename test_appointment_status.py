from datetime import date

import app
import database


def test_doctor_can_cancel_ongoing_appointment(monkeypatch, tmp_path):
    monkeypatch.setattr(database, "DB_FILE", str(tmp_path / "healthcare.db"))
    database.init_database()
    assert database.register_doctor(
        "DOC-TEST", "Dr. Example", "+15555550101", "doctor@example.test",
        "Password123!", security_pin="2468"
    )
    assert database.register_patient(
        "PAT-TEST", "Patient Example", "+15555550102", "patient@example.test",
        "Password123!", security_pin="1357"
    )
    appointment = database.add_appointment({
        "doctor_id": "DOC-TEST",
        "patient_id": "PAT-TEST",
        "appointment_date": date.today().isoformat(),
        "appointment_time": "10:00",
        "status": "scheduled",
    })
    assert database.update_appointment_status({
        "appointment_id": appointment["id"],
        "doctor_id": "DOC-TEST",
        "status": "ongoing",
    })["status"] == "ongoing"

    handler = app.HealthcareRequestHandler.__new__(app.HealthcareRequestHandler)
    responses = []
    handler.send_json = lambda status, payload: responses.append((status, payload))
    handler.handle_appointments({
        "action": "update_status",
        "appointment_id": appointment["id"],
        "doctor_id": "DOC-TEST",
        "status": "cancelled",
    })

    status_code, payload = responses[0]
    assert status_code == 200
    assert payload["appointment"]["status"] == "cancelled"
