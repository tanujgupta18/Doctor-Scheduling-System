import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { FaCalendarCheck, FaUserInjured, FaClock } from "react-icons/fa";

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    appointmentsToday: 0,
    totalPatients: 0,
    availableSlots: 0,
  });

  useEffect(() => {
    // Simulated fetch or real API call
    setStats({
      appointmentsToday: 5,
      totalPatients: 10,
      availableSlots: 3,
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="h-[85vh] bg-gray-100 flex flex-col items-center justify-center py-10">
        <div className="bg-white p-6 rounded-lg shadow max-w-3xl w-full">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Welcome Dr. {user?.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            <div className="bg-blue-600 rounded-lg p-4 flex flex-col items-center">
              <FaCalendarCheck className="text-3xl mb-2" />
              <p className="text-xl font-semibold">{stats.appointmentsToday}</p>
              <p className="text-sm">Appointments Today</p>
            </div>

            <div className="bg-green-600 rounded-lg p-4 flex flex-col items-center">
              <FaUserInjured className="text-3xl mb-2" />
              <p className="text-xl font-semibold">{stats.totalPatients}</p>
              <p className="text-sm">Total Patients</p>
            </div>

            <div className="bg-purple-600 rounded-lg p-4 flex flex-col items-center">
              <FaClock className="text-3xl mb-2" />
              <p className="text-xl font-semibold">{stats.availableSlots}</p>
              <p className="text-sm">Available Slots</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;
