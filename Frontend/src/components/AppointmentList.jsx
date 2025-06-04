import React, { useEffect, useState } from "react";
import axios from "axios";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/appointment/getPatientAppointments",
          {
            withCredentials: true,
          }
        );
        console.log("Fetched data:", data); // Log the data to check its structure
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          console.error("Expected an array but received:", data);
        }
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="bookings">
      <h1>Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table className="appointment-list">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td>
                  {appointment.firstName} {appointment.lastName}
                </td>
                <td>
                  {new Date(appointment.appointment_date).toLocaleDateString()}
                </td>
                <td>{appointment.appointment_time}</td>
                <td>
                  {appointment.doctor.firstName} {appointment.doctor.lastName}
                </td>
                <td>{appointment.department}</td>
                <td className={`status-${appointment.status.toLowerCase()}`}>
                  {appointment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;
