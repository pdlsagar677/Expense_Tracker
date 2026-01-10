"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Edit2,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Button from "@/components/Button";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProfilePage() {
  const router = useRouter();
  const { 
    user, 
    isLoading, 
    error, 
    message,
    getProfile,
    updateProfile,
    clearError,
    clearMessage
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    gender: ""
  });

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phoneNumber: user.phoneNumber,
        age: user.age.toString(),
        gender: user.gender
      });
    } else {
      getProfile();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber' && !/^\d*$/.test(value)) {
      return;
    }
    
    if (name === 'age' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setLocalError("Name is required");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setLocalError("Phone number is required");
      return false;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setLocalError("Phone number must be 10 digits");
      return false;
    }

    if (!formData.age.trim()) {
      setLocalError("Age is required");
      return false;
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setLocalError("Age must be between 1 and 120");
      return false;
    }

    if (!formData.gender) {
      setLocalError("Gender is required");
      return false;
    }

    const validGenders = ["male", "female", "other"];
    if (!validGenders.includes(formData.gender.toLowerCase())) {
      setLocalError("Please select a valid gender");
      return false;
    }

    setLocalError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const updateData = {
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        age: formData.age,
        gender: formData.gender
      };

      await updateProfile(updateData);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        phoneNumber: user.phoneNumber,
        age: user.age.toString(),
        gender: user.gender
      });
    }
    setIsEditing(false);
    setLocalError("");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit2 size={16} />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Error & Message Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            ×
          </button>
        </div>
      )}

      {localError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800">Validation Error</p>
            <p className="text-sm text-yellow-600">{localError}</p>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Success</p>
            <p className="text-sm text-green-600">{message}</p>
          </div>
          <button onClick={clearMessage} className="text-green-600 hover:text-green-800">
            ×
          </button>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white/20 backdrop-blur-sm border-0 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:ring-2 focus:ring-white focus:outline-none"
                    placeholder="Enter your name"
                  />
                ) : (
                  user?.name || "User Name"
                )}
              </h2>
              <p className="text-white/80 flex items-center gap-2 mt-1">
                <Mail size={14} />
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-8 space-y-6">
          {/* Verification Status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className={`w-6 h-6 ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`} />
              <div>
                <p className="font-medium text-gray-900">Account Status</p>
                <p className={`text-sm ${user?.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user?.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
            {!user?.isVerified && (
              <Button size="sm" variant="outline">
                Verify Account
              </Button>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone size={14} />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="10-digit phone number"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{user?.phoneNumber || "Not provided"}</p>
                </div>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={14} />
                Age
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  maxLength={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter your age"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900">{user?.age || "Not provided"}</p>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <p className="text-gray-900 capitalize">{user?.gender || "Not provided"}</p>
                </div>
              )}
            </div>

            {/* Account Created */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Member Since
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-xl">
                <p className="text-gray-900">
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Statistics (Optional - can add later) */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{user?.age || 0}</p>
                <p className="text-sm text-gray-600">Age</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">
                  {user?.isVerified ? "Yes" : "No"}
                </p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-2xl font-bold text-purple-600">
                  {user?.phoneNumber ? "✓" : "✗"}
                </p>
                <p className="text-sm text-gray-600">Phone</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <p className="text-2xl font-bold text-amber-600 capitalize">
                  {user?.gender ? user.gender.charAt(0).toUpperCase() : "N/A"}
                </p>
                <p className="text-sm text-gray-600">Gender</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
        <Button
          onClick={() => {
            // Navigate to change password or other settings
            router.push('/change-password');
          }}
        >
          Change Password
        </Button>
      </div>
    </div>
  );
}