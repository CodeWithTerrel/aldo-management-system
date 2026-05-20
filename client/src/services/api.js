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

  // LOGIN + EMPLOYEES

export async function checkEmployeeHasPassword(employeeId) {
    const { data, error } = await supabase.rpc("employee_has_password", {
        employee_number: employeeId
    });

    return {
        response: { ok: !error },
        data: error ? { error: error.message } : { hasPassword: data }
    };
}

export async function setupEmployeePassword(employeeId, newPassword) {
    const { data, error } = await supabase.rpc("setup_employee_password", {
        employee_number: employeeId,
        new_password: newPassword
    });

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Password created successfully.", employee: data[0] }
    };
}

export async function loginEmployeeWithPassword(employeeId, password) {
    const { data, error } = await supabase.rpc("login_employee_with_password", {
        employee_number: employeeId,
        login_password: password
    });

    if (error || !data || data.length === 0) {
        return {
            response: { ok: false },
            data: { error: "Invalid employee ID or password." }
        };
    }

    return {
        response: { ok: true },
        data: {
            message: "Login successful",
            employee: data[0]
        }
    };
}

/* Temporary support for old login name */
export async function loginEmployee(employeeId) {
    return checkEmployeeHasPassword(employeeId);
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

//m-finds

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

//m-find history

export async function getMfindHistory() {
    const { data, error } = await supabase
        .from("mfind_assignments")
        .select(`
      id,
      assigned_at,
      released_at,
      status,
      employees (
        name
      ),
      mfinds (
        mfind_name
      )
    `)
        .order("assigned_at", { ascending: false });

    if (error) {
        return {
            response: { ok: false },
            data: { error: error.message }
        };
    }

    const formattedData = data.map((entry) => ({
        id: entry.id,
        employee_name: entry.employees?.name || "Unknown Employee",
        mfind_name: entry.mfinds?.mfind_name || "Unknown M-Find",
        assigned_at: entry.assigned_at,
        released_at: entry.released_at,
        status: entry.status,
        duration: calculateDuration(entry.assigned_at, entry.released_at)
    }));

    return {
        response: { ok: true },
        data: formattedData
    };
}

function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) {
        return "Still active";
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const differenceMs = end - start;

    const hours = Math.floor(differenceMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceMs / (1000 * 60)) % 60);

    if (hours === 0) {
        return `${minutes} min`;
    }

    return `${hours} hr ${minutes} min`;
}

//Bathroom schedule

export async function getBathroomEmployees() {
    return getEmployees();
}

export async function getBathroomSchedule() {
    const { data: scheduleData, error: scheduleError } = await supabase
        .from("bathroom_schedule")
        .select(`
      id,
      employee_id,
      schedule_date,
      cleaning_note,
      is_completed,
      completed_at,
      completed_by_employee_id
    `)
        .order("schedule_date", { ascending: true });

    if (scheduleError) {
        return {
            response: { ok: false },
            data: { error: scheduleError.message }
        };
    }

    const { data: employeesData, error: employeesError } = await supabase
        .from("employees")
        .select("id, name, role");

    if (employeesError) {
        return {
            response: { ok: false },
            data: { error: employeesError.message }
        };
    }

    const formattedData = scheduleData.map((entry) => {
        const matchedEmployee = employeesData.find(
            (employee) => employee.id === entry.employee_id
        );

        return {
            id: entry.id,
            employee_id: entry.employee_id,
            schedule_date: entry.schedule_date,
            cleaning_note: entry.cleaning_note,
            is_completed: entry.is_completed,
            completed_at: entry.completed_at,
            completed_by_employee_id: entry.completed_by_employee_id,
            name: matchedEmployee?.name || "Unknown Employee",
            role: matchedEmployee?.role || "Unknown Role"
        };
    });

    return {
        response: { ok: true },
        data: formattedData
    };
}

export async function getTodayBathroomAssignment(employeeDbId) {
    const today = new Date().toISOString().split("T")[0];

    const { data: assignmentData, error: assignmentError } = await supabase
        .from("bathroom_schedule")
        .select(`
      id,
      employee_id,
      schedule_date,
      cleaning_note,
      is_completed,
      completed_at
    `)
        .eq("employee_id", employeeDbId)
        .eq("schedule_date", today)
        .maybeSingle();

    if (assignmentError || !assignmentData) {
        return {
            response: { ok: true },
            data: null
        };
    }

    const { data: employeeData } = await supabase
        .from("employees")
        .select("name, role")
        .eq("id", employeeDbId)
        .maybeSingle();

    return {
        response: { ok: true },
        data: {
            id: assignmentData.id,
            employee_id: assignmentData.employee_id,
            schedule_date: assignmentData.schedule_date,
            cleaning_note: assignmentData.cleaning_note,
            is_completed: assignmentData.is_completed,
            completed_at: assignmentData.completed_at,
            name: employeeData?.name,
            role: employeeData?.role
        }
    };
}

export async function createBathroomAssignment(employeeDbId, scheduleDate, isAdmin, assignedByEmployeeDbId, cleaningNote) {
    if (!isAdmin) {
        return {
            response: { ok: false },
            data: { error: "Only admins can create bathroom assignments." }
        };
    }

    const { data: existingAssignment } = await supabase
        .from("bathroom_schedule")
        .select("*")
        .eq("employee_id", employeeDbId)
        .eq("schedule_date", scheduleDate)
        .maybeSingle();

    if (existingAssignment) {
        return {
            response: { ok: false },
            data: { error: "This employee is already scheduled for that date." }
        };
    }

    const { error } = await supabase
        .from("bathroom_schedule")
        .insert({
            employee_id: employeeDbId,
            schedule_date: scheduleDate,
            cleaning_note: cleaningNote || null
        });

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Bathroom assignment created successfully." }
    };
}

export async function deleteBathroomAssignment(scheduleId, isAdmin) {
    if (!isAdmin) {
        return {
            response: { ok: false },
            data: { error: "Only admins can delete bathroom assignments." }
        };
    }

    const { error } = await supabase
        .from("bathroom_schedule")
        .delete()
        .eq("id", scheduleId);

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Bathroom assignment deleted successfully." }
    };
}

export async function autoAssignBathroomSchedule(isAdmin) {
    if (!isAdmin) {
        return {
            response: { ok: false },
            data: { error: "Only admins can auto-assign bathroom schedules." }
        };
    }

    const { data: employees, error: employeeError } = await supabase
        .from("employees")
        .select("id, name")
        .order("name", { ascending: true });

    if (employeeError || !employees || employees.length === 0) {
        return {
            response: { ok: false },
            data: { error: "Could not load employees for auto assignment." }
        };
    }

    const today = new Date();
    const scheduleRows = [];

    for (let i = 0; i < 7; i += 1) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const employee = employees[i % employees.length];

        scheduleRows.push({
            employee_id: employee.id,
            schedule_date: date.toISOString().split("T")[0],
            cleaning_note: "Complete regular bathroom cleaning duties.",
            is_completed: false
        });
    }

    const { error: deleteError } = await supabase
        .from("bathroom_schedule")
        .delete()
        .gte("schedule_date", new Date().toISOString().split("T")[0]);

    if (deleteError) {
        return {
            response: { ok: false },
            data: { error: deleteError.message }
        };
    }

    const { error: insertError } = await supabase
        .from("bathroom_schedule")
        .insert(scheduleRows);

    return {
        response: { ok: !insertError },
        data: insertError
            ? { error: insertError.message }
            : { message: "Bathroom schedule auto-assigned for the next 7 days." }
    };
}

export async function completeBathroomAssignment(scheduleId, employeeDbId) {
    const { error } = await supabase
        .from("bathroom_schedule")
        .update({
            is_completed: true,
            completed_at: new Date().toISOString(),
            completed_by_employee_id: employeeDbId
        })
        .eq("id", scheduleId)
        .eq("employee_id", employeeDbId);

    return {
        response: { ok: !error },
        data: error
            ? { error: error.message }
            : { message: "Bathroom task marked as complete." }
    };
}