import React, { useState } from 'react';
import type { Quest } from '../types';
import { getCategoryColor, getUrgencyColor } from '../utils/colors';
import { X, Clock, Navigation, Award, Shield, CheckCircle2, Link as LinkIcon, ExternalLink, Loader2, Check, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { acceptQuest, submitQuestProofInFirestore, updateQuestStatusInFirestore } from '../services/questService';
import { awardBountyToHunter } from '../services/userService';
import PaymentModal from './PaymentModal';
import { toast } from 'react-toastify';

interface QuestModalProps {
  quest: Quest | any;
  onClose: () => void;
}

const QuestModal: React.FC<QuestModalProps> = ({ quest, onClose }) => {
  const { currentUser: authUser, userProfile } = useAuth();

  const [localStatus, setLocalStatus] = useState<Quest['status']>(quest.status);
  const [proofLink, setProofLink] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const locName = quest.location?.name ?? quest.locationZone ?? quest.locationName ?? 'Campus';
  const rewardAmount = quest.reward?.amount ?? quest.rewardAmount ?? 0;
  const rewardType = quest.reward?.type ?? quest.rewardType ?? 'Coins';
  const timeLimit = quest.timeLimit ?? quest.timeLimitStr ?? '2 hours';
  const posterName = quest.poster?.name ?? quest.posterName ?? 'Anonymous Student';
  const posterLevel = quest.poster?.level ?? quest.posterLevel ?? 1;
  const posterAvatar = quest.poster?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(posterName)}`;

  const currentUserId = authUser?.uid || '';
  const currentUserName = userProfile?.name || authUser?.displayName || 'Hunter';

  const isPoster = quest.posterId === currentUserId || posterName.toLowerCase() === currentUserName.toLowerCase();
  const isRupees = rewardType === 'Rupees' || rewardType === 'Rupee';

  const handleAccept = async () => {
    if (!quest.id) return;
    setIsProcessing(true);
    try {
      await acceptQuest(quest.id, currentUserId, currentUserName);
      setLocalStatus('In Progress');
      toast.success('QUEST ACCEPTED! LFG 🚀');
    } catch (error) {
      console.error('Failed to accept quest in Firestore:', error);
      toast.error('Failed to accept quest. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!quest.id) return;

    if (!proofLink.trim()) {
      toast.error('Please paste a valid Google Drive or Cloud link.');
      return;
    }

    setIsProcessing(true);

    try {
      // Store proofUrl directly in regular Firestore database quests collection
      await submitQuestProofInFirestore(quest.id, proofLink.trim(), 'Google Drive / Cloud Link');

      setLocalStatus('Submitted');
      toast.success('Proof link saved to Firestore for verification! 🕵️');
    } catch (error) {
      console.error('Failed to save proof link in Firestore:', error);
      toast.error('Failed to submit proof. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Poster approves submitted proof and releases escrow bounty to hunter
  const handleApproveEscrow = async () => {
    if (!quest.id) return;
    setIsProcessing(true);

    try {
      // 1. Award bounty XP & Coins to hunter in Firestore
      if (quest.hunterId) {
        await awardBountyToHunter(quest.hunterId, rewardAmount, rewardType);
      }

      // 2. Update quest status in Firestore
      await updateQuestStatusInFirestore(quest.id, 'Verified & Released');

      setLocalStatus('Verified & Released');
      toast.success(`ESCROW VERIFIED! Released ${rewardAmount} ${rewardType} to Hunter! 💸✨`);

      // If Rupee bounty, automatically prompt UPI payment portal
      if (isRupees) {
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error('Failed to approve escrow in Firestore:', error);
      toast.error('Failed to release bounty. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Poster rejects proof and sets quest back to In Progress
  const handleRejectEscrow = async () => {
    if (!quest.id) return;
    setIsProcessing(true);

    try {
      await updateQuestStatusInFirestore(quest.id, 'In Progress');
      setLocalStatus('In Progress');
      toast.warn('Proof rejected. Quest sent back for hunter re-submission.');
    } catch (error) {
      console.error('Failed to reject escrow in Firestore:', error);
      toast.error('Failed to update quest status.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden relative flex flex-col max-h-[90vh] brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-200 opacity-80 border border-black z-20 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"></div>

        {/* Header */}
        <div className="p-6 border-b-4 border-black flex justify-between items-start relative bg-[#F3F1EB]">
          <div className="relative z-10 pt-4">
            <div className="flex gap-2 mb-4">
              <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md ${getCategoryColor(quest.category)}`}>
                {quest.category}
              </span>
              <span className={`text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-md ${getUrgencyColor(quest.urgency)}`}>
                {quest.urgency}
              </span>
            </div>
            <h2 className="text-3xl font-black text-black uppercase leading-tight">{quest.title}</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="relative z-10 p-2 bg-white brutal-border brutal-shadow-sm hover:translate-y-1 transition-transform cursor-pointer"
          >
            <X className="w-6 h-6 text-black" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3 bg-[#60A5FA] p-3 rounded-xl brutal-border brutal-shadow-sm">
              <Clock className="w-6 h-6 text-black" strokeWidth={3} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-black font-black">Time Limit</p>
                <p className="text-sm font-bold text-white">{timeLimit}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#16A34A] p-3 rounded-xl brutal-border brutal-shadow-sm">
              <Navigation className="w-6 h-6 text-black" strokeWidth={3} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-black font-black">Location</p>
                <p className="text-sm font-bold text-white">{locName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#EAB308] p-3 rounded-xl brutal-border brutal-shadow-sm">
              <Award className="w-6 h-6 text-black" strokeWidth={3} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-black font-black">Bounty</p>
                <p className="text-sm font-black text-black">{rewardAmount} {rewardType}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg uppercase tracking-wider text-black font-black mb-3 border-b-4 border-black pb-1 inline-block">
              Quest Details
            </h3>
            <p className="text-black font-bold leading-relaxed text-lg bg-gray-50 p-4 rounded-xl brutal-border">
              {quest.description}
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between bg-white border-2 border-dashed border-gray-400 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <img src={posterAvatar} alt="poster" className="w-12 h-12 rounded-full border-2 border-black bg-[#C084FC] brutal-shadow-sm object-cover" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Posted By</p>
                <div className="flex items-center gap-2">
                  <span className="font-black text-black text-lg">{posterName}</span>
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-md font-bold">
                    Lvl {posterLevel}
                  </span>
                </div>
              </div>
            </div>
            {quest.hunterName && (
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Assigned Hunter</p>
                <span className="font-black text-[#16A34A] text-sm bg-green-100 px-2 py-1 rounded border border-black inline-block">
                  {quest.hunterName}
                </span>
              </div>
            )}
          </div>

          {/* Action Area based on Status */}
          <div className="mt-8 pt-6 border-t-4 border-black">
            {localStatus === 'Open' && (
              <button 
                id="tour-accept-btn"
                onClick={handleAccept}
                disabled={isProcessing}
                className="w-full py-5 bg-[#C084FC] hover:bg-black hover:text-white text-black font-black rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover text-2xl uppercase tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? 'Accepting...' : 'Accept Quest'} <Shield className="w-6 h-6" strokeWidth={3} />
              </button>
            )}

            {localStatus === 'In Progress' && (
              <div className="space-y-4">
                <div className="space-y-2 bg-gray-50 p-4 rounded-xl brutal-border">
                  <label className="block text-xs font-black uppercase text-black">
                    Proof Cloud / Google Drive Link
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={proofLink}
                      onChange={(e) => setProofLink(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... or photos link"
                      className="w-full bg-white brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-black text-black placeholder:text-gray-600 focus:outline-none focus:bg-[#EAB308]/20 transition-all text-sm"
                    />
                    <LinkIcon className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5 pointer-events-none" strokeWidth={2.5} />
                  </div>
                  <p className="text-[11px] font-bold text-gray-500">
                    Paste a public Google Drive, Dropbox, or Cloud link as proof. Saved in our regular database.
                  </p>
                </div>

                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing || !proofLink.trim()}
                  className={`w-full py-5 font-black rounded-xl transition-all text-xl uppercase brutal-border flex items-center justify-center gap-2
                    ${!isProcessing && proofLink.trim() ? 'bg-black text-white brutal-shadow brutal-shadow-hover cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Saving to Database...
                    </>
                  ) : (
                    'Submit For Verification'
                  )}
                </button>
              </div>
            )}

            {localStatus === 'Submitted' && (
              <div className="w-full p-6 bg-[#EAB308] border-4 border-black brutal-shadow rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <h3 className="text-black font-black text-2xl uppercase">Awaiting Escrow Verification</h3>
                </div>

                {/* View Submitted Link Option */}
                {quest.proofUrl && (
                  <a 
                    href={quest.proofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black uppercase bg-white hover:bg-black hover:text-white text-black px-4 py-2.5 rounded-xl border-2 border-black flex items-center gap-2 transition-colors brutal-shadow-sm cursor-pointer"
                  >
                    <ExternalLink className="w-4.5 h-4.5 text-[#2563EB]" strokeWidth={2.5} /> View Submitted Cloud Link
                  </a>
                )}

                {/* Verification Controls */}
                {isPoster ? (
                  <div className="w-full pt-4 border-t-2 border-black space-y-3">
                    <p className="text-xs font-black uppercase text-black">
                      You are the poster of this quest ({posterName}). Review the submitted link above and release escrow:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleApproveEscrow}
                        disabled={isProcessing}
                        className="flex-1 py-3.5 bg-[#16A34A] hover:bg-black text-white font-black uppercase text-sm rounded-xl brutal-border brutal-shadow hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" strokeWidth={3} />}
                        Approve & Release Bounty ({rewardAmount} {rewardType})
                      </button>
                      <button
                        onClick={handleRejectEscrow}
                        disabled={isProcessing}
                        className="py-3.5 px-4 bg-red-100 hover:bg-red-500 hover:text-white text-black font-black uppercase text-xs rounded-xl brutal-border transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Reject Proof
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full pt-4 border-t-2 border-black space-y-3">
                    <p className="text-xs font-bold text-black/90 bg-white/60 p-2.5 rounded-lg border border-black">
                      The quest poster <strong className="uppercase font-black text-black">{posterName}</strong> is reviewing the submitted proof link. Once approved, <strong className="font-black text-black">{rewardAmount} {rewardType}</strong> will be credited directly to your profile.
                    </p>
                    
                    <button
                      onClick={handleApproveEscrow}
                      disabled={isProcessing}
                      className="text-xs font-black uppercase bg-white hover:bg-black hover:text-white text-black px-4 py-2 rounded-xl border-2 border-black transition-colors cursor-pointer flex items-center gap-1.5 mx-auto"
                    >
                      {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4 text-[#16A34A]" strokeWidth={3} />}
                      Verify & Release Bounty (Demo / Poster Action)
                    </button>
                  </div>
                )}
              </div>
            )}

            {localStatus === 'Verified & Released' && (
              <div className="w-full p-8 bg-[#16A34A] border-4 border-black brutal-shadow rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
                <h3 className="text-white font-black text-3xl uppercase leading-none">Quest Completed!</h3>
                
                <div className="bg-black text-white px-5 py-2.5 rounded-xl border-2 border-white font-black text-lg uppercase tracking-wider">
                  +{rewardAmount} {rewardType} Released
                </div>

                {/* Permanent Option to View Submitted Proof Link */}
                {quest.proofUrl && (
                  <a 
                    href={quest.proofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black uppercase bg-white hover:bg-black hover:text-white text-black px-4 py-2.5 rounded-xl border-2 border-black flex items-center gap-2 transition-all brutal-shadow-sm cursor-pointer mt-2"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={2.5} /> View Submitted Proof Link
                  </a>
                )}

                {/* Functional UPI Payment System Gateway Button for Rupees Bounties */}
                {isRupees && (
                  <div className="pt-4 border-t-2 border-white/40 w-full flex flex-col items-center">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full py-3.5 bg-[#EAB308] hover:bg-black hover:text-white text-black font-black uppercase text-sm rounded-xl brutal-border brutal-shadow hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-5 h-5 text-black" strokeWidth={2.5} />
                      Pay / Settle ₹{rewardAmount} via UPI (GPay / PhonePe / Paytm)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rupee UPI Payment Portal Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={rewardAmount}
          questTitle={quest.title}
          recipientName={quest.hunterName || 'Quest Hunter'}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            setShowPaymentModal(false);
            toast.success(`Rupee payment of ₹${rewardAmount} settled via UPI! 📲💸`);
          }}
        />
      )}
    </div>
  );
};

export default QuestModal;
