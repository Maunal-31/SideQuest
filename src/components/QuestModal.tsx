import React, { useState } from 'react';
import type { Quest } from '../types';
import { getCategoryColor, getUrgencyColor } from '../utils/colors';
import { X, Clock, Navigation, Award, Shield, CheckCircle2, Link as LinkIcon, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { acceptQuest, submitQuestProofInFirestore } from '../services/questService';
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

  const locName = quest.location?.name ?? quest.locationZone ?? quest.locationName ?? 'Campus';
  const rewardAmount = quest.reward?.amount ?? quest.rewardAmount ?? 0;
  const rewardType = quest.reward?.type ?? quest.rewardType ?? 'Coins';
  const timeLimit = quest.timeLimit ?? quest.timeLimitStr ?? '2 hours';
  const posterName = quest.poster?.name ?? quest.posterName ?? 'Anonymous Student';
  const posterLevel = quest.poster?.level ?? quest.posterLevel ?? 1;
  const posterAvatar = quest.poster?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(posterName)}`;

  const handleAccept = async () => {
    if (!quest.id) return;
    setIsProcessing(true);
    try {
      const hunterId = authUser?.uid || '';
      const hunterName = userProfile?.name || authUser?.displayName || 'Alex Hunter';
      await acceptQuest(quest.id, hunterId, hunterName);
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
      // Store proofUrl directly in regular Firestore database quests collection (No Firebase Storage)
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
              <div className="w-full py-8 bg-[#EAB308] border-2 border-black brutal-shadow rounded-xl flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-black font-black text-xl uppercase mb-1">Awaiting Escrow Verification...</p>
                {quest.proofUrl && (
                  <a 
                    href={quest.proofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-black uppercase bg-white hover:bg-black hover:text-white text-black px-3 py-1.5 rounded-lg border-2 border-black flex items-center gap-1.5 mt-3 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" strokeWidth={2.5} /> View Submitted Cloud Link
                  </a>
                )}
              </div>
            )}

            {localStatus === 'Verified & Released' && (
              <div className="w-full py-8 bg-[#16A34A] border-2 border-black brutal-shadow rounded-xl flex flex-col items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-white mb-4" strokeWidth={3} />
                <h3 className="text-white font-black text-3xl mb-2 uppercase">Quest Completed!</h3>
                <p className="text-white font-bold text-lg bg-black px-4 py-2 rounded-xl border-2 border-white">
                  +{rewardAmount} {rewardType}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestModal;
