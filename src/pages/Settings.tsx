import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/userService';
import { LDCE_UG_PROGRAMS, LDCE_PG_PROGRAMS, LDCE_FACILITIES } from '../data/ldceDepartments';
import { CAMPUS_ZONES } from '../data/mockData';
import { User, Building, MapPin, Bell, LogOut, Save, ArrowLeft, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const Settings: React.FC<{ isModal?: boolean; onClose?: () => void }> = ({ isModal = false, onClose }) => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('Computer Engineering');
  const [customDepartment, setCustomDepartment] = useState('');
  const [defaultZone, setDefaultZone] = useState('Central Library');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.name || currentUser?.displayName || '');
      const dept = userProfile.department || 'Computer Engineering';
      const allKnownDepts = [...LDCE_UG_PROGRAMS, ...LDCE_PG_PROGRAMS];
      if (allKnownDepts.includes(dept)) {
        setDepartment(dept);
      } else {
        setDepartment('Custom / Other');
        setCustomDepartment(dept);
      }
      setDefaultZone(userProfile.defaultZone || 'Central Library');
      setNotificationsEnabled(userProfile.notificationsEnabled ?? true);
    } else if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [userProfile, currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.uid) {
      toast.error('You must be logged in to update settings.');
      return;
    }

    setIsSaving(true);

    const finalDepartment = department === 'Custom / Other' ? (customDepartment || 'General Engineering') : department;
    const finalZone = defaultZone || 'Central Library';

    try {
      // 1. Update Firebase Auth displayName
      if (displayName && displayName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName });
      }

      // 2. Update Firestore user document
      await updateUserProfile(currentUser.uid, {
        name: displayName,
        department: finalDepartment,
        defaultZone: finalZone,
        notificationsEnabled
      });

      toast.success('Settings updated successfully! ✨');
      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Failed to update settings in Firestore:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Logged out successfully.');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  const containerClasses = isModal
    ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'
    : 'min-h-screen pt-[88px] pb-10 px-4 md:px-8 bg-[var(--color-brand-bg)] flex items-center justify-center';

  const cardClasses =
    'bg-white w-full max-w-xl rounded-2xl p-8 brutal-border shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar';

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b-4 border-black mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#EAB308] rounded-xl brutal-border brutal-shadow-sm flex items-center justify-center">
              <SettingsIcon className="w-7 h-7 text-black" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-black uppercase">LDCE Hunter Settings</h1>
              <p className="text-xs font-bold text-gray-500">L. D. College of Engineering Profile & Preferences</p>
            </div>
          </div>

          {isModal && onClose ? (
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-xl brutal-border transition-colors font-bold text-sm"
            >
              ✕
            </button>
          ) : (
            <button
              onClick={() => navigate('/profile')}
              className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-black font-black uppercase text-xs rounded-xl brutal-border transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={3} /> Back
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Display Name */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Display Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Hunter"
                disabled={isSaving}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-bold text-black focus:outline-none focus:bg-[#EAB308]/20 transition-all text-sm disabled:opacity-50"
              />
              <User className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" strokeWidth={2.5} />
            </div>
          </div>

          {/* LDCE Department / Program Selection */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              LDCE Academic Department / Program
            </label>
            <div className="relative mb-2">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={isSaving}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-bold text-black focus:outline-none appearance-none text-sm disabled:opacity-50"
              >
                <optgroup label="UG Programs in LDCE">
                  {LDCE_UG_PROGRAMS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog} (B.E.)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="PG Programs in LDCE">
                  {LDCE_PG_PROGRAMS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog} (M.E. / MCA)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Custom / Other">
                  <option value="Custom / Other">Custom / Other Department</option>
                </optgroup>
              </select>
              <Building className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5 pointer-events-none" strokeWidth={2.5} />
            </div>

            {department === 'Custom / Other' && (
              <input
                type="text"
                required
                value={customDepartment}
                onChange={(e) => setCustomDepartment(e.target.value)}
                placeholder="Type your custom department..."
                disabled={isSaving}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3 px-4 font-bold text-black focus:outline-none text-sm mt-2 disabled:opacity-50"
              />
            )}
          </div>

          {/* LDCE Campus Facility / Zone Selection */}
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Primary LDCE Campus Facility / Zone
            </label>
            <div className="relative">
              <select
                value={defaultZone}
                onChange={(e) => setDefaultZone(e.target.value)}
                disabled={isSaving}
                className="w-full bg-gray-50 brutal-border brutal-shadow-sm rounded-xl py-3.5 pl-11 pr-4 font-bold text-black focus:outline-none appearance-none text-sm disabled:opacity-50"
              >
                <optgroup label="LDCE Facilities">
                  {LDCE_FACILITIES.map((facility) => (
                    <option key={facility} value={facility}>
                      {facility}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Campus Zones & Blocks">
                  {Object.keys(CAMPUS_ZONES).map((zoneKey) => (
                    <option key={zoneKey} value={CAMPUS_ZONES[zoneKey].name}>
                      {CAMPUS_ZONES[zoneKey].name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <MapPin className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5 pointer-events-none" strokeWidth={2.5} />
            </div>
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl brutal-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#C084FC] rounded-lg brutal-border">
                <Bell className="w-5 h-5 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-black text-black uppercase">Bounty Notifications</p>
                <p className="text-xs text-gray-500 font-bold">Receive alerts for new campus quests</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-black after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A] border-2 border-black"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t-4 border-black flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:flex-1 py-3.5 bg-[#60A5FA] hover:bg-black hover:text-white text-black font-black uppercase text-sm rounded-xl transition-all brutal-border brutal-shadow brutal-shadow-hover flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" strokeWidth={2.5} /> Save Changes
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3.5 bg-red-100 hover:bg-red-500 hover:text-white text-black font-black uppercase text-sm rounded-xl transition-all brutal-border flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" strokeWidth={2.5} /> Sign Out
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default Settings;
