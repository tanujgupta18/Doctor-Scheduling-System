import React, { useState } from "react";

const ProfileForm = ({ profileData, handleChange, handleSubmit, fields }) => {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    fields.forEach((field) => {
      if (!profileData[field.name] && field.required) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await handleSubmit();
      alert("Profile Updated Successfully!");
    } catch (error) {
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <form onSubmit={onSubmit} aria-live="polite">
        {fields.map((field) => (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={profileData[field.name] || ""}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={profileData[field.name] || ""}
                onChange={handleChange}
                className={`border p-2 w-full ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                placeholder={field.placeholder}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
