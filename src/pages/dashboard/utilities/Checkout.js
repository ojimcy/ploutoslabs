/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';
import './checkout.css';
import { Button, Container } from 'reactstrap';
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import CheckoutStepper from './CheckoutStepper';
import PaymentMethodSelection from './PaymentMethodSelection';
import { AppContext } from '../../../context/AppContext';
import AirtimeSummary from './AirtimeSummary';
import { buyAirtime } from '../../../lib/server';
import { toast } from 'react-toastify';
import { useCurrentUser } from '../../../hooks/telegram';

function CheckoutPage() {
  const { utilityTransaction } = useContext(AppContext);
  const currentUser = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBuyairtime = async () => {
    try {
      setLoading(true);
      const result = await buyAirtime(
        utilityTransaction.networkProvider,
        utilityTransaction.phoneNumber,
        parseFloat(utilityTransaction.amount)
      );
      console.log(result);
    } catch (error) {
      console.log(error);
      let msg = error?.response?.data?.error;
      toast.error(msg || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
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
          <>
            <AirtimeSummary
              utilityTransaction={utilityTransaction}
              walletBalance={currentUser?.gameWalletBalance}
            />
            <Button
              color="primary"
              block
              className="button-next"
              onClick={handleBuyairtime}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay'}
            </Button>
          </>
        )}
        {currentStep === 2 &&
          paymentMethod === 'wallet' &&
          (utilityTransaction.utilityType === 'airtime' ? (
            <>
              <AirtimeSummary
                utilityTransaction={utilityTransaction}
                walletBalance={currentUser?.gameWalletBalance}
              />
              <Button
                color="primary"
                block
                className="button-next"
                onClick={handleBuyairtime}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay'}
              </Button>
            </>
          ) : (
            ''
          ))}
        {currentStep === 3 && (
          <p>
            Thank you for confirming your payment. Transaction is being
            processed!
          </p>
        )}
        {currentStep === 1 && paymentMethod && (
          <Button className="button-next" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </Container>
  );
}

export default CheckoutPage;
