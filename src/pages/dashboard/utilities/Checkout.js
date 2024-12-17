import React, { useState } from 'react';
import './checkout.css';
import { Container } from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import CheckoutStepper from './CheckoutStepper';
import PaymentMethodSelection from './PaymentMethodSelection';
import CryptoPayment from './CryptoPayment';

function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <Container className="checkout-page">
      <TelegramBackButton />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <CheckoutStepper currentStep={currentStep} />
        {currentStep === 1 && (
          <PaymentMethodSelection
            onSelect={(method) => setPaymentMethod(method)}
          />
        )}
        {currentStep === 2 && paymentMethod === 'crypto' && (
          <CryptoPayment onConfirm={handleNext} />
        )}
        {currentStep === 2 && paymentMethod === 'wallet' && (
          <p>Your wallet will be charged directly.</p>
        )}
        {currentStep === 3 && (
          <p>
            Thank you for confirming your payment. Transaction is being
            processed!
          </p>
        )}
        {currentStep === 1 && paymentMethod && (
          <button className="button-next" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </Container>
  );
}

export default CheckoutPage;
