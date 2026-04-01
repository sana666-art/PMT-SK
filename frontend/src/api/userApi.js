import API from "./axios";

// 🔹 Get current user
export const getProfile = () => API.get("/api/users/me");

// 🔹 Update profile
export const updateProfile = (data) => API.put("/api/users/me", data);

// 🔹 Change password
export const changePassword = (data) =>
  API.put("/api/users/change-password", data);

// 🔹 Deactivate account
export const deactivateAccount = () =>
  API.put("/api/users/deactivate");

// 🔹 Upload Avatar
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.put("/api/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};