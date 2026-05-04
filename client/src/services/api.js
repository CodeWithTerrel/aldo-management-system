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
        return {
            response: { ok: false },
            data: { error: "Only admins can add employees." }
        };
    }

    const { data, error } = await supabase
        .from("employees")
        .insert({
            employee_id: employeeData.employee_id.trim(),
            name: employeeData.name.trim(),
            role: employeeData.role.trim(),
            is_admin: employeeData.is_admin
        })
        .select()
        .single();

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Employee created successfully.", employee: data }
    };
}

export async function updateEmployee(id, employeeData) {
    if (!employeeData.requesterIsAdmin) {
        return {
            response: { ok: false },
            data: { error: "Only admins can update employees." }
        };
    }

    const { error } = await supabase
        .from("employees")
        .update({
            name: employeeData.name.trim(),
            role: employeeData.role.trim(),
            is_admin: employeeData.is_admin
        })
        .eq("id", id);

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Employee updated successfully." }
    };
}

export async function deleteEmployee(id, requesterIsAdmin) {
    if (!requesterIsAdmin) {
        return {
            response: { ok: false },
            data: { error: "Only admins can delete employees." }
        };
    }

    const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", id);

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Employee deleted successfully." }
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
        return {
            response: { ok: false },
            data: { error: "Only admins can create M-Finds." }
        };
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
        data: error
            ? { error: error.message }
            : { message: "M-Find created successfully.", mfind: data }
    };
}

export async function deleteMfind(mfindId, isAdmin) {
    if (!isAdmin) {
        return {
            response: { ok: false },
            data: { error: "Only admins can delete M-Finds." }
        };
    }

    const { error } = await supabase
        .from("mfinds")
        .delete()
        .eq("id", mfindId)
        .eq("is_available", true);

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "M-Find deleted successfully." }
    };
}

export async function getCurrentAssignment(employeeDbId) {
    const { data, error } = await supabase
        .from("mfind_assignments")
        .select(`
      *,
      mfinds (
        mfind_name
      )
    `)
        .eq("employee_id", employeeDbId)
        .eq("status", "active")
        .maybeSingle();

    if (error || !data) {
        return {
            response: { ok: true },
            data: null
        };
    }

    return {
        response: { ok: true },
        data: {
            ...data,
            mfind_name: data.mfinds?.mfind_name
        }
    };
}

export async function assignMfind(employeeDbId, mfindId) {
    const { data: existingAssignment } = await supabase
        .from("mfind_assignments")
        .select("*")
        .eq("employee_id", employeeDbId)
        .eq("status", "active")
        .maybeSingle();

    if (existingAssignment) {
        return {
            response: { ok: false },
            data: { error: "You already have an active M-Find." }
        };
    }

    const { data: selectedMfind, error: mfindError } = await supabase
        .from("mfinds")
        .select("*")
        .eq("id", mfindId)
        .maybeSingle();

    if (mfindError || !selectedMfind) {
        return {
            response: { ok: false },
            data: { error: "M-Find not found." }
        };
    }

    if (!selectedMfind.is_available) {
        return {
            response: { ok: false },
            data: { error: "This M-Find is already unavailable." }
        };
    }

    const { error: insertError } = await supabase
        .from("mfind_assignments")
        .insert({
            employee_id: employeeDbId,
            mfind_id: mfindId,
            status: "active"
        });

    if (insertError) {
        return {
            response: { ok: false },
            data: { error: insertError.message }
        };
    }

    const { error: updateError } = await supabase
        .from("mfinds")
        .update({ is_available: false })
        .eq("id", mfindId);

    if (updateError) {
        return {
            response: { ok: false },
            data: { error: updateError.message }
        };
    }

    return {
        response: { ok: true },
        data: { message: "M-Find assigned successfully." }
    };
}

export async function releaseMfind(employeeDbId) {
    const { data: activeAssignment, error: assignmentError } = await supabase
        .from("mfind_assignments")
        .select("*")
        .eq("employee_id", employeeDbId)
        .eq("status", "active")
        .maybeSingle();

    if (assignmentError || !activeAssignment) {
        return {
            response: { ok: false },
            data: { error: "No active assignment found." }
        };
    }

    const { error: updateAssignmentError } = await supabase
        .from("mfind_assignments")
        .update({
            status: "completed",
            released_at: new Date().toISOString()
        })
        .eq("id", activeAssignment.id);

    if (updateAssignmentError) {
        return {
            response: { ok: false },
            data: { error: updateAssignmentError.message }
        };
    }

    const { error: updateMfindError } = await supabase
        .from("mfinds")
        .update({ is_available: true })
        .eq("id", activeAssignment.mfind_id);

    if (updateMfindError) {
        return {
            response: { ok: false },
            data: { error: updateMfindError.message }
        };
    }

    return {
        response: { ok: true },
        data: { message: "M-Find released successfully." }
    };
}

/* Bathroom functions are still temporary. */

export async function getBathroomEmployees() {
    return getEmployees();
}

export async function getBathroomSchedule() {
    return {
        response: { ok: true },
        data: []
    };
}

export async function getTodayBathroomAssignment() {
    return {
        response: { ok: true },
        data: null
    };
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