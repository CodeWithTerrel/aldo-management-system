// const BASE_URL = "http://localhost:5000/api";
//
// export async function loginEmployee(employeeId) {
//     const response = await fetch(`${BASE_URL}/employees/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ employeeId })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function getEmployees() {
//     const response = await fetch(`${BASE_URL}/employees`);
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function createEmployee(employeeData) {
//     const response = await fetch(`${BASE_URL}/employees`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(employeeData)
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function updateEmployee(id, employeeData) {
//     const response = await fetch(`${BASE_URL}/employees/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(employeeData)
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function deleteEmployee(id, requesterIsAdmin) {
//     const response = await fetch(`${BASE_URL}/employees/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ requesterIsAdmin })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function getMfinds() {
//     const response = await fetch(`${BASE_URL}/mfinds`);
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function createMfind(mfindName, isAdmin) {
//     const response = await fetch(`${BASE_URL}/mfinds`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ mfindName, isAdmin })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function deleteMfind(mfindId, isAdmin) {
//     const response = await fetch(`${BASE_URL}/mfinds/${mfindId}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ isAdmin })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function getCurrentAssignment(employeeDbId) {
//     const response = await fetch(`${BASE_URL}/mfinds/assignments/current/${employeeDbId}`);
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function assignMfind(employeeDbId, mfindId) {
//     const response = await fetch(`${BASE_URL}/mfinds/assign`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ employeeDbId, mfindId })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function releaseMfind(employeeDbId) {
//     const response = await fetch(`${BASE_URL}/mfinds/release`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ employeeDbId })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function getBathroomEmployees() {
//     const response = await fetch(`${BASE_URL}/bathroom/employees`);
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function getBathroomSchedule() {
//     const response = await fetch(`${BASE_URL}/bathroom`);
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function getTodayBathroomAssignment(employeeDbId) {
//     const response = await fetch(`${BASE_URL}/bathroom/today/${employeeDbId}`);
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function createBathroomAssignment(employeeDbId, scheduleDate, isAdmin, assignedByEmployeeDbId) {
//     const response = await fetch(`${BASE_URL}/bathroom`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             employeeDbId,
//             scheduleDate,
//             isAdmin,
//             assignedByEmployeeDbId
//         })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function deleteBathroomAssignment(scheduleId, isAdmin) {
//     const response = await fetch(`${BASE_URL}/bathroom/${scheduleId}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ isAdmin })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }
//
// export async function autoAssignBathroomSchedule(isAdmin, assignedByEmployeeDbId) {
//     const response = await fetch(`${BASE_URL}/bathroom/auto-assign`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             isAdmin,
//             assignedByEmployeeDbId
//         })
//     });
//
//     const data = await response.json();
//     return { response, data };
// }

import { supabase } from "../lib/supabase";

export async function loginEmployee(employeeId) {
    const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("employee_id", employeeId)
        .single();

    return {
        response: { ok: !error },
        data: error
            ? { error: "Employee not found" }
            : { message: "Login successful", employee: data }
    };
}

export async function getEmployees() {
    const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name", { ascending: true });

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : data
    };
}

export async function createEmployee(employeeData) {
    if (!employeeData.requesterIsAdmin) {
        return { response: { ok: false }, data: { error: "Only admins can add employees." } };
    }

    const { data, error } = await supabase
        .from("employees")
        .insert({
            employee_id: employeeData.employee_id,
            name: employeeData.name,
            role: employeeData.role,
            is_admin: employeeData.is_admin
        })
        .select()
        .single();

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : { message: "Employee created successfully.", employee: data }
    };
}

export async function updateEmployee(id, employeeData) {
    if (!employeeData.requesterIsAdmin) {
        return { response: { ok: false }, data: { error: "Only admins can update employees." } };
    }

    const { error } = await supabase
        .from("employees")
        .update({
            name: employeeData.name,
            role: employeeData.role,
            is_admin: employeeData.is_admin
        })
        .eq("id", id);

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : { message: "Employee updated successfully." }
    };
}

export async function deleteEmployee(id, requesterIsAdmin) {
    if (!requesterIsAdmin) {
        return { response: { ok: false }, data: { error: "Only admins can delete employees." } };
    }

    const { error } = await supabase.from("employees").delete().eq("id", id);

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : { message: "Employee deleted successfully." }
    };
}

export async function getMfinds() {
    const { data, error } = await supabase
        .from("mfinds")
        .select("*")
        .order("id", { ascending: true });

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : data
    };
}

export async function createMfind(mfindName, isAdmin) {
    if (!isAdmin) {
        return { response: { ok: false }, data: { error: "Only admins can create M-Finds." } };
    }

    const { data, error } = await supabase
        .from("mfinds")
        .insert({
            mfind_name: mfindName.trim(),
            is_available: true
        })
        .select()
        .single();

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : { message: "M-Find created successfully.", mfind: data }
    };
}

export async function deleteMfind(mfindId, isAdmin) {
    if (!isAdmin) {
        return { response: { ok: false }, data: { error: "Only admins can delete M-Finds." } };
    }

    const { error } = await supabase
        .from("mfinds")
        .delete()
        .eq("id", mfindId)
        .eq("is_available", true);

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : { message: "M-Find deleted successfully." }
    };
}

/* Temporary placeholders so the app does not go blank.
   We will replace these with real Supabase logic next. */

export async function getCurrentAssignment() {
    return { response: { ok: true }, data: null };
}

export async function assignMfind() {
    return {
        response: { ok: false },
        data: { error: "Clock-in is being moved to Supabase next." }
    };
}

export async function releaseMfind() {
    return {
        response: { ok: false },
        data: { error: "Clock-out is being moved to Supabase next." }
    };
}

export async function getBathroomEmployees() {
    return getEmployees();
}

export async function getBathroomSchedule() {
    return { response: { ok: true }, data: [] };
}

export async function getTodayBathroomAssignment() {
    return { response: { ok: true }, data: null };
}

export async function createBathroomAssignment() {
    return {
        response: { ok: false },
        data: { error: "Bathroom scheduling is being moved to Supabase next." }
    };
}

export async function deleteBathroomAssignment() {
    return {
        response: { ok: false },
        data: { error: "Bathroom scheduling is being moved to Supabase next." }
    };
}

export async function autoAssignBathroomSchedule() {
    return {
        response: { ok: false },
        data: { error: "Bathroom scheduling is being moved to Supabase next." }
    };
}