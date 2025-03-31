import axios from "axios";

const API_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//  Attach Authorization token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------ User Profile APIs ------------------ //
export const getUserProfile = async (userId) => {
  try {
    // console.log(`Fetching user profile for ID: ${userId}`);
    const response = await API.get(`/users/${userId}`);

    if (response.data && response.data.user) {
      // console.log(" User Profile Data:", response.data.user);
      return response.data; //  Return full user object
    } else {
      throw new Error("User profile response is invalid.");
    }
  } catch (error) {
    // console.error(
    //   " Error fetching user profile:",
    //   error.response ? error.response.data : error.message
    // );
    throw error.response?.data || { message: "Failed to fetch user profile" };
  }
};

export const updateUserProfile = async (userId, data) => {
  // console.log(`Updating user: ${userId} with data:`, data);

  try {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    const updateData = {
      ...data,
      email: data.email || storedUser.email || "",
    };

    const { _id, ...finalData } = updateData;

    const response = await API.put(`/users/${userId}`, finalData);

    // console.log(" API Response from server:", response.data);

    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Invalid response from server.");
    }
  } catch (error) {
    // console.error(
    //   " Error updating user profile:",
    //   error.response?.data || error
    // );
    throw error.response?.data || { message: "Failed to update profile" };
  }
};

/* ------------ Medical History APIs ------------*/

//  Fetch medical history for a user
export const getMedicalHistory = async (userId) => {
  try {
    // console.log(`Fetching medical history for user: ${userId}`);
    const response = await API.get(`/users/${userId}/medical-history`);

    if (response.data && response.data.medicalHistory) {
      // console.log(" Medical History Data:", response.data.medicalHistory);
      return response.data.medicalHistory;
    } else {
      throw new Error("Medical history response is invalid.");
    }
  } catch (error) {
    console.error(
      " Error fetching medical history:",
      error.response?.data || error
    );
    throw (
      error.response?.data || { message: "Failed to fetch medical history" }
    );
  }
};

//  Add a new medical history entry
export const addMedicalHistory = async (userId, historyData) => {
  // console.log(` Adding medical history for user: ${userId}`, historyData);

  try {
    const response = await API.post(
      `/users/${userId}/medical-history`,
      historyData
    );

    // console.log(" Medical History Added:", response.data);
    return response.data;
  } catch (error) {
    // console.error(
    //   " Error adding medical history:",
    //   error.response?.data || error
    // );
    throw error.response?.data || { message: "Failed to add medical history" };
  }
};

//  Delete a medical history entry
export const deleteMedicalHistory = async (userId, historyId) => {
  try {
    // console.log(
    //   `Deleting medical history entry ${historyId} for user: ${userId}`
    // );

    const response = await API.delete(
      `/users/${userId}/medical-history/${historyId}`
    );

    return response.data;
  } catch (error) {
    // console.error(
    //   " Error deleting medical history:",
    //   error.response?.status || "",
    //   error.response?.data || error
    // );
    throw (
      error.response?.data || { message: "Failed to delete medical history" }
    );
  }
};

// ------------------ Doctor APIs ------------------ //

// Create a new doctor profile
export const createDoctorProfile = async (doctorData) => {
  try {
    const response = await API.post("/doctors", doctorData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to create doctor profile" }
    );
  }
};

// Update an existing doctor profile
export const updateDoctorProfile = async (doctorId, updatedData) => {
  try {
    const response = await API.put(`/doctors/${doctorId}`, updatedData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to update doctor profile" }
    );
  }
};

// Fetch a doctor's profile by ID
export const getDoctorProfile = async (doctorId) => {
  try {
    const response = await API.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch doctor profile" };
  }
};
