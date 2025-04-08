import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorCard = ({ doctor }) => (
  <div className="doctor-card">
    <img
      src={`http://localhost:4000/${doctor.photo}`}
      alt={`${doctor.firstName} ${doctor.lastName}`}
      className="doctor-photo"
    />
    <h4 className="doctor-name">{`${doctor.firstName} ${doctor.lastName}`}</h4>
    <div className="doctor-details">
      <p>
        <strong>Email:</strong> {doctor.email}
      </p>
      <p>
        <strong>Phone:</strong> {doctor.phone}
      </p>
      <p>
        <strong>DOB:</strong> {doctor.dob && doctor.dob.substring(0, 10)}
      </p>
      <p>
        <strong>Department:</strong> {doctor.doctorDepartment}
      </p>
      <p>
        <strong>Gender:</strong> {doctor.gender}
      </p>
      <p>
        <strong>Available Days:</strong> {doctor.workingDays}
      </p>
      <p>
        <strong>Time:</strong> {doctor.startTime} - {doctor.endTime}
      </p>
    </div>
  </div>
);

export default DoctorCard;
