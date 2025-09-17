import React, { useState, useEffect } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import api from "../../services/api";
import "./Captain.css"; // Updated CSS file for Captain Profile

const CaptainProfile = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [captainData, setCaptainData] = useState({
    username: "",
    email: "",
    profileImage: null,
    licenseNumber: "", // Example captain-specific field
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCaptainProfile();
  }, [isSubmitting]);

  const fetchCaptainProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.getCaptainProfile(); // Updated API endpoint for captain profile
      if (response.data.status === 1) {
        setCaptainData(response.data.data);
        setSelectedImage(response.data.data.profileImage);
      } else {
        setError(response.data.message || "Failed to load profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
      console.error("Error fetching profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      try {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("profileImage", file);

        const response = await api.updateCaptainProfileImage(formData); // Updated API endpoint for captain profile image

        if (response.data.status === 1) {
          setCaptainData((prevData) => ({
            ...prevData,
            profileImage: response.data.data.profileImage,
          }));
          setSelectedImage(response.data.data.profileImage);
        } else {
          alert(response.data.message || "Failed to update profile image");
        }
      } catch (err) {
        console.error("Error updating profile image:", err);
        alert(err.response?.data?.message || "Failed to update profile image");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (!captainData.username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.updateCaptainUsername({
        username: captainData.username,
      }); // Updated API endpoint for captain username

      if (response.data.status === 1) {
        setIsEditingName(false);
        setCaptainData(response.data.data);

        // Remove the old username from local storage
         localStorage.removeItem("username");

         // Update local storage with the new username
         localStorage.setItem("username", response.data.data.username);
      } else {
        alert(response.data.message || "Failed to update username");
      }
    } catch (err) {
      console.error("Error updating username:", err);
      alert(err.response?.data?.message || "Failed to update username");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={selectedImage || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-image"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              <FaCamera className="camera-icon" />
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="profile-info">
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} className="edit-name-form">
                <input
                  type="text"
                  value={captainData.username}
                  onChange={(e) =>
                    setCaptainData({
                      ...captainData,
                      username: e.target.value,
                    })
                  }
                  className="name-input"
                />
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditingName(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="name-container">
                <h2>{captainData.username}</h2>
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsEditingName(true)}
                />
              </div>
            )}
            <p className="email">{captainData.email}</p>
            <p className="license-number">
              License Number: {captainData.licenseNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainProfile;
