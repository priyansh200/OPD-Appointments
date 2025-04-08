import React from "react";
import Hero from "../components/Hero";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

const Bookings = () => {
  return (
    <>
      <Hero
        title={"Look At Your Previous Appointments"}
        imageUrl={"/services.png"}
      />
      <AppointmentList />
    </>
  );
};

export default Bookings;
