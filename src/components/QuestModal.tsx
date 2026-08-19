import React, { useState } from 'react';
import type { Quest } from '../types';
import { getCategoryColor, getUrgencyColor } from '../utils/colors';
import { X, Clock, Navigation, Award, Shield, CheckCircle2, UploadCloud, Sticker } from 'lucide-react';
import { useSideQuest } from '../context/SideQuestContext';
import { toast } from 'react-toastify';

interface QuestModalProps {
  quest: Quest;
  onClose: () => void;
}

const QuestModal: React.FC<QuestModalProps> = ({ quest, onClose }) => {
  const { updateQuestStatus } = useSideQuest();
  const [localStatus, setLocalStatus] = useState<Quest['status']>(quest.status);
  const [proofUploaded, setProofUploaded] = useState(false);

  const handleAccept = () => {
    updateQuestStatus(quest.id, 'In Progress');
    setLocalStatus('In Progress');
    toast.success('QUEST ACCEPTED! LFG 🚀');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setProofUploaded(true);
    toast.info('Proof attached 📎');
  };

  const handleSubmit = () => {
    updateQuestStatus(quest.id, 'Submitted');
    setLocalStatus('Submitted');
    toast.success('Sent for review! 🕵️');
    setTimeout(() => {
      updateQuestStatus(quest.id, 'Verified & Released');
      setLocalStatus('Verified & Released');
      toast.success(`BOUNTY SECURED: ${quest.reward.amount} ${quest.reward.type}! 💸`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden relative flex flex-col max-h-[90vh] brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)] rotate-[-1deg]">
        
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-200 opacity-80 rotate-3 border border-black z-20 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"></div>

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
            className="relative z-10 p-2 bg-white brutal-border brutal-shadow-sm hover:translate-y-1 transition-transform"
          >
            <X className="w-6 h-6 text-black" strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-3 bg-[#60A5FA] p-3 rounded-xl brutal-border brutal-shadow-sm rotate-1 hover:rotate-0">
              <Clock className="w-6 h-6 text-black" strokeWidth={3} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-black font-black">Time Limit</p>
                <p className="text-sm font-bold text-white">{quest.timeLimit}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-[#16A34A] p-3 rounded-xl brutal-border brutal-shadow-sm rotate-[-1deg] hover:rotate-0">
              <Navigation className="w-6 h-6 text-black" strokeWidth={3} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-black font-black">Location</p>
                <p className="text-sm font-bold text-white">{quest.location.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#EAB308] p-3 rounded-xl brutal-border brutal-shadow-sm rotate-2 hover:rotate-0">
              <Award className="w-6 h-6 text-black" strokeWidth={3} />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-black font-black">Bounty</p>
                <p className="text-sm font-black text-black">{quest.reward.amount} {quest.reward.type}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg uppercase tracking-wider text-black font-black mb-3 border-b-4 border-black pb-1 inline-block">
              Quest Details
            </h3>
            <p className="text-black font-medium leading-relaxed text-lg bg-gray-50 p-4 rounded-xl brutal-border">
              {quest.description}
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between bg-white border-2 border-dashed border-gray-400 p-4 rounded-xl">
            <div className="flex items-center gap-4">
              <img src={quest.poster.avatar} alt="poster" className="w-12 h-12 rounded-full border-2 border-black bg-[#C084FC] brutal-shadow-sm" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-black">Posted By</p>
                <div className="flex items-center gap-2">
                  <span className="font-black text-black text-lg">{quest.poster.name}</span>
                  <span className="text-xs bg-black text-white px-2 py-1 rounded-md font-bold">
                    Lvl {quest.poster.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area based on Status */}
          <div className="mt-8 pt-6 border-t-4 border-black">
            {localStatus === 'Open' && (
              <button 
                onClick={handleAccept}
                className="w-full py-5 bg-[#C084FC] hover:bg-black hover:text-white text-black font-black rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover text-2xl uppercase tracking-wider flex items-center justify-center gap-3"
              >
                Accept Quest <Shield className="w-6 h-6" strokeWidth={3} />
              </button>
            )}

            {localStatus === 'In Progress' && (
              <div className="space-y-4">
                <div 
                  className={`w-full border-4 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer font-bold
                    ${proofUploaded ? 'border-black bg-[#16A34A] text-white' : 'border-black hover:bg-gray-100 text-black'}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => setProofUploaded(true)}
                >
                  {proofUploaded ? (
                    <>
                      <CheckCircle2 className="w-12 h-12 mb-3" strokeWidth={3} />
                      <p className="text-xl">Proof Attached!</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 mb-3" strokeWidth={3} />
                      <p className="text-lg mb-1 uppercase font-black">Drop Proof Here</p>
                      <p className="text-sm">Click to upload photo or pdf</p>
                    </>
                  )}
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={!proofUploaded}
                  className={`w-full py-5 font-black rounded-xl transition-all text-xl uppercase brutal-border
                    ${proofUploaded ? 'bg-black text-white brutal-shadow brutal-shadow-hover' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                >
                  Submit For Verification
                </button>
              </div>
            )}

            {localStatus === 'Submitted' && (
              <div className="w-full py-8 bg-[#EAB308] border-2 border-black brutal-shadow rounded-xl flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-black font-black text-xl uppercase">Awaiting Escrow Verification...</p>
              </div>
            )}

            {localStatus === 'Verified & Released' && (
              <div className="w-full py-8 bg-[#16A34A] border-2 border-black brutal-shadow rounded-xl flex flex-col items-center justify-center rotate-2">
                <CheckCircle2 className="w-16 h-16 text-white mb-4" strokeWidth={3} />
                <h3 className="text-white font-black text-3xl mb-2 uppercase">Quest Completed!</h3>
                <p className="text-white font-bold text-lg bg-black px-4 py-2 rounded-xl border-2 border-white">
                  +{quest.reward.amount} {quest.reward.type}
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
