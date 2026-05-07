import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useVerifyPaymentMutation } from '../services/paymentsApi';
import toast from 'react-hot-toast';
import { CheckCircle, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyPayment, { isLoading, isSuccess, isError }] = useVerifyPaymentMutation();

  const sessionId = searchParams.get('session_id');
  const appointmentId = searchParams.get('appointmentId');

  useEffect(() => {
    if (sessionId && appointmentId) {
      verifyPayment({ session_id: sessionId, appointmentId }).unwrap()
        .then(() => {
          toast.success('Payment Verified!');
        })
        .catch(() => {
          toast.error('Payment verification failed');
        });
    }
  }, [sessionId, appointmentId, verifyPayment]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      {isLoading ? (
        <>
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Verifying Payment...</h2>
          <p className="text-slate-500 mt-2">Please wait while we confirm your transaction with Stripe.</p>
        </>
      ) : isSuccess ? (
        <>
          <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
          <p className="text-slate-500 mt-2">Your appointment has been confirmed.</p>
          <button 
            onClick={() => navigate('/appointments')}
            className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Go to Appointments
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">!</div>
          <h2 className="text-2xl font-bold text-slate-800">Verification Problem</h2>
          <p className="text-slate-500 mt-2">We couldn't verify your payment. If the money was deducted, please contact support.</p>
          <button 
            onClick={() => navigate('/appointments')}
            className="mt-8 bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-900 transition"
          >
            Return to Appointments
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
