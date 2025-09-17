import React, { useState } from "react";
import "./AddVehicleForm.css";

const AddVehicleForm = ({
  handleAddVehicle,
  handleInputChange,
  setShowForm,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    handleInputChange({ target: { name: "photo", value: file } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleAddVehicle(e);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="add-vehicle-form">
        <h3>Add New Vehicle</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Vehicle Name</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="model"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Model</label>
          </div>

          <div className="input-group">
            <input
              type="number"
              name="capacity"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Capacity (Passengers)</label>
          </div>

          <div className="input-group">
            <input
              type="number"
              name="perKmRate"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Rate per Km</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="numberplate"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Number Plate</label>
          </div>

          <div className="input-group">
            <select name="type" required onChange={handleInputChange}>
              <option value="">Select Type</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Mini-Truck">Mini_Truck</option>
              <option value="Travler">Travler</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          <div className="input-group">
            <select name="fuelType" required onChange={handleInputChange}>
              <option value="">Select Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="number"
              name="weightCapacity"
              placeholder=" "
              onChange={handleInputChange}
            />
            <label>Max Weight Capacity (Kg)</label>
          </div>

          <div className="input-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="acAvailable"
                onChange={handleInputChange}
              />
              AC Available
            </label>
          </div>

          <div className="input-group file-input">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="image-preview"
              />
            )}
          </div>

          <div className="input-group">
            <input
              type="text"
              name="driver.name"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Driver Name</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="driver.contact"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Driver Contact</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="driver.licenseNumber"
              placeholder=" "
              required
              onChange={handleInputChange}
            />
            <label>Driver License Number</label>
          </div>

          <button
            type="submit"
            className={isSubmitting ? "loading" : ""}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
          </button>
        </form>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddVehicleForm;
