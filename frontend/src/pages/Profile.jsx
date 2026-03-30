import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getProfile, updateProfile, changePassword, deactivateAccount, uploadAvatar } from "../api/userApi";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext.jsx";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

// Dynamic initials background
function stringToColor(str = "User") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return color;
}

// Loading Skeleton
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    <Card>
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    </Card>
  </div>
);

export default function Profile() {
  const {  setToken } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Crop states
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const cropRef = useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Load user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        setUser(res.data.data);
        setFormData({
          name: res.data.data.name || "",
          email: res.data.data.email || "",
        });
        setAvatarPreview(res.data.data.avatarUrl || null);
      } catch (error) {
        toast.error("Failed to load profile");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Avatar dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    noClick: uploadingAvatar,
    noKeyboard: uploadingAvatar,
    disabled: uploadingAvatar,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setAvatarFile(file);
        const preview = URL.createObjectURL(file);
        setAvatarPreview(preview);
        setCropOpen(true);
      }
    },
  });

  const handleAvatarUpload = async () => {
    if (!avatarFile || !croppedAreaPixels) return;
    
    setUploadingAvatar(true);
    
    try {
      // Crop image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const img = new Image();
      img.onload = async () => {
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        
        ctx.drawImage(
          img,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0, 0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob(async (croppedBlob) => {
          const compressedFile = await imageCompression(croppedBlob, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 512,
          });

          try {
            const res = await uploadAvatar(compressedFile);
            setUser({ ...user, avatarUrl: res.data.data });
            toast.success("Avatar updated successfully!");
            setAvatarFile(null);
            setAvatarPreview(res.data.data);
            setCropOpen(false);
          } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
          } finally {
            setUploadingAvatar(false);
            setUploadProgress(0);
          }
        }, "image/jpeg", 0.9);
      };
      img.src = avatarPreview;
    } catch (error) {
      toast.error("Image processing failed");
      setUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    setSaving(true);
    try {
      const res = await updateProfile(formData);
      setUser({ ...user, ...res.data.data });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) return;
    
    try {
      await deactivateAccount();
      localStorage.removeItem("token");
      setToken(null);
      toast.success("Account deactivated successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Deactivation failed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-12 space-y-8">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ToastContainer position="top-right" className="toast-container" />
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                My Profile
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Update your personal information and avatar
              </p>
            </div>
            {editMode ? (
              <Button 
                onClick={handleProfileUpdate} 
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-medium shadow-lg"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            ) : (
              <Button 
                onClick={() => setEditMode(true)}
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-medium shadow-lg"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 text-center">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full shadow-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover shadow-2xl"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl"
                      style={{ backgroundColor: stringToColor(formData.name) }}
                    >
                      {formData.name ? formData.name[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </div>
              
              <div {...getRootProps()} className={`
                border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer 
                transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50 
                ${isDragActive ? 'border-indigo-400 bg-indigo-50' : ''}
                ${uploadingAvatar ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
              `}>
                <input {...getInputProps()} />
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-medium">Click or drag image to upload</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {uploadingAvatar && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600 font-medium">
                    <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <span>Uploading... {uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                Profile Information
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      disabled={!editMode}
                      className={editMode ? "" : "bg-gray-50 cursor-not-allowed"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      disabled={!editMode}
                      className={editMode ? "" : "bg-gray-50 cursor-not-allowed"}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {editMode && (
                    <Button 
                      type="submit" 
                      disabled={saving || !formData.name.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-lg flex-1 sm:flex-none"
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  )}
                  {!editMode && (
                    <Button 
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-lg"
                    >
                      Edit Profile
                    </Button>
                  )}
                  {editMode && (
                    <Button 
                      type="button"
                      onClick={() => {
                        setFormData({ name: user?.name || "", email: user?.email || "" });
                        setEditMode(false);
                      }}
                      variant="outline"
                      className="px-8 py-3 rounded-xl font-semibold border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Card>

            {/* Security */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                Security
              </h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057 Ascending 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={changingPassword}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </Card>

            {/* Danger Zone */}
            <Card className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-2">Delete Account</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button
                    onClick={handleDeactivate}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-semibold shadow-lg border-transparent transition-all duration-200"
                  >
                    Deactivate Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

