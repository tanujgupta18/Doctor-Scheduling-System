import React from "react";
import { FaTrash } from "react-icons/fa";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AvailabilityEditor = ({ availability, setAvailability }) => {
  const handleAddWeekday = () => {
    setAvailability([
      ...availability,
      {
        type: "weekday",
        days: [],
        slots: [],
      },
    ]);
  };

  const handleAddDateRange = () => {
    setAvailability([
      ...availability,
      {
        type: "daterange",
        from: "",
        to: "",
        slots: [],
      },
    ]);
  };

  const handleSlotChange = (index, slotIndex, value) => {
    const updated = [...availability];
    updated[index].slots[slotIndex] = value;
    setAvailability(updated);
  };

  const handleAddSlot = (index) => {
    const updated = [...availability];
    updated[index].slots.push("");
    setAvailability(updated);
  };

  const handleRemoveSlot = (index, slotIndex) => {
    const updated = [...availability];
    updated[index].slots.splice(slotIndex, 1);
    setAvailability(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleWeekdayChange = (index, day) => {
    const updated = [...availability];
    const currentDays = updated[index].days || [];
    updated[index].days = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setAvailability(updated);
  };

  const handleRemoveBlock = (index) => {
    const updated = [...availability];
    updated.splice(index, 1);
    setAvailability(updated);
  };

  return (
    <div className="mt-6">
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleAddWeekday}
        >
          + Weekday
        </button>
        <button
          type="button"
          className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
          onClick={handleAddDateRange}
        >
          + Date Range
        </button>
      </div>

      {availability.map((block, index) => (
        <div key={index} className="border p-4 mb-4 rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold capitalize">
              {block.type} availability
            </h4>
            <button
              type="button"
              onClick={() => handleRemoveBlock(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>

          {block.type === "weekday" && (
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Select Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <label key={day} className="text-sm">
                    <input
                      type="checkbox"
                      checked={block.days?.includes(day)}
                      onChange={() => handleWeekdayChange(index, day)}
                      className="mr-1"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          )}

          {block.type === "daterange" && (
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium">From</label>
                <input
                  type="date"
                  value={block.from}
                  onChange={(e) => handleChange(index, "from", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">To</label>
                <input
                  type="date"
                  value={block.to}
                  onChange={(e) => handleChange(index, "to", e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            </div>
          )}

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Time Slots</label>
            {block.slots.map((slot, slotIndex) => (
              <div key={slotIndex} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={slot}
                  placeholder="e.g. 10:00–10:30"
                  onChange={(e) =>
                    handleSlotChange(index, slotIndex, e.target.value)
                  }
                  className="flex-1 px-2 py-1 border rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBlock(index)}
                  className="text-red-500 hover:text-red-600 text-lg"
                  title="Delete block"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 text-sm mt-1"
              onClick={() => handleAddSlot(index)}
            >
              + Add Slot
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AvailabilityEditor;
