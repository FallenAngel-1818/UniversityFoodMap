import { useState } from 'react';
import { mockRestaurants, rankingLists, campuses } from '../data/mockData';
import { Trophy, TrendingUp, DollarSign, Heart, Sparkles, Star, MapPin, CheckCircle, Store, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CampusSelector } from '../components/CampusSelector';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function Rankings() {
  const navigate = useNavigate();
  const [selectedRanking, setSelectedRanking] = useState('hot');
  const [selectedCampus, setSelectedCampus] = useState('bift');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [hoveredStoreId, setHoveredStoreId] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  const rankingCategories = ['全部', '饮品', '咖啡', '火锅', '地方菜', '小吃快餐', '面包蛋糕甜点', '烤肉', '自助餐', '西餐', '日料'];

  const handleVerify = (restaurantId: string, type: 'hasIt' | 'tasty' | 'closed') => {
    const restaurant = mockRestaurants.find(r => r.id === restaurantId);
    if (restaurant && restaurant.verifyVotes) {
      restaurant.verifyVotes[type] += 1;
      setForceUpdate(prev => prev + 1);
      
      const messages = {
        hasIt: '打卡成功：确实有！',
        tasty: '打卡成功：很好吃！',
        closed: '反馈成功：没出摊'
      };
      toast.success(messages[type]);
    }
  };

  const currentRanking = rankingLists.find(r => r.id === selectedRanking) || rankingLists[0];
  
  let rankedRestaurants = mockRestaurants.filter(r => 
    (!selectedCampus || r.campus === selectedCampus) && 
    (selectedCategory === '全部' || r.category === selectedCategory || (r.tags && r.tags.includes(selectedCategory)))
  );

  if (selectedRanking === 'hot') {
    rankedRestaurants.sort((a, b) => (b.votes?.delicious || 0) - (a.votes?.delicious || 0));
  } else if (selectedRanking === 'new') {
    rankedRestaurants.sort((a, b) => (b.id.includes('new-store') || b.id.includes('gen') ? 1 : -1));
  } else if (selectedRanking === 'cheap') {
    rankedRestaurants.sort((a, b) => a.price - b.price);
  } else if (selectedRanking === 'delicious') {
    rankedRestaurants.sort((a, b) => b.rating - a.rating);
  }

  // 截取前20名展示
  rankedRestaurants = rankedRestaurants.slice(0, 20);

  const rankingTabs = [
    { id: 'hot', icon: Trophy, label: '热门榜', color: 'from-orange-500 to-red-500' },
    { id: 'new', icon: Sparkles, label: '新店榜', color: 'from-red-500 to-orange-400' },
    { id: 'cheap', icon: DollarSign, label: '性价比榜', color: 'from-green-500 to-emerald-500' },
    { id: 'delicious', icon: Heart, label: '好评榜', color: 'from-pink-500 to-rose-500' },
  ];

  // 美食攻略文章
  const guides = [
    {
      id: '1',
      title: '新生必看！校园十大必吃美食清单',
      cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      author: '美食探索家',
      views: 2341,
      likes: 456
    },
    {
      id: '2',
      title: '人均30元吃遍校园，穷学生的福音',
      cover: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      author: '省钱小能手',
      views: 1876,
      likes: 389
    },
    {
      id: '3',
      title: '深夜食堂：那些营业到凌晨的宝藏餐厅',
      cover: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      author: '夜猫子',
      views: 1654,
      likes: 312
    },
    {
      id: '4',
      title: '约会必选！校园附近浪漫餐厅推荐',
      cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      author: '恋爱专家',
      views: 2103,
      likes: 578
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Header */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1659894886809-4a3b16a0ae90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZXN0ZXJuJTIwZm9vZCUyMHN0ZWFrJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzM0NzA5Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Western Food"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">榜单攻略</h1>
            <p className="text-white/80 mb-8">发现最受欢迎的美食，探索美食攻略</p>
            <div className="flex justify-center">
              <CampusSelector selected={selectedCampus} onSelect={setSelectedCampus} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 榜单切换标签 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {rankingTabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = selectedRanking === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedRanking(tab.id)}
                className={`relative overflow-hidden rounded-xl p-6 transition-all ${
                  isActive
                    ? 'bg-gradient-to-br ' + tab.color + ' text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="relative z-10">
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="font-semibold">{tab.label}</div>
                </div>
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 榜单内容 */}
        <div className="mb-12">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#E2001A] to-[#FF9512] rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentRanking.title}
                </h2>
                <p className="text-gray-600 text-sm">{currentRanking.description}</p>
              </div>
            </div>

            {/* 细分分类 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {rankingCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {rankedRestaurants.map((restaurant, index) => {
              if (!restaurant) return null;
              
              const rankColors = [
                'from-yellow-400 to-orange-500', // 1st
                'from-gray-300 to-gray-400',     // 2nd
                'from-orange-300 to-orange-400', // 3rd
              ];

              return (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredStoreId(restaurant.id)}
                  onHoverEnd={() => setHoveredStoreId(null)}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  className="bg-white rounded-xl border border-gray-200 hover:border-[#E2001A] hover:shadow-lg transition-all overflow-hidden group cursor-pointer relative"
                >
                  <div className="flex gap-4 p-4">
                    {/* 排名 */}
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                        index < 3 ? rankColors[index] : 'from-gray-200 to-gray-300'
                      } flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                        {index + 1}
                      </div>
                    </div>

                    {/* 餐厅图片 */}
                    <div className="flex-shrink-0">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>

                    {/* 餐厅信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="px-2 py-0.5 bg-gray-100 rounded">
                              {restaurant.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {restaurant.distance}m
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-[#E2001A]">
                            ¥{restaurant.price}
                          </div>
                          <div className="text-xs text-gray-500">人均</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        {restaurant.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-orange-50 text-[#E2001A] rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 验证数据展示 */}
                      {selectedRanking === 'new' && restaurant.verifyVotes && (
                        <div className="flex items-center gap-3 text-sm mb-2 text-gray-600">
                          <span className="flex items-center gap-1">✊ {restaurant.verifyVotes.hasIt}</span>
                          <span className="flex items-center gap-1">🤤 {restaurant.verifyVotes.tasty}</span>
                          <span className="flex items-center gap-1">🏃 {restaurant.verifyVotes.closed}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{restaurant.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          🤤 <span>{restaurant.votes.delicious}人说好吃</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          ⚡️ <span>{restaurant.votes.fast}人说快</span>
                        </div>
                      </div>
                    </div>

                    {/* 查看详情箭头 */}
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#E2001A] flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* 新店验证操作区 */}
                  {selectedRanking === 'new' && (
                    <div 
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm rounded-xl p-2 flex gap-2 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="text-[10px] text-gray-500 absolute -top-2 right-2 bg-white px-1 rounded-sm border border-gray-100">帮助验证</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVerify(restaurant.id, 'hasIt'); }}
                        className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors border border-gray-100 hover:border-green-200 bg-white"
                      >
                        <span className="text-lg leading-none">✊</span>
                        <span className="text-[10px] text-gray-600 mt-1 font-medium">确实有</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVerify(restaurant.id, 'tasty'); }}
                        className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors border border-gray-100 hover:border-orange-200 bg-white"
                      >
                        <span className="text-lg leading-none">🤤</span>
                        <span className="text-[10px] text-gray-600 mt-1 font-medium">好吃</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleVerify(restaurant.id, 'closed'); }}
                        className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-gray-100 hover:border-red-200 bg-white"
                      >
                        <span className="text-lg leading-none">🏃</span>
                        <span className="text-[10px] text-gray-600 mt-1 font-medium">没出摊</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 美食攻略 */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[#E2001A] to-[#FF9512] rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900">美食攻略</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#E2001A] hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={guide.cover}
                    alt={guide.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                      {guide.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E2001A] to-[#FF9512] flex items-center justify-center text-white text-xs">
                        {guide.author[0]}
                      </div>
                      <span>{guide.author}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>👁️ {guide.views}</span>
                      <span>❤️ {guide.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
