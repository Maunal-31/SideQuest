import React, { useState, useEffect } from 'react';
import { Trophy, Search, Flame, Loader2, Shield, UserX } from 'lucide-react';
import { subscribeToLeaderboard, UserProfile } from '../services/userService';

const useCountUp = (end: number, duration: number = 1500) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOut));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

const CountUpNumber: React.FC<{ end: number; duration?: number }> = ({ end, duration = 1500 }) => {
  const count = useCountUp(end, duration);
  return <>{count}</>;
};

const Leaderboard: React.FC = () => {
  const [realUsers, setRealUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Strictly subscribe to real registered users from Firestore sorted by XP desc
  useEffect(() => {
    const unsubscribe = subscribeToLeaderboard((liveUsers) => {
      // Filter out any invalid / dummy profiles and sort strictly by XP desc
      const validUsers = liveUsers
        .filter(u => u && u.name && u.name.trim().length > 0)
        .sort((a, b) => (b.xp || 0) - (a.xp || 0));
      setRealUsers(validUsers);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredLeaderboard = realUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.guildRank && user.guildRank.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const top1 = realUsers[0] || null;
  const top2 = realUsers[1] || null;
  const top3 = realUsers[2] || null;

  return (
    <div className="min-h-screen pt-[88px] pb-10 px-4 md:px-8 bg-[var(--color-brand-bg)]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 mt-4 relative">
          <div className="inline-block bg-[#F472B6] px-6 py-2 rounded-xl brutal-border brutal-shadow mb-4">
            <h1 className="text-3xl md:text-5xl font-black text-black uppercase flex items-center justify-center gap-4">
              <Trophy className="text-black w-10 h-10" strokeWidth={3} /> Campus Elite
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-black font-bold text-lg bg-white inline-block px-4 py-2 brutal-border brutal-shadow-sm">
              Strict Firestore Leaderboard • Validated real user profiles.
            </p>
            <p className="text-black/80 font-bold text-sm bg-[#EAB308] inline-block px-3 py-1 rounded-md brutal-border">
              * Rankings strictly computed from real registered users in database!
            </p>
          </div>
        </div>

        {/* Top 3 Podium (Renders ONLY if real users exist) */}
        {realUsers.length > 0 && (
          <div className="flex items-end justify-center gap-2 md:gap-6 mb-16 h-72">
            {/* Rank 2 */}
            {top2 ? (
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative z-10 mb-[-24px] transition-transform group-hover:-translate-y-2">
                  <img 
                    src={top2.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top2.name)}`} 
                    alt="Rank 2" 
                    className="w-20 h-20 rounded-full bg-[#60A5FA] brutal-border brutal-shadow-sm object-cover" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white brutal-border text-black text-xs font-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    Lvl {top2.level || 1}
                  </div>
                </div>
                <div className="bg-[#EAB308] brutal-border w-28 md:w-36 h-32 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <span className="text-5xl font-black text-black mb-1">2</span>
                  <span className="text-sm font-black text-black uppercase truncate max-w-[110px] text-center px-1">{top2.name.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-black/80"><CountUpNumber end={top2.xp || 0} /> XP</span>
                </div>
              </div>
            ) : (
              <div className="w-28 md:w-36 h-28 border-2 border-dashed border-black/30 rounded-t-xl flex items-center justify-center text-xs font-bold text-black/40 uppercase">
                Spot #2 Open
              </div>
            )}

            {/* Rank 1 */}
            {top1 ? (
              <div className="flex flex-col items-center group cursor-pointer">
                <Trophy className="w-12 h-12 text-black fill-[#EAB308] mb-2 animate-bounce" strokeWidth={2} />
                <div className="relative z-10 mb-[-28px] transition-transform group-hover:-translate-y-2">
                  <img 
                    src={top1.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top1.name)}`} 
                    alt="Rank 1" 
                    className="w-24 h-24 rounded-full bg-[#16A34A] brutal-border brutal-shadow object-cover" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white brutal-border text-black text-sm font-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    Lvl {top1.level || 1}
                  </div>
                </div>
                <div className="bg-[#C084FC] brutal-border w-32 md:w-44 h-48 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <span className="text-7xl font-black text-black mb-1">1</span>
                  <span className="text-lg font-black text-black uppercase truncate max-w-[140px] text-center px-1">{top1.name.split(' ')[0]}</span>
                  <span className="text-sm font-bold text-black/80 bg-white/50 px-2 py-1 rounded mt-1"><CountUpNumber end={top1.xp || 0} /> XP</span>
                </div>
              </div>
            ) : null}

            {/* Rank 3 */}
            {top3 ? (
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="relative z-10 mb-[-24px] transition-transform group-hover:-translate-y-2">
                  <img 
                    src={top3.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(top3.name)}`} 
                    alt="Rank 3" 
                    className="w-20 h-20 rounded-full bg-[#EA580C] brutal-border brutal-shadow-sm object-cover" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white brutal-border text-black text-xs font-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                    Lvl {top3.level || 1}
                  </div>
                </div>
                <div className="bg-[#60A5FA] brutal-border w-28 md:w-36 h-28 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                  <span className="text-4xl font-black text-black mb-1">3</span>
                  <span className="text-sm font-black text-black uppercase truncate max-w-[110px] text-center px-1">{top3.name.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-black/80"><CountUpNumber end={top3.xp || 0} /> XP</span>
                </div>
              </div>
            ) : (
              <div className="w-28 md:w-36 h-24 border-2 border-dashed border-black/30 rounded-t-xl flex items-center justify-center text-xs font-bold text-black/40 uppercase">
                Spot #3 Open
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white brutal-border brutal-shadow rounded-2xl overflow-hidden mt-8">
          <div className="p-4 border-b-4 border-black flex flex-wrap justify-between items-center bg-[#F3F1EB] gap-4">
            <h3 className="font-black text-black text-xl uppercase flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#16A34A]" strokeWidth={3} /> Verified Database Users ({filteredLeaderboard.length})
            </h3>
            <div className="relative">
              <Search className="w-5 h-5 text-black absolute left-3 top-2.5" strokeWidth={3} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH REGISTERED HUNTERS..." 
                className="bg-white brutal-border rounded-lg py-2 pl-10 pr-4 text-sm text-black font-bold focus:outline-none focus:bg-[#EAB308]/20 w-64 transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 font-bold text-black">
                <Loader2 className="w-10 h-10 animate-spin text-[#EA580C] mb-3" strokeWidth={3} />
                <p className="uppercase font-black text-base">Validating Firestore User Database...</p>
              </div>
            ) : filteredLeaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center p-6">
                <UserX className="w-12 h-12 text-gray-400 mb-3" strokeWidth={2} />
                <p className="text-lg font-black uppercase text-black">No Registered Hunters Found</p>
                <p className="text-sm font-bold text-gray-500">Sign up or complete quests to appear on the campus leaderboard!</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-sm uppercase font-black text-black border-b-4 border-black">
                    <th className="p-4 border-r-2 border-black w-16 text-center">Rank</th>
                    <th className="p-4 border-r-2 border-black">Hunter</th>
                    <th className="p-4 border-r-2 border-black text-center hidden md:table-cell">Level</th>
                    <th className="p-4 border-r-2 border-black text-center">Bounties</th>
                    <th className="p-4 text-center">XP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.map((user, idx) => (
                    <tr key={user.uid || idx} className="border-b-2 border-black hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-black text-xl text-center border-r-2 border-black">
                        #{idx + 1}
                      </td>
                      <td className="p-4 flex items-center gap-4">
                        <img 
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full border-2 border-black bg-[#C084FC] object-cover" 
                        />
                        <div>
                          <p className="font-black text-black text-lg">{user.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black bg-[#EAB308]/30 px-2 py-0.5 rounded border border-black uppercase">
                              {user.guildRank || 'Bronze I'}
                            </span>
                            {user.department && (
                              <span className="text-[10px] font-black text-gray-600 uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                                {user.department}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center hidden md:table-cell border-l-2 border-black">
                        <span className="bg-black text-white px-3 py-1 rounded-md text-sm font-bold brutal-shadow-sm inline-block">
                          Lvl {user.level || 1}
                        </span>
                      </td>
                      <td className="p-4 text-center border-l-2 border-black">
                        <div className="flex items-center justify-center gap-1 text-[#EA580C] bg-[#EA580C]/10 px-2.5 py-1 rounded-md brutal-border brutal-shadow-sm w-max mx-auto">
                          <Flame className="w-4 h-4 fill-[#EA580C]" strokeWidth={2} /> 
                          <span className="font-black text-base">{user.completedQuestsCount || 0}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center text-[#16A34A] font-black text-xl border-l-2 border-black bg-[#16A34A]/5">
                        {user.xp || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
