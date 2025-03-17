import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
  getMedicalHistory,
  addMedicalHistory,
  deleteMedicalHistory,
} from "../api/api";
import Navbar from "../components/Navbar";
import { FaTrash, FaPlusCircle } from "react-icons/fa";

const MedicalHistory = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newHistory, setNewHistory] = useState({
    condition: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch medical history when user is available
  useEffect(() => {
    if (!user?._id) return;

    const fetchHistory = async () => {
      try {
        const historyData = await getMedicalHistory(user._id);
        setHistory(
          historyData.map((entry) => ({
            ...entry,
            date: entry.date ? entry.date.split("T")[0] : "",
          }))
        );
      } catch (err) {
        // console.error("Error fetching medical history:", err);
        setError("Failed to load medical history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleInputChange = (e) => {
    setNewHistory({ ...newHistory, [e.target.name]: e.target.value });
  };

  const handleAddHistory = async (e) => {
    e.preventDefault();
    if (!newHistory.condition || !newHistory.description || !newHistory.date) {
      setError("Please fill in all fields.");
      return;
    }

    setAdding(true);
    try {
      const response = await addMedicalHistory(user._id, newHistory);
      setHistory([...history, { ...newHistory, _id: response.insertedId }]);
      setNewHistory({
        condition: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setError(null);
    } catch (err) {
      // console.error("Error adding medical history:", err);
      setError("Failed to add medical history.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteClick = (historyId) => {
    setDeletingId(historyId);
  };

  const confirmDelete = async () => {
    try {
      await deleteMedicalHistory(user._id, deletingId);
      setHistory(history.filter((entry) => entry._id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      // console.error("Error deleting medical history:", err);
      setError("Failed to delete entry.");
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading medical history...
      </p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto my-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Medical History
        </h2>

        {/* Add New Medical History */}
        <form onSubmit={handleAddHistory} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Condition</label>
            <input
              type="text"
              name="condition"
              value={newHistory.condition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., Asthma, Diabetes"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newHistory.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Brief details about the condition"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={newHistory.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            disabled={adding}
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <FaPlusCircle className="mr-2" /> Add History
              </>
            )}
          </button>
        </form>

        {/* 📜 Medical History List */}
        <div className="mt-6">
          {history.length === 0 ? (
            <p className="text-center text-gray-500">
              No medical history records found.
            </p>
          ) : (
            <ul className="space-y-4">
              {history.map((entry) => (
                <li
                  key={
                    entry._id
                      ? entry._id.toString()
                      : `history-${entry.condition}-${entry.date}`
                  }
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{entry.condition}</p>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                    <p className="text-xs text-gray-400">Date: {entry.date}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteClick(entry._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    disabled={!entry._id}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 🔥 Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="text-gray-600">
              Are you sure you want to delete this record?
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalHistory;

// Best Version After Medical History Working
