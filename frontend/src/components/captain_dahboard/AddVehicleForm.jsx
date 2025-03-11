import React, { useState } from "react";
import "./AddVehicleForm.css"; // Import CSS file for styling

const AddVehicleForm = ({
  handleAddVehicle,
  handleInputChange,
  setShowForm,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    handleInputChange({ target: { name: "photo", value: file } }); // Pass file to parent handler
  };

  return (
    <div className="add-vehicle-form">
      <h3>Add New Vehicle</h3>
      <form onSubmit={handleAddVehicle}>
        <input
          type="text"
          name="name"
          placeholder="Vehicle Name"
          required
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          required
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          required
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="perKmRate"
          placeholder="Rate per Km"
          required
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="numberplate"
          placeholder="Number Plate"
          required
          onChange={handleInputChange}
        />
        <select name="type" required onChange={handleInputChange}>
          <option value="">Select Type</option>
          <option value="transport">Transport</option>
          <option value="passenger travel">Passenger Travel</option>
        </select>

        {/* Image Upload Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        />

        {/* Display Selected Image Preview */}
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="image-preview"
          />
        )}

        <button type="submit">Add Vehicle</button>
      </form>
      <button className="cancel-btn" onClick={() => setShowForm(false)}>
        Cancel
      </button>
    </div>
  );
};

export default AddVehicleForm;
