/* eslint-disable react/prop-types */
import React from 'react';
import './checkout.css';
import { FaCheck } from 'react-icons/fa';

function CheckoutStepper({ currentStep }) {
  const steps = ['Payment Method', 'Payment Details', 'Confirmation'];

  return (
    <div className="stepper">
      {steps.map((title, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <div key={stepNumber} className="step">
            <div
              className={`step-number ${
                isCompleted ? 'completed' : isActive ? 'active' : 'inactive'
              }`}
            >
              {isCompleted ? <FaCheck /> : stepNumber}
            </div>
            <div className="step-title">{title}</div>
            {stepNumber < steps.length && (
              <div
                className={`step-divider ${isCompleted ? 'active' : ''}`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CheckoutStepper;
