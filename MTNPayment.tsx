import { useState } from 'react';
import { Phone, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MTNPaymentProps {
  amount: number;
  purpose: 'farmer' | 'buyer';
  onSuccess: () => void;
  onCancel: () => void;
}

export function MTNPayment({ amount, purpose, onSuccess, onCancel }: MTNPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  const MERCHANT_NUMBER = '0790362220';

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10)
  {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      setStatus('processing');
      setErrorMessage('');

      // Simulate MTN Mobile Money API integration
      // In production, this would call the actual MTN Mobile Money API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // For demo purposes, we'll simulate a successful payment
      // In production, you would integrate with MTN Mobile Money API:
      // https://momodeveloper.mtn.com/
      
      const paymentData = {
        phoneNumber,
        amount,
        merchantNumber: MERCHANT_NUMBER,
        purpose,
        timestamp: new Date().toISOString()
      };

      console.log('Payment initiated:', paymentData);

      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    farmer: {
      title: 'Farmer Activation Fee',
      description: 'Pay 2,500 FRW to activate your account and start listing products',
      benefit: 'This one-time fee gives you access to list products and connect with verified buyers.'
    },
    buyer: {
      title: 'Buyer Verification Fee',
      description: 'Pay 500 FRW to become a verified buyer',
      benefit: 'This fee verifies your account and allows you to connect with farmers and access the community chat.'
    }
  };

  const t = translations[purpose];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        {status === 'success' ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl mb-2 text-gray-900 dark:text-white">Payment Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300">Your account has been activated.</p>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-8">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl mb-2 text-gray-900 dark:text-white">Payment Failed</h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{errorMessage}</p>
            <button
              onClick={() => setStatus('pending')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl mb-2 text-gray-900 dark:text-white">{t.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{t.description}</p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 dark:text-gray-300">Amount to Pay:</span>
                <span className="text-2xl text-green-600 dark:text-green-400">{amount.toLocaleString()} FRW</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Merchant Number:</span>
                <span className="text-gray-900 dark:text-white">{MERCHANT_NUMBER}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t.benefit}</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Your MTN Mobile Money Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="078XXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                You will receive a payment prompt on your phone
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={loading || !phoneNumber}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Pay {amount.toLocaleString()}
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>How it works:</strong> After clicking "Pay", you'll receive a prompt on your MTN Mobile Money phone. 
                Enter your PIN to complete the payment. The amount will be sent to {MERCHANT_NUMBER}.
              </p>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
