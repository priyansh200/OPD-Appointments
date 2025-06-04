import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorCard from "../components/DoctorCard";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/api/v1/user/doctors",
          { withCredentials: true } // Consider secure auth approach
        );
        setDoctors(data.doctors);
      } catch (error) {
        // Handle error here, display message or loading state
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="page_doctors">
      <h1>DOCTORS</h1>
      <div className="banner">
        {doctors && doctors.length > 0 ? (
          doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))
        ) : (
          <h1>No Registered Doctors Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Doctors;
