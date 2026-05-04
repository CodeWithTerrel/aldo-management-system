const BASE_URL = "http://localhost:5000/api";

export async function loginEmployee(employeeId) {
    const response = await fetch(`${BASE_URL}/employees/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ employeeId })
    });

    const data = await response.json();
    return { response, data };
}

export async function getEmployees() {
    const response = await fetch(`${BASE_URL}/employees`);
    const data = await response.json();
    return { response, data };
}

export async function createEmployee(employeeData) {
    const response = await fetch(`${BASE_URL}/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeData)
    });

    const data = await response.json();
    return { response, data };
}

export async function updateEmployee(id, employeeData) {
    const response = await fetch(`${BASE_URL}/employees/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employeeData)
    });

    const data = await response.json();
    return { response, data };
}

export async function deleteEmployee(id, requesterIsAdmin) {
    const response = await fetch(`${BASE_URL}/employees/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ requesterIsAdmin })
    });

    const data = await response.json();
    return { response, data };
}

export async function getMfinds() {
    const response = await fetch(`${BASE_URL}/mfinds`);
    const data = await response.json();
    return { response, data };
}

export async function createMfind(mfindName, isAdmin) {
    const response = await fetch(`${BASE_URL}/mfinds`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mfindName, isAdmin })
    });

    const data = await response.json();
    return { response, data };
}

export async function deleteMfind(mfindId, isAdmin) {
    const response = await fetch(`${BASE_URL}/mfinds/${mfindId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isAdmin })
    });

    const data = await response.json();
    return { response, data };
}

export async function getCurrentAssignment(employeeDbId) {
    const response = await fetch(`${BASE_URL}/mfinds/assignments/current/${employeeDbId}`);
    const data = await response.json();
    return { response, data };
}

export async function assignMfind(employeeDbId, mfindId) {
    const response = await fetch(`${BASE_URL}/mfinds/assign`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ employeeDbId, mfindId })
    });

    const data = await response.json();
    return { response, data };
}

export async function releaseMfind(employeeDbId) {
    const response = await fetch(`${BASE_URL}/mfinds/release`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ employeeDbId })
    });

    const data = await response.json();
    return { response, data };
}

export async function getBathroomEmployees() {
    const response = await fetch(`${BASE_URL}/bathroom/employees`);
    const data = await response.json();
    return { response, data };
}

export async function getBathroomSchedule() {
    const response = await fetch(`${BASE_URL}/bathroom`);
    const data = await response.json();
    return { response, data };
}

export async function getTodayBathroomAssignment(employeeDbId) {
    const response = await fetch(`${BASE_URL}/bathroom/today/${employeeDbId}`);
    const data = await response.json();
    return { response, data };
}

export async function createBathroomAssignment(employeeDbId, scheduleDate, isAdmin, assignedByEmployeeDbId) {
    const response = await fetch(`${BASE_URL}/bathroom`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            employeeDbId,
            scheduleDate,
            isAdmin,
            assignedByEmployeeDbId
        })
    });

    const data = await response.json();
    return { response, data };
}

export async function deleteBathroomAssignment(scheduleId, isAdmin) {
    const response = await fetch(`${BASE_URL}/bathroom/${scheduleId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ isAdmin })
    });

    const data = await response.json();
    return { response, data };
}

export async function autoAssignBathroomSchedule(isAdmin, assignedByEmployeeDbId) {
    const response = await fetch(`${BASE_URL}/bathroom/auto-assign`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isAdmin,
            assignedByEmployeeDbId
        })
    });

    const data = await response.json();
    return { response, data };
}