import React from 'react';
import PropTypes from 'prop-types';
import './checkout.css';

const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index <= currentStep ? 'active' : ''}`}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-title">{step}</div>
          {index < steps.length - 1 && <div className="step-divider"></div>}
        </div>
      ))}
    </div>
  );
};
Stepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Stepper;
