/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="aboutImg" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            OPD Window is committed to providing high-quality outpatient care.
            Our skilled team ensures that every patient receives personalized
            attention tailored to their unique needs. We focus on delivering
            efficient and compassionate services, making healthcare accessible
            and comfortable for everyone. Our state-of-the-art facilities and
            experienced professionals work together to offer a seamless and
            supportive healthcare experience.
          </p>
          <p>We are all in 2024!</p>
          <p>We are working on a MERN STACK PROJECT.</p>
          <p>
            At OPD Window, we strive to innovate and improve our services
            continuously. Our use of modern technology and patient-centered
            approaches guarantees that you receive the best care possible. We
            believe in transparency, quality, and dedication to our patients.
            Our goal is to ensure that your visit is not only beneficial but
            also pleasant and stress-free.
          </p>
          <p>OPD Window, your partner in health!</p>
        </div>
      </div>
    </>
  );
};

export default Biography;
