import React, { useState } from "react";
import "./AddVehicleForm.css";

const AddVehicleForm = ({ handleAddVehicle, handleInputChange, setShowForm }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    handleInputChange({ target: { name: "photo", value: file } });
  };

  return (
    <div className="add-vehicle-form">
      <h3>Add New Vehicle</h3>
      <form onSubmit={handleAddVehicle}>
        <input type="text" name="name" placeholder="Vehicle Name" required onChange={handleInputChange} />
        <input type="text" name="model" placeholder="Model" required onChange={handleInputChange} />
        <input type="number" name="capacity" placeholder="Capacity (Passengers or Weight in Kg)" required onChange={handleInputChange} />
        <input type="number" name="perKmRate" placeholder="Rate per Km" required onChange={handleInputChange} />
        <input type="text" name="numberplate" placeholder="Number Plate" required onChange={handleInputChange} />

        <select name="type" required onChange={handleInputChange}>
          <option value="">Select Type</option>
          <option value="transport">Transport</option>
          <option value="passenger travel">Passenger Travel</option>
        </select>

        <select name="fuelType" required onChange={handleInputChange}>
          <option value="">Select Fuel Type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="CNG">CNG</option>
          <option value="electric">Electric</option>
        </select>

        <input type="number" name="dimensions.length" placeholder="Length (m)" onChange={handleInputChange} />
        <input type="number" name="dimensions.width" placeholder="Width (m)" onChange={handleInputChange} />
        <input type="number" name="dimensions.height" placeholder="Height (m)" onChange={handleInputChange} />
        <input type="number" name="weightCapacity" placeholder="Max Weight Capacity (Kg)" onChange={handleInputChange} />

        <label>
          <input type="checkbox" name="acAvailable" onChange={handleInputChange} />
          AC Available?
        </label>

        <input type="file" accept="image/*" onChange={handleFileChange} required />

        {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-preview" />}

        <input type="text" name="driver.name" placeholder="Driver Name" required onChange={handleInputChange} />
        <input type="text" name="driver.contact" placeholder="Driver Contact" required onChange={handleInputChange} />
        <input type="text" name="driver.licenseNumber" placeholder="Driver License Number" required onChange={handleInputChange} />

        <button type="submit">Add Vehicle</button>
      </form>

      <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
    </div>
  );
};

export default AddVehicleForm;
