import API from "./axios";

// 🔹 Get current user
export const getProfile = () => API.get("/users/me");

// 🔹 Update profile
export const updateProfile = (data) => API.put("/users/me", data);

// 🔹 Change password
export const changePassword = (data) =>
  API.put("/users/change-password", data);

// 🔹 Deactivate account
export const deactivateAccount = () =>
  API.put("/users/deactivate");

// 🔹 Upload Avatar
export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/users/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};