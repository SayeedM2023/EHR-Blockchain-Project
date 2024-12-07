// UI interactions for EHR application
const resultText = document.getElementById("resultText");

// Function to create a new patient
async function createPatient() {
    try {
        const response = await fetch('/create-patient', { method: 'POST' });
        const result = await response.json();
        resultText.textContent = `Patient created.\n\nPatient ID: ${result.id}\nName: ${result.name}`;
    } catch (error) {
        console.error("Error creating patient:", error);
        resultText.textContent = "Error creating patient.";
    }
}

// Function to query a patient
async function queryPatient() {
    const patientId = prompt("Enter patient ID to query:", "P001");
    if (!patientId) return;

    try {
        const response = await fetch(`/query-patient?id=${patientId}`);
        const patient = await response.json();
        resultText.textContent = `Patient Record:\nID: ${patient.id}\nName: ${patient.name}\nAge: ${patient.age}\nDiagnosis: ${patient.diagnosis}`;
    } catch (error) {
        console.error("Error querying patient:", error);
        resultText.textContent = "Error querying patient.";
    }
}

// Function to update a patient record
async function updatePatient() {
    const patientId = prompt("Enter patient ID to update:", "P001");
    if (!patientId) return;

    const diagnosis = prompt("Enter new diagnosis:", "Flu");
    const treatment = prompt("Enter new treatment:", "Rest");

    try {
        const response = await fetch('/update-patient', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: patientId, diagnosis, treatment })
        });
        const result = await response.json();
        resultText.textContent = `Patient updated.\n\nUpdated ID: ${result.id}\nDiagnosis: ${result.diagnosis}\nTreatment: ${result.treatment}`;
    } catch (error) {
        console.error("Error updating patient:", error);
        resultText.textContent = "Error updating patient.";
    }
}
