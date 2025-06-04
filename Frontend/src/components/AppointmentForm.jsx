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
  const [department, setDepartment] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

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
          "http://localhost:3000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error("Failed to fetch doctors");
      }
    };
    fetchDoctors();
  }, []);

  // Generate available dates when doctor is selected
  useEffect(() => {
    if (doctorId) {
      const selectedDoctor = doctors.find((doc) => doc._id === doctorId);
      if (selectedDoctor) {
        const workingDays = selectedDoctor.workingDays.split(",");
        const today = new Date();
        const futureDates = [];

        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const day = date.toLocaleDateString("en-US", { weekday: "long" });
          if (workingDays.includes(day)) {
            futureDates.push({
              date: date.toISOString().split("T")[0],
              status: "available",
            });
          }
        }
        setAvailableDates(futureDates);
      }
    }
  }, [doctorId, doctors]);

  // Generate time slots
  useEffect(() => {
    if (doctorId && selectedDate) {
      const selectedDoctor = doctors.find((doc) => doc._id === doctorId);
      if (selectedDoctor) {
        const start = new Date(`${selectedDate}T${selectedDoctor.startTime}`);
        const end = new Date(`${selectedDate}T${selectedDoctor.endTime}`);
        const slots = [];

        while (start < end) {
          slots.push({
            time: start.toTimeString().split(" ")[0],
            status: "available",
          });
          start.setMinutes(start.getMinutes() + 30);
        }
        setTimeSlots(slots);
      }
    }
  }, [doctorId, selectedDate, doctors]);

  const handleAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot || !doctorId) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const selectedDoctor = doctors.find((doc) => doc._id === doctorId);
      const response = await axios.post(
        "http://localhost:3000/api/v1/appointment/post",
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
          doctor_firstName: selectedDoctor.firstName,
          doctor_lastName: selectedDoctor.lastName,
          hasVisited: Boolean(hasVisited),
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      navigateTo("/");

      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setGender("");
      setDepartment("");
      setDoctorId("");
      setAddress("");
      setSelectedDate("");
      setTimeSlots([]);
      setAvailableDates([]);
      setSelectedTimeSlot("");
      setHasVisited(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="tel" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <input type="date" placeholder="DOB" value={dob} onChange={(e) => setDob(e.target.value)} />
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
              setDepartment(e.target.value);
              setDoctorId("");
              setSelectedDate("");
              setSelectedTimeSlot("");
            }}
          >
            <option value="">Select Department</option>
            {departmentsArray.map((dept, i) => (
              <option value={dept} key={i}>{dept}</option>
            ))}
          </select>

          <select
            value={doctorId}
            onChange={(e) => {
              setDoctorId(e.target.value);
              setSelectedDate("");
              setSelectedTimeSlot("");
            }}
            disabled={!department}
          >
            <option value="">Select Doctor</option>
            {doctors
              .filter((doc) => doc.doctorDepartment === department)
              .map((doc) => (
                <option value={doc._id} key={doc._id}>
                  {doc.firstName} {doc.lastName}
                </option>
              ))}
          </select>
        </div>
        <div>
          <h3>Select Appointment Date</h3>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            disabled={!doctorId}
          >
            <option value="">Select Date</option>
            {availableDates.map((d, i) => (
              <option value={d.date} key={i}>
                {new Date(d.date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Select Time Slot</h3>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            disabled={!selectedDate}
          >
            <option value="">Select Time Slot</option>
            {timeSlots.map((slot, i) => (
              <option value={slot.time} key={i}>
                {slot.time}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows="4"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
            />
            Visited Before
          </label>
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Get Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
