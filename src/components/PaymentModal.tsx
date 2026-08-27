import React, { useState } from 'react';
import { X, CheckCircle2, Copy, ExternalLink, QrCode, CreditCard, ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';
import { toast } from 'react-toastify';

interface PaymentModalProps {
  amount: number;
  questTitle: string;
  recipientName: string;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  amount,
  questTitle,
  recipientName,
  onClose,
  onPaymentSuccess
}) => {
  const [upiId, setUpiId] = useState('ldce.sidequest@upi');
  const [customUpi, setCustomUpi] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success'>('pending');

  const targetUpi = customUpi.trim() || upiId;
  const note = encodeURIComponent(`SideQuest Bounty: ${questTitle.slice(0, 30)}`);
  
  // Standard Indian UPI Deep Link URI
  const upiLink = `upi://pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(recipientName || 'SideQuest Hunter')}&am=${amount}&cu=INR&tn=${note}`;

  // QR Code image URL encoding the UPI payment string
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}&color=000000&bgcolor=ffffff`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(targetUpi);
    setCopied(true);
    toast.success('UPI ID copied to clipboard! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAppRedirect = (appName: string, schemePrefix?: string) => {
    toast.info(`Redirecting to ${appName}... 📲`);
    
    let redirectUrl = upiLink;
    if (schemePrefix === 'gpay') {
      redirectUrl = `gpay://upi/pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${note}`;
    } else if (schemePrefix === 'phonepe') {
      redirectUrl = `phonepe://pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${note}`;
    } else if (schemePrefix === 'paytm') {
      redirectUrl = `paytmmp://pay?pa=${encodeURIComponent(targetUpi)}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${note}`;
    }

    try {
      window.location.href = redirectUrl;
    } catch (e) {
      console.warn('UPI App redirect fallback:', e);
      window.open(upiLink, '_blank');
    }
  };

  const handleConfirmPaid = () => {
    setPaymentStatus('success');
    toast.success(`Payment of ₹${amount} confirmed! 💸✨`);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden relative flex flex-col brutal-border shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
        
        {/* Header */}
        <div className="p-6 border-b-4 border-black bg-[#16A34A] flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black text-white rounded-xl brutal-border">
              <CreditCard className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">UPI Payment Portal</h2>
              <p className="text-xs font-bold opacity-90">Instant INR Bounty Settlement</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white text-black rounded-xl brutal-border brutal-shadow-sm hover:translate-y-1 transition-transform"
          >
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh] space-y-6 bg-white">
          
          {paymentStatus === 'pending' ? (
            <>
              {/* Amount Display */}
              <div className="bg-[#EAB308] border-4 border-black p-5 rounded-2xl text-center brutal-shadow">
                <p className="text-xs font-black uppercase text-black/80 tracking-wider mb-1">Total Bounty Amount</p>
                <div className="text-4xl md:text-5xl font-black text-black leading-none">
                  ₹{amount} <span className="text-base font-bold uppercase text-black">INR</span>
                </div>
                <p className="text-xs font-bold text-black mt-2 bg-white/70 py-1 px-3 rounded-lg border border-black inline-block">
                  Recipient: <span className="font-black uppercase">{recipientName}</span>
                </p>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-black rounded-2xl">
                <div className="bg-white p-3 brutal-border brutal-shadow-sm rounded-xl mb-3">
                  <img src={qrCodeUrl} alt="UPI QR Code" className="w-44 h-44 object-contain" />
                </div>
                <p className="text-xs font-black text-black uppercase flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-[#16A34A]" strokeWidth={2.5} /> Scan with GPay / PhonePe / Paytm / BHIM
                </p>
              </div>

              {/* UPI App Redirection Buttons */}
              <div>
                <p className="text-xs font-black uppercase text-black mb-3 flex items-center gap-1">
                  <Smartphone className="w-4 h-4 text-black" strokeWidth={2.5} /> Pay Directly via Installed UPI App:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAppRedirect('Google Pay', 'gpay')}
                    className="p-3 bg-[#60A5FA] hover:bg-black hover:text-white text-black font-black uppercase text-xs rounded-xl brutal-border brutal-shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Google Pay 📲
                  </button>
                  <button
                    onClick={() => handleAppRedirect('PhonePe', 'phonepe')}
                    className="p-3 bg-[#C084FC] hover:bg-black hover:text-white text-black font-black uppercase text-xs rounded-xl brutal-border brutal-shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    PhonePe 🟣
                  </button>
                  <button
                    onClick={() => handleAppRedirect('Paytm', 'paytm')}
                    className="p-3 bg-sky-200 hover:bg-black hover:text-white text-black font-black uppercase text-xs rounded-xl brutal-border brutal-shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Paytm 🔵
                  </button>
                  <button
                    onClick={() => handleAppRedirect('Any UPI App')}
                    className="p-3 bg-amber-200 hover:bg-black hover:text-white text-black font-black uppercase text-xs rounded-xl brutal-border brutal-shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    BHIM / Other ⚡
                  </button>
                </div>
              </div>

              {/* UPI VPA Field */}
              <div className="bg-gray-50 p-4 rounded-xl brutal-border space-y-2">
                <label className="block text-xs font-black uppercase text-black">
                  Enter Hunter's Custom UPI ID / VPA
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customUpi}
                    onChange={(e) => setCustomUpi(e.target.value)}
                    placeholder="e.g. 9876543210@ybl or name@okicici"
                    className="flex-1 bg-white brutal-border brutal-shadow-sm rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none"
                  />
                  <button
                    onClick={handleCopyUpi}
                    className="px-3 py-2 bg-black text-white font-bold text-xs rounded-xl brutal-border flex items-center gap-1 hover:bg-gray-800"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Confirm Paid Button */}
              <button
                onClick={handleConfirmPaid}
                className="w-full py-4 bg-[#16A34A] hover:bg-black text-white font-black text-lg uppercase rounded-xl brutal-border brutal-shadow brutal-shadow-hover transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-6 h-6" strokeWidth={2.5} /> Mark ₹{amount} Payment Complete
              </button>
            </>
          ) : (
            /* Success State */
            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 bg-[#16A34A] rounded-full border-4 border-black flex items-center justify-center mx-auto brutal-shadow">
                <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black text-black uppercase">Payment Successful!</h3>
              <p className="text-base font-bold text-black bg-gray-100 p-3 rounded-xl brutal-border">
                ₹{amount} INR has been transferred to {recipientName}.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-black text-white font-black uppercase text-sm rounded-xl brutal-border brutal-shadow hover:translate-y-1 transition-all"
              >
                Close Payment Portal
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
