import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getProfile, updateProfile, changePassword, uploadAvatar, deactivateAccount } from "../api/userApi.js";

import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  // Edit Profile Modal
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // Avatar Upload
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Deactivate Account Modal
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivating, setDeactivating] = useState(false);




  // ---- Edit Profile Handlers ----
  const openEditModal = () => {
    setFormData({ name: user.name });
    setShowEdit(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateProfile(formData);
      setUser(res.data.data);
      setShowEdit(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  // ---- Change Password Handlers ----
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // ---- Avatar Handlers ----
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Only images allowed");
    if (file.size > 2 * 1024 * 1024) return toast.error("Max size 2MB");

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const res = await uploadAvatar(selectedFile);
      setUser(res.data.data);
      setSelectedFile(null);
      setAvatarPreview(null);
      toast.success("Avatar updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  // ---- Deactivate Account ----
  const handleDeactivate = async () => {
    try {
      setDeactivating(true);
      await deactivateAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      toast.success("Account deactivated");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to deactivate account");
    } finally {
      setDeactivating(false);
    }
  };

  // Loading state with spinner
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col">
      <Toaster />
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-xl">

            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              {avatarPreview || user.avatarUrl ? (
                <img
                  src={avatarPreview || user.avatarUrl}
                  alt="avatar"
                  className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <span className="text-4xl font-bold text-white">{initials}</span>
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
                📷
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {selectedFile && (
              <div className="flex justify-center mb-4">
                <Button onClick={handleUploadAvatar} disabled={uploading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
                  {uploading ? "Uploading..." : "Save Photo"}
                </Button>
              </div>
            )}

            {/* Name and Email */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Account & Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Member since</span>
                    <span>Jan 2024</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Account status</span>
                    <span className="font-medium text-emerald-600">Active</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-4 text-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">12</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">23</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Tasks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
              <Button onClick={() => navigate("/dashboard")} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg">
                Dashboard
              </Button>
              <Button onClick={() => setShowEdit(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg">
                Edit Profile
              </Button>
              <Button onClick={() => setShowPasswordModal(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg">
                Change Password
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="mt-10 p-6 border border-red-200 bg-red-50 rounded-2xl">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">Once you deactivate your account, there is no going back.</p>
              <Button onClick={() => setShowDeactivateModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl">
                Deactivate Account
              </Button>
            </div>

          </Card>
        </div>
      </main>
      <Footer />

      {/* ---------------- MODALS ---------------- */}

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowEdit(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
              >
                Save
              </Button>
            </div>
            <button
              onClick={() => setShowEdit(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Old Password"
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowPasswordModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-red-600">Deactivate Account</h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to deactivate your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowDeactivateModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                {deactivating ? "Deactivating..." : "Deactivate"}
              </Button>
            </div>
            <button
              onClick={() => setShowDeactivateModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}