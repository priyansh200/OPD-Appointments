import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [hasVisited, setHasVisited] = useState(false); // Define hasVisited state

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const navigateTo = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/doctors",
          {
            withCredentials: true,
          }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctorFirstName && doctorLastName) {
      const selectedDoctor = doctors.find(
        (doctor) =>
          doctor.firstName === doctorFirstName &&
          doctor.lastName === doctorLastName &&
          doctor.doctorDepartment === department
      );

      if (selectedDoctor) {
        // Generate available dates based on working days
        const workingDays = selectedDoctor.workingDays.split(",");
        const today = new Date();
        const futureDates = [];

        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dayOfWeek = date.toLocaleDateString("en-US", {
            weekday: "long",
          });
          if (workingDays.includes(dayOfWeek)) {
            futureDates.push({
              date: date.toISOString().split("T")[0],
              status: "available",
            });
          }
        }
        setAvailableDates(futureDates);
      }
    }
  }, [doctorFirstName, doctorLastName, department, doctors]);

  useEffect(() => {
    if (doctorFirstName && doctorLastName && selectedDate) {
      const selectedDoctor = doctors.find(
        (doctor) =>
          doctor.firstName === doctorFirstName &&
          doctor.lastName === doctorLastName &&
          doctor.doctorDepartment === department
      );

      if (selectedDoctor) {
        // Generate available time slots based on working hours
        const startTime = selectedDoctor.startTime;
        const endTime = selectedDoctor.endTime;
        const timeSlots = [];
        const start = new Date(`${selectedDate}T${startTime}`);
        const end = new Date(`${selectedDate}T${endTime}`);

        while (start < end) {
          timeSlots.push({
            time: start.toTimeString().split(" ")[0],
            status: "available",
          });
          start.setMinutes(start.getMinutes() + 30);
        }
        setTimeSlots(timeSlots);
      }
    }
  }, [doctorFirstName, doctorLastName, selectedDate, department, doctors]);

  const handleAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) {
      toast.error("Please select a date and time slot!");
      return;
    }

    try {
      const hasVisitedBool = Boolean(hasVisited);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          dob,
          gender,
          appointment_date: selectedDate,
          appointment_time: selectedTimeSlot,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="number"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <select
            value={department}
            onChange={(e) => {
              const selectedDepartment = e.target.value;
              setDepartment(selectedDepartment);
              setDoctorFirstName("");
              setDoctorLastName("");
            }}
          >
            <option value="">Select Department</option>
            {departmentsArray.map((depart, index) => (
              <option value={depart} key={index}>
                {depart}
              </option>
            ))}
          </select>
          <select
            value={`${doctorFirstName} ${doctorLastName}`}
            onChange={(e) => {
              const [firstName, lastName] = e.target.value.split(" ");
              setDoctorFirstName(firstName);
              setDoctorLastName(lastName);
            }}
            disabled={!department}
          >
            <option value="">Select Doctor</option>
            {doctors
              .filter((doctor) => doctor.doctorDepartment === department)
              .map((doctor) => (
                <option
                  value={`${doctor.firstName} ${doctor.lastName}`}
                  key={doctor._id} // Assuming there's an _id field in the doctor object
                >
                  {doctor.firstName} {doctor.lastName}
                </option>
              ))}
          </select>
        </div>
        <div>
          <h3>Select Appointment Date</h3>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">Select Date</option>
            {availableDates.map((date, index) => (
              <option value={date.date} key={index}>
                {new Date(date.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Select Time Slot</h3>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            <option value="">Select Time Slot</option>
            {timeSlots.map((slot, index) => (
              <option value={slot.time} key={index}>
                {slot.time}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows="10"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />

        <button style={{ margin: "0 auto" }}>GET APPOINTMENT</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
