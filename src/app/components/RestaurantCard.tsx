import { Restaurant } from '../data/mockData';
import { MapPin, Star, Flame, Smile, Zap, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  selectedCampus?: string;
  onClick?: () => void;
}

export function RestaurantCard({ restaurant, selectedCampus, onClick }: RestaurantCardProps) {
  const [showVotes, setShowVotes] = useState(false);
  const [localVotes, setLocalVotes] = useState(restaurant.votes);
  const [votedFor, setVotedFor] = useState<string[]>([]); // 改为数组，支持多选
  const [hasClickedEatToday, setHasClickedEatToday] = useState(false);

  const voteOptions = [
    { key: 'crowded', icon: '🔥', label: '排队', count: localVotes.crowded },
    { key: 'delicious', icon: '🤤', label: '好吃', count: localVotes.delicious },
    { key: 'fast', icon: '⚡️', label: '闪电出餐', count: localVotes.fast },
    { key: 'slow', icon: '⏳', label: '排队慢', count: localVotes.slow },
  ];

  const handleVote = (e: React.MouseEvent, voteKey: string) => {
    e.stopPropagation();
    
    // 如果已经投过这一项，则取消投票
    if (votedFor.includes(voteKey)) {
      setLocalVotes(prev => ({
        ...prev,
        [voteKey]: prev[voteKey as keyof typeof prev] - 1
      }));
      setVotedFor(prev => prev.filter(v => v !== voteKey));
    } else {
      // 否则添加投票
      setLocalVotes(prev => ({
        ...prev,
        [voteKey]: prev[voteKey as keyof typeof prev] + 1
      }));
      setVotedFor(prev => [...prev, voteKey]);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 flex flex-col"
      onClick={onClick}
    >
      {/* 餐厅图片 */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        {(restaurant.studentDiscount && (!selectedCampus || restaurant.campus === selectedCampus)) && (
          <div className="absolute top-3 left-3 bg-[#E2001A] text-white px-3 py-1 rounded-full text-sm">
            {restaurant.studentDiscount}
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {restaurant.rating}
        </div>
      </div>

      {/* 餐厅信息 */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-2 py-0.5 bg-[#FFECC8] text-[#292929] rounded">{restaurant.category}</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {restaurant.distance}m
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[#E2001A]">
              ¥{restaurant.price}
            </div>
            <div className="text-xs text-gray-500">人均</div>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.hasAllergenFree && (
            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1 font-medium">
              🌿 无过敏原菜品
            </span>
          )}
          {restaurant.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 bg-red-50 text-[#E2001A] rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* 人气菜品 */}
        <div className="text-sm text-gray-600 mb-3">
          <span className="text-gray-500">人气菜品：</span>
          {restaurant.popularDishes.join('、')}
        </div>

        {/* 互动操作区 */}
        <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
          {!hasClickedEatToday ? (
            <div className="flex justify-end" onClick={e => e.stopPropagation()}>
              <button 
                onClick={(e) => { e.stopPropagation(); setHasClickedEatToday(true); }}
                className="bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transform transition-transform hover:scale-105 active:scale-95"
              >
                今天吃了
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-2"
              onClick={e => e.stopPropagation()}
            >
              {voteOptions.map((vote) => (
                <button 
                  key={vote.key}
                  onClick={(e) => handleVote(e, vote.key)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    votedFor.includes(vote.key)
                      ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white scale-105 shadow-md' 
                      : 'bg-orange-50 hover:bg-orange-100 cursor-pointer active:scale-95'
                  }`}
                >
                  <span className="text-xl drop-shadow-sm">{vote.icon}</span>
                  <span className={`text-[10px] font-medium ${votedFor.includes(vote.key) ? 'text-white' : 'text-gray-600'}`}>{vote.label}</span>
                  <span className={`text-xs font-bold ${votedFor.includes(vote.key) ? 'text-white' : 'text-[#E2001A]'}`}>
                    {vote.count}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}