import React, { useState } from 'react';
import type { QuestCategory } from '../types';
import { CAMPUS_ZONES } from '../data/mockData';
import { X, MapPin, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createQuest } from '../services/questService';
import { toast } from 'react-toastify';

interface PostQuestModalProps {
  onClose: () => void;
}

const PostQuestModal: React.FC<PostQuestModalProps> = ({ onClose }) => {
  const { currentUser, userProfile } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('Quick Favors');
  const [locationName, setLocationName] = useState<string>(Object.keys(CAMPUS_ZONES)[0]);
  const [rewardAmount, setRewardAmount] = useState('100');
  const [rewardType, setRewardType] = useState<'XP' | 'Coins' | 'Rupees' | 'Coffee'>('Coins');
  const [timeLimit, setTimeLimit] = useState('2 hours');
  const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Quick Favors');
    setLocationName(Object.keys(CAMPUS_ZONES)[0]);
    setRewardAmount('100');
    setRewardType('Coins');
    setTimeLimit('2 hours');
    setUrgency('Medium');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const selectedZone = CAMPUS_ZONES[locationName] || {
        lat: 23.0338,
        lng: 72.5464,
        name: locationName
      };

      await createQuest({
        title,
        description,
        category,
        urgency,
        status: 'Open',
        locationName: locationName,
        lat: selectedZone.lat,
        lng: selectedZone.lng,
        rewardType,
        rewardAmount: parseInt(rewardAmount, 10) || 0,
        timeLimitStr: timeLimit,
        posterId: currentUser?.uid || '',
        posterName: userProfile?.name || currentUser?.displayName || 'Anonymous Hunter',
        posterLevel: userProfile?.level || 1,
        hunterId: null
      });

      toast.success('SideQuest Posted! Hunters will be notified.');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create quest in Firestore:', error);
      toast.error('Failed to post bounty. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[95vh] brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
        
        <div className="p-6 border-b-4 border-black flex justify-between items-center bg-[#F472B6]">
          <h2 className="text-3xl font-black text-black uppercase flex items-center gap-2">
            Post a Bounty
          </h2>
          <button 
            onClick={onClose} 
            disabled={isSubmitting}
            className="p-2 bg-white brutal-border brutal-shadow-sm hover:translate-y-1 transition-transform disabled:opacity-50"
          >
            <X className="w-6 h-6 text-black" strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <form id="post-quest-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Quest Title</label>
              <input 
                required
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Need jumper wires for IoT Lab"
                disabled={isSubmitting}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-bold focus:outline-none focus:bg-[#EAB308]/20 transition-all text-lg disabled:opacity-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value as QuestCategory)}
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-bold focus:outline-none appearance-none disabled:opacity-50"
                >
                  <option>Code/Debugging</option>
                  <option>Hardware/Lab Tools</option>
                  <option>Design/Poster</option>
                  <option>Printing/Notes</option>
                  <option>Quick Favors</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Location Zone</label>
                <div className="relative">
                  <select 
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-bold focus:outline-none appearance-none pl-12 disabled:opacity-50"
                  >
                    {Object.keys(CAMPUS_ZONES).map(zone => (
                      <option key={zone} value={zone}>{CAMPUS_ZONES[zone].name}</option>
                    ))}
                  </select>
                  <MapPin className="w-5 h-5 text-black absolute left-4 top-4 pointer-events-none" strokeWidth={3} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Bounty Reward</label>
                <div className="flex gap-2">
                  <input 
                    required
                    type="number" 
                    value={rewardAmount}
                    onChange={e => setRewardAmount(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-black text-lg focus:outline-none disabled:opacity-50"
                  />
                  <select 
                    value={rewardType}
                    onChange={e => setRewardType(e.target.value as any)}
                    disabled={isSubmitting}
                    className="w-32 bg-[#C084FC] brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-black focus:outline-none appearance-none uppercase disabled:opacity-50"
                  >
                    <option>Coins</option>
                    <option>XP</option>
                    <option>Rupees</option>
                    <option>Coffee</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Urgency</label>
                <select 
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-bold focus:outline-none appearance-none disabled:opacity-50"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Description</label>
              <textarea 
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Explain what you need in detail..."
                disabled={isSubmitting}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-medium focus:outline-none resize-none text-lg disabled:opacity-50"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm uppercase tracking-wider text-black font-black mb-2">Time Limit</label>
              <input 
                required
                type="text" 
                value={timeLimit}
                onChange={e => setTimeLimit(e.target.value)}
                placeholder="e.g. 2 hours, 30 mins"
                disabled={isSubmitting}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl p-4 text-black font-bold focus:outline-none text-lg disabled:opacity-50"
              />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t-4 border-black bg-gray-100 flex justify-end gap-4">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl font-bold text-black brutal-border hover:bg-gray-200 transition-colors uppercase disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="post-quest-form"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#60A5FA] hover:bg-black hover:text-white text-black font-black uppercase tracking-wider text-lg rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Bounty'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PostQuestModal;
