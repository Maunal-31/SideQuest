import React from 'react';
import { Trophy, Medal, Search, Flame } from 'lucide-react';
import { useSideQuest } from '../context/SideQuestContext';

const MOCK_LEADERBOARD = [
  { id: '1', name: 'Alex Hunter', level: 15, xp: 3450, badge: 'Hardware Wizard', rank: 1, streak: 12 },
  { id: '2', name: 'Priya Patel', level: 14, xp: 3120, badge: 'Code Ninja', rank: 2, streak: 8 },
  { id: '3', name: 'Rahul Dev', level: 14, xp: 3050, badge: 'UI/UX Master', rank: 3, streak: 5 },
  { id: '4', name: 'Neha Gupta', level: 12, xp: 2800, badge: 'Event Organizer', rank: 4, streak: 2 },
  { id: '5', name: 'Amit Kumar', level: 11, xp: 2500, badge: 'Procrastinator', rank: 5, streak: 0 },
];

const Leaderboard: React.FC = () => {
  return (
    <div className="min-h-screen pt-[88px] pb-10 px-4 md:px-8 bg-[var(--color-brand-bg)]">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12 mt-4 relative">
          <div className="inline-block bg-[#F472B6] px-6 py-2 rounded-xl brutal-border brutal-shadow rotate-[-2deg] mb-4">
            <h1 className="text-3xl md:text-5xl font-black text-black uppercase flex items-center justify-center gap-4">
              <Trophy className="text-black w-10 h-10" strokeWidth={3} /> Campus Elite
            </h1>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-black font-bold text-lg bg-white inline-block px-4 py-2 brutal-border brutal-shadow-sm rotate-[1deg]">The top problem solvers and bounty hunters.</p>
            <p className="text-black/80 font-bold text-sm bg-[#EAB308] inline-block px-3 py-1 rounded-md brutal-border rotate-[-1deg]">
              * Rankings are strictly based on XP earned by successfully solving tasks!
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-2 md:gap-6 mb-16 h-72">
          {/* Rank 2 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="relative z-10 mb-[-24px] transition-transform group-hover:-translate-y-2">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_LEADERBOARD[1].name}`} alt="Rank 2" className="w-20 h-20 rounded-full bg-[#60A5FA] brutal-border brutal-shadow-sm" />
              <div className="absolute -bottom-2 -right-2 bg-white brutal-border text-black text-xs font-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                Lvl {MOCK_LEADERBOARD[1].level}
              </div>
            </div>
            <div className="bg-[#EAB308] brutal-border w-28 md:w-36 h-32 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <span className="text-5xl font-black text-black mb-1">2</span>
              <span className="text-sm font-black text-black uppercase">{MOCK_LEADERBOARD[1].name.split(' ')[0]}</span>
              <span className="text-xs font-bold text-black/80">{MOCK_LEADERBOARD[1].xp} XP</span>
            </div>
          </div>

          {/* Rank 1 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <Trophy className="w-12 h-12 text-black fill-[#EAB308] mb-2 animate-bounce" strokeWidth={2} />
            <div className="relative z-10 mb-[-28px] transition-transform group-hover:-translate-y-2">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_LEADERBOARD[0].name}`} alt="Rank 1" className="w-24 h-24 rounded-full bg-[#16A34A] brutal-border brutal-shadow" />
              <div className="absolute -bottom-2 -right-2 bg-white brutal-border text-black text-sm font-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                Lvl {MOCK_LEADERBOARD[0].level}
              </div>
            </div>
            <div className="bg-[#C084FC] brutal-border w-32 md:w-44 h-48 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <span className="text-7xl font-black text-black mb-1">1</span>
              <span className="text-lg font-black text-black uppercase">{MOCK_LEADERBOARD[0].name.split(' ')[0]}</span>
              <span className="text-sm font-bold text-black/80 bg-white/50 px-2 py-1 rounded mt-1">{MOCK_LEADERBOARD[0].xp} XP</span>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="flex flex-col items-center group cursor-pointer">
            <div className="relative z-10 mb-[-24px] transition-transform group-hover:-translate-y-2">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_LEADERBOARD[2].name}`} alt="Rank 3" className="w-20 h-20 rounded-full bg-[#EA580C] brutal-border brutal-shadow-sm" />
              <div className="absolute -bottom-2 -right-2 bg-white brutal-border text-black text-xs font-black px-2 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                Lvl {MOCK_LEADERBOARD[2].level}
              </div>
            </div>
            <div className="bg-[#60A5FA] brutal-border w-28 md:w-36 h-28 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <span className="text-4xl font-black text-black mb-1">3</span>
              <span className="text-sm font-black text-black uppercase">{MOCK_LEADERBOARD[2].name.split(' ')[0]}</span>
              <span className="text-xs font-bold text-black/80">{MOCK_LEADERBOARD[2].xp} XP</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white brutal-border brutal-shadow rounded-2xl overflow-hidden mt-8 rotate-[1deg]">
          <div className="p-4 border-b-4 border-black flex justify-between items-center bg-[#F3F1EB]">
            <h3 className="font-black text-black text-xl uppercase">Rankings</h3>
            <div className="relative">
              <Search className="w-5 h-5 text-black absolute left-3 top-2.5" strokeWidth={3} />
              <input 
                type="text" 
                placeholder="FIND HUNTER..." 
                className="bg-white brutal-border rounded-lg py-2 pl-10 pr-4 text-sm text-black font-bold focus:outline-none focus:bg-[#EAB308]/20 w-48 transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm uppercase font-black text-black border-b-4 border-black">
                  <th className="p-4 border-r-2 border-black w-16 text-center">#</th>
                  <th className="p-4 border-r-2 border-black">Hunter</th>
                  <th className="p-4 border-r-2 border-black text-center hidden md:table-cell">Level</th>
                  <th className="p-4 border-r-2 border-black text-center">Streak</th>
                  <th className="p-4 text-right">XP</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEADERBOARD.map((user, idx) => (
                  <tr key={user.id} className="border-b-2 border-black hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-black text-xl text-center border-r-2 border-black">
                      {user.rank}
                    </td>
                    <td className="p-4 flex items-center gap-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-10 h-10 rounded-full border-2 border-black bg-[#C084FC]" />
                      <div>
                        <p className="font-black text-black text-lg">{user.name}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase bg-gray-200 inline-block px-1 rounded">{user.badge}</p>
                      </div>
                    </td>
                    <td className="p-4 text-center hidden md:table-cell border-l-2 border-black">
                      <span className="bg-black text-white px-3 py-1 rounded-md text-sm font-bold brutal-shadow-sm inline-block">Lvl {user.level}</span>
                    </td>
                    <td className="p-4 text-center border-l-2 border-black">
                      {user.streak > 0 ? (
                        <div className="flex items-center justify-center gap-1 text-[#EA580C] bg-[#EA580C]/10 px-2 py-1 rounded-md brutal-border brutal-shadow-sm w-max mx-auto">
                          <Flame className="w-5 h-5 fill-[#EA580C]" strokeWidth={2} /> <span className="font-black text-lg">{user.streak}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-bold">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-[#16A34A] font-black text-xl border-l-2 border-black bg-[#16A34A]/5">
                      {user.xp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
