import { useState, useMemo } from 'react';
import { mockRestaurants, campuses, canteenGuides, Restaurant } from '../data/mockData';
import { CampusSelector } from '../components/CampusSelector';
import { Star, MapPin, Navigation, Search, Info, ChevronRight, Store, Clock, UtensilsCrossed, Trophy, Gift, CheckCircle, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function MapView() {
  const navigate = useNavigate();
  const [selectedCampus, setSelectedCampus] = useState('bift');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [activeSpecialTags, setActiveSpecialTags] = useState<string[]>([]);
  const [showNightOnly, setShowNightOnly] = useState(false);
  const [showVendorsOnly, setShowVendorsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'restaurants' | 'canteen' | 'challenges'>('restaurants');
  const [showSidebar, setShowSidebar] = useState(false);

  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: '本周新店猎手',
      description: '本周尝试上传了3家新餐厅',
      target: 3,
      progress: 2,
      reward: '满30减5优惠券',
      badge: '🆕 新星徽章',
      status: 'in_progress'
    },
    {
      id: 2,
      title: '评价达人',
      description: '在地图上留下5条带图评价',
      target: 5,
      progress: 5,
      reward: '任意饮品免单券',
      badge: '📸 达人徽章',
      status: 'completed'
    },
    {
      id: 3,
      title: '夜猫子探索',
      description: '打卡1家夜宵专属摊位',
      target: 1,
      progress: 0,
      reward: '夜猫子专属头衔',
      badge: '🌙 夜猫徽章',
      status: 'in_progress'
    }
  ]);

  const [claimedReward, setClaimedReward] = useState<{badge: string, reward: string, title: string} | null>(null);
  const [eatTodayId, setEatTodayId] = useState<string | null>(null);

  const handleClaimReward = (id: number) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge) return;
    
    setChallenges(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'claimed' } : c)
    );
    setClaimedReward({ badge: challenge.badge, reward: challenge.reward, title: challenge.title });
  };

  const categories = ['全部', '中餐', '西餐', '日韩料理', '快餐', '小吃', '甜品', '饮品', '火锅', '烧烤'];
  const allSpecialTags = ['清真', '素食', '减脂餐', '低卡', '低敏', '维生素'];

  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter(r => {
      // 1. Campus
      if (r.campus !== selectedCampus) return false;
      // 2. Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!r.name.toLowerCase().includes(query) && !r.category.toLowerCase().includes(query)) return false;
      }
      // 3. Category
      if (selectedCategory !== '全部' && r.category !== selectedCategory) return false;
      // 4. Special Tags
      if (activeSpecialTags.length > 0) {
        if (!r.specialTags) return false;
        const hasAllTags = activeSpecialTags.every(tag => r.specialTags!.includes(tag));
        if (!hasAllTags) return false;
      }
      // 5. Night Delivery / Night Open
      if (showNightOnly && !r.nightDelivery && !r.tags.includes('夜宵')) return false;
      // 6. Street Vendors
      if (showVendorsOnly && !r.isStreetVendor) return false;
      
      return true;
    });
  }, [selectedCampus, searchQuery, selectedCategory, activeSpecialTags, showNightOnly, showVendorsOnly]);

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] relative bg-orange-50/30">
      {/* 顶部控制栏 */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E2001A] to-[#FF9512] flex items-center justify-center text-white shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 hidden md:block">美食地图探索</h2>
            </div>
            <div className="flex items-center gap-3">
              <CampusSelector selected={selectedCampus} onSelect={(id) => {
                setSelectedCampus(id);
                setSelectedRestaurant(null);
              }} />
              <button 
                className="lg:hidden p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 地图容器 - 全新主题色 */}
      <div className="w-full h-full pt-20 bg-orange-50">
        <div className="relative w-full h-full bg-[#FAFAFA] overflow-hidden">
          {/* 模拟地图网格 */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-12 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-orange-900/10"></div>
              ))}
            </div>
          </div>

          {/* 校区中心标记 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#E2001A] rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-full p-4 shadow-lg ring-4 ring-white">
                <Navigation className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-4 py-1.5 rounded-full shadow-lg text-sm font-bold text-[#E2001A] border border-orange-100">
                {campuses.find(c => c.id === selectedCampus)?.name}
              </div>
            </div>
          </div>

          {/* 餐厅标记 */}
          <div className="absolute inset-0">
            {filteredRestaurants.map((restaurant) => {
              // 根据ID生成固定的相对坐标
              const idNum = parseInt(restaurant.id.replace(/\D/g, '')) || 1;
              const angle = (idNum * 137.5) * Math.PI / 180;
              const radius = 120 + (idNum % 6) * 45;
              const x = 50 + Math.cos(angle) * (radius / 10);
              const y = 50 + Math.sin(angle) * (radius / 10);

              const isHovered = hoveredRestaurant === restaurant.id;
              const isSelected = selectedRestaurant?.id === restaurant.id;

              return (
                <div
                  key={restaurant.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ 
                    left: `${x}%`, 
                    top: `${y}%`,
                    zIndex: isHovered || isSelected ? 30 : 10
                  }}
                  onMouseEnter={() => setHoveredRestaurant(restaurant.id)}
                  onMouseLeave={() => setHoveredRestaurant(null)}
                  onClick={() => setSelectedRestaurant(restaurant)}
                >
                  <div className={`relative transition-all duration-300 ${isHovered || isSelected ? 'scale-125' : 'scale-100'}`}>
                    <div className={`bg-white rounded-full p-1.5 shadow-md border-2 transition-colors ${
                      isSelected ? 'border-[#E2001A] shadow-orange-500/30 shadow-lg' : isHovered ? 'border-[#FF9512]' : 'border-transparent'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-inner ${
                        restaurant.isStreetVendor 
                          ? 'bg-gradient-to-br from-amber-400 to-emerald-500'
                          : 'bg-gradient-to-br from-[#E2001A] to-[#FF9512]'
                      }`}>
                        {restaurant.isStreetVendor ? '🛒' : '🍽️'}
                      </div>
                    </div>
                    
                    {(isHovered || isSelected) && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl p-3 min-w-[200px] border border-orange-100 z-50">
                        <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                          {restaurant.name}
                          {restaurant.isStreetVendor && <span className="text-[10px] font-normal bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">游走小摊</span>}
                        </div>
                        <div className="text-xs text-gray-500 mb-2 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-orange-400" />
                          <span className="line-clamp-2">{restaurant.location.description || '校园周边'}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-orange-600">{restaurant.rating}</span>
                          </div>
                          <span className="text-gray-400 text-xs">距离 {restaurant.distance}m</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 左侧侧边栏 - 搜索与列表 */}
      <div className={`absolute left-0 lg:left-4 top-20 lg:top-24 bottom-0 lg:bottom-4 w-full lg:w-[380px] bg-white lg:rounded-2xl shadow-xl flex flex-col z-20 overflow-hidden border border-gray-100 transition-transform duration-300 ${
        showSidebar ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
      } lg:flex`}>
        {/* 标签页切换 */}
        <div className="flex bg-gray-50/50 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('restaurants')} 
            className={`flex-1 py-3.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'restaurants' ? 'text-[#E2001A] border-b-2 border-[#E2001A] bg-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            附近餐厅
          </button>
          <button 
            onClick={() => setActiveTab('canteen')} 
            className={`flex-1 py-3.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'canteen' ? 'text-[#E2001A] border-b-2 border-[#E2001A] bg-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Store className="w-4 h-4" />
            食堂攻略
          </button>
          <button 
            onClick={() => setActiveTab('challenges')} 
            className={`flex-1 py-3.5 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'challenges' ? 'text-[#E2001A] border-b-2 border-[#E2001A] bg-white' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            美食挑战
          </button>
        </div>
        
        {activeTab === 'restaurants' && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* 搜索与筛选区 */}
            <div className="p-4 border-b border-gray-100 shrink-0 bg-white">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="搜索餐厅名称、品类..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
                />
              </div>
              
              {/* 品类分类 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(c => (
                  <button 
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === c 
                        ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white shadow-sm' 
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* 特殊标签筛选 */}
              <div className="flex flex-wrap gap-2">
                {allSpecialTags.map(tag => (
                   <button 
                     key={tag}
                     onClick={() => setActiveSpecialTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                     className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                       activeSpecialTags.includes(tag) 
                        ? 'border-[#E2001A] text-[#E2001A] bg-red-50' 
                        : 'border-gray-200 text-gray-500 hover:border-orange-300'
                     }`}
                   >
                     {tag}
                   </button>
                ))}
                <button 
                   onClick={() => setShowNightOnly(!showNightOnly)}
                   className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                     showNightOnly ? 'border-orange-400 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-500 hover:border-orange-300'
                   }`}
                >
                  🌙 夜宵
                </button>
                <button 
                   onClick={() => setShowVendorsOnly(!showVendorsOnly)}
                   className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
                     showVendorsOnly ? 'border-emerald-400 text-emerald-600 bg-emerald-50' : 'border-gray-200 text-gray-500 hover:border-emerald-300'
                   }`}
                >
                  🛒 小摊
                </button>
              </div>
            </div>
            
            {/* 餐厅列表 */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2">
              <div className="px-2 py-2 text-xs font-medium text-gray-400">
                为您找到 {filteredRestaurants.length} 家餐厅
              </div>
              
              <div className="space-y-2">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`bg-white p-3 rounded-xl border transition-all cursor-pointer group relative ${
                      selectedRestaurant?.id === restaurant.id 
                        ? 'border-[#E2001A] shadow-md ring-1 ring-red-100' 
                        : 'border-gray-100 hover:border-orange-200 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedRestaurant(restaurant)}
                    onMouseEnter={() => setHoveredRestaurant(restaurant.id)}
                    onMouseLeave={() => {
                      setHoveredRestaurant(null);
                      if (eatTodayId !== restaurant.id) {
                        // Keep open if interacting, else we can clear or keep it, let's keep it open until click outside
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 shrink-0">
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                        {restaurant.isStreetVendor && (
                          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            摊
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 truncate pr-2">
                            {restaurant.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#E2001A] shrink-0 bg-red-50 px-1.5 py-0.5 rounded">
                            ¥{restaurant.price}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 truncate">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{restaurant.category}</span>
                          {restaurant.specialTags?.slice(0,1).map(t => (
                            <span key={t} className="bg-green-50 text-green-600 px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                            <span className="font-medium text-gray-700">{restaurant.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {restaurant.distance}m
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive "今天吃了" Layer */}
                    <div className="absolute bottom-3 right-3 z-10" onClick={e => e.stopPropagation()}>
                      {eatTodayId === restaurant.id ? (
                        <div className="flex gap-1.5 bg-white/95 backdrop-blur-sm shadow-[0_4px_12px_rgba(226,0,26,0.15)] border border-orange-100 rounded-lg p-1.5 transition-all duration-300">
                          <button onClick={(e) => { e.stopPropagation(); toast.success('打卡：好吃！进度+1'); setEatTodayId(null); }} className="text-[10px] sm:text-xs bg-orange-50 hover:bg-orange-100 text-orange-600 px-1.5 sm:px-2 py-1 rounded font-medium whitespace-nowrap">🤤好吃</button>
                          <button onClick={(e) => { e.stopPropagation(); toast.success('打卡：排队久！进度+1'); setEatTodayId(null); }} className="text-[10px] sm:text-xs bg-red-50 hover:bg-red-100 text-[#E2001A] px-1.5 sm:px-2 py-1 rounded font-medium whitespace-nowrap">⌛排队</button>
                          <button onClick={(e) => { e.stopPropagation(); toast.success('打卡：确实有！进度+1'); setEatTodayId(null); }} className="text-[10px] sm:text-xs bg-green-50 hover:bg-green-100 text-green-600 px-1.5 sm:px-2 py-1 rounded font-medium whitespace-nowrap">✊打卡</button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setEatTodayId(restaurant.id); }}
                          className="bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                          今天吃了
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredRestaurants.length === 0 && (
                  <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                    <Search className="w-8 h-8 mb-2 text-gray-300" />
                    <p>没有找到符合条件的餐厅</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('全部');
                        setActiveSpecialTags([]);
                        setShowNightOnly(false);
                        setShowVendorsOnly(false);
                      }}
                      className="mt-4 text-sm text-[#E2001A] hover:underline"
                    >
                      清空筛选条件
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'canteen' && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            <div className="bg-gradient-to-r from-orange-100 to-red-50 p-4 rounded-xl mb-2">
              <h3 className="font-bold text-gray-900 mb-1">去外校蹭饭指南 🏃</h3>
              <p className="text-xs text-gray-600">整理了周边院校的食堂进入条件与必吃推荐</p>
            </div>
            
            {canteenGuides.map(guide => (
              <div key={guide.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                 <div className="bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3 border-b border-orange-100">
                   <h4 className="font-bold text-[#E2001A] flex items-center gap-2">
                     <Store className="w-4 h-4" />
                     {guide.school}
                   </h4>
                 </div>
                 <div className="p-4 space-y-4">
                   {guide.canteens.map((c, idx) => (
                      <div key={idx} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-800 text-sm">{c.name}</span>
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md">
                            人均 ¥{c.avgPrice}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 space-y-2">
                          <div className="flex items-start gap-1.5">
                            <span className="text-gray-400 shrink-0">🎫 门禁：</span>
                            <span className="leading-snug">{c.access}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="text-orange-400 shrink-0">⭐ 推荐：</span>
                            <span className="leading-snug text-gray-700 font-medium">{c.recommendation}</span>
                          </div>
                          {c.tips && (
                            <div className="flex items-start gap-1.5 mt-2 bg-orange-50/50 p-2 rounded text-orange-600">
                              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5"/>
                              <span className="leading-snug">{c.tips}</span>
                            </div>
                          )}
                        </div>
                      </div>
                   ))}
                 </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            <div className="bg-gradient-to-r from-orange-100 to-red-50 p-5 rounded-xl mb-2 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-[#E2001A]" />
                  每周美食挑战
                </h3>
                <p className="text-xs text-gray-600">完成挑战收集徽章，赢取霸王餐与丰厚优惠！</p>
              </div>
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
            </div>

            <div className="space-y-3">
              {challenges.map(challenge => {
                const percent = Math.min(100, Math.round((challenge.progress / challenge.target) * 100));
                return (
                  <div key={challenge.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{challenge.badge.split(' ')[0]}</span>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{challenge.title}</h4>
                          <p className="text-xs text-gray-500">{challenge.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-md shrink-0">
                        {challenge.progress}/{challenge.target}
                      </span>
                    </div>

                    <div className="mt-3 mb-3">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#E2001A] to-[#FF9512] transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Gift className="w-3.5 h-3.5 text-orange-500" />
                        <span className="truncate max-w-[150px]">{challenge.reward}</span>
                      </div>
                      
                      {challenge.status === 'completed' ? (
                        <button 
                          onClick={() => handleClaimReward(challenge.id)}
                          className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-full shadow-sm hover:shadow-md transition-all animate-pulse"
                        >
                          领取奖励
                        </button>
                      ) : challenge.status === 'claimed' ? (
                        <span className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-400 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />已领取
                        </span>
                      ) : (
                        <span className="text-xs font-medium px-3 py-1.5 bg-gray-50 text-gray-400 rounded-full">
                          进行中
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 餐厅详情弹窗 */}
      {selectedRestaurant && (
        <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:top-24 lg:bottom-auto lg:right-4 lg:w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden z-30 border border-gray-100 flex flex-col max-h-[calc(100vh-8rem)]">
          <div className="relative h-56 shrink-0">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md rounded-full p-2.5 transition-colors"
            >
              ✕
            </button>
            
            {selectedRestaurant.studentDiscount && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 border border-white/20">
                <span>🎓</span> {selectedRestaurant.studentDiscount}
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="text-2xl font-bold mb-2 drop-shadow-md flex items-center gap-2">
                {selectedRestaurant.name}
                {selectedRestaurant.regionalAuth && (
                  <span className="text-[10px] font-normal bg-orange-500/80 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {selectedRestaurant.regionalAuth}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium opacity-90">
                <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {selectedRestaurant.rating}
                </div>
                <span className="bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">{selectedRestaurant.category}</span>
                <span className="bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm text-orange-200">人均 ¥{selectedRestaurant.price}</span>
              </div>
            </div>
          </div>
          
          <div className="p-5 overflow-y-auto flex-1 bg-white">
            {/* 地理位置信息 */}
            <div className="flex items-start gap-3 mb-5 p-3.5 bg-orange-50/50 rounded-xl border border-orange-100/50">
              <MapPin className="w-5 h-5 text-[#E2001A] shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-gray-900 mb-1 flex items-center flex-wrap gap-2">
                  {selectedRestaurant.location.description || '校园周边'} 
                  <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm">距离 {selectedRestaurant.distance}m</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 营业时间：{selectedRestaurant.openHours}
                </div>
              </div>
            </div>

            {/* 标签墙 */}
            <div className="flex flex-wrap gap-2 mb-5">
              {selectedRestaurant.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                  {tag}
                </span>
              ))}
              {selectedRestaurant.specialTags?.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-md font-medium border border-green-100">
                  {tag}
                </span>
              ))}
              {selectedRestaurant.nightDelivery && (
                <span className="text-xs px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md font-medium border border-orange-100 flex items-center gap-1">
                  🌙 夜宵配送
                </span>
              )}
            </div>

            {/* 真实评价打卡 */}
            {selectedRestaurant.verifyVotes && (
              <div className="mb-5 bg-gray-50 rounded-xl p-3.5 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-br from-orange-200 to-red-200 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <h4 className="text-xs font-bold text-gray-500">同学真实打卡 (点击支持)</h4>
                </div>
                <div className="flex gap-2 relative z-10">
                  <button 
                    onClick={() => toast.success('打卡成功：确实有！进度+1')}
                    className="flex-1 bg-white p-2.5 rounded-lg text-center border border-gray-100 shadow-sm hover:border-green-300 hover:bg-green-50 transition-colors group"
                  >
                    <div className="text-xl mb-1 group-hover:scale-110 transition-transform">✊</div>
                    <div className="text-xs text-gray-600 font-medium">{selectedRestaurant.verifyVotes.hasIt}人说有</div>
                  </button>
                  <button 
                    onClick={() => toast.success('打卡成功：排队久！进度+1')}
                    className="flex-1 bg-white p-2.5 rounded-lg text-center border border-gray-100 shadow-sm hover:border-red-300 hover:bg-red-50 transition-colors group"
                  >
                    <div className="text-xl mb-1 group-hover:scale-110 transition-transform">⌛</div>
                    <div className="text-xs text-gray-600 font-medium">排队久</div>
                  </button>
                  <button 
                    onClick={() => toast.success('打卡成功：很好吃！进度+1')}
                    className="flex-1 bg-white p-2.5 rounded-lg text-center border border-gray-100 shadow-sm hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🤤</div>
                    <div className="text-xs text-gray-600 font-medium">{selectedRestaurant.verifyVotes.tasty}人觉得赞</div>
                  </button>
                </div>
              </div>
            )}

            {/* 人气推荐 */}
            {selectedRestaurant.popularDishes && selectedRestaurant.popularDishes.length > 0 && (
              <div className="mb-5">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🔥 人气必点
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRestaurant.popularDishes.map((dish, i) => (
                    <span key={i} className="text-sm font-medium text-orange-700 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100/50">
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 商家描述 */}
            {selectedRestaurant.description && (
              <div className="mb-5 text-sm text-gray-600 leading-relaxed">
                {selectedRestaurant.description}
              </div>
            )}
            
            <div className="pt-2">
              <button 
                onClick={() => navigate(`/restaurant/${selectedRestaurant.id}`)}
                className="w-full py-3.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center gap-2"
              >
                查看完整餐厅主页 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 奖励领取炫酷弹窗 */}
      {claimedReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center relative overflow-hidden transform transition-all scale-100 animate-[bounce_0.5s_ease-out_1]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-red-50/50"></div>
            {/* 炫酷放射光效 */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10 w-full">
              <div className="text-7xl mb-6 animate-bounce drop-shadow-xl select-none">
                {claimedReward.badge.split(' ')[0]}
              </div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E2001A] to-[#FF9512] mb-2 tracking-wide">
                挑战完成！
              </h2>
              <p className="text-gray-600 font-medium mb-6">
                恭喜达成「<span className="text-orange-600 font-bold">{claimedReward.title}</span>」
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 mb-8 border border-orange-200/50 w-full shadow-inner relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-4xl opacity-10 rotate-12">🎁</div>
                <div className="text-sm text-orange-600 font-bold mb-2">🎉 获得专属奖励</div>
                <div className="text-xl font-black text-gray-900 bg-white/60 py-2 rounded-xl border border-white/50 backdrop-blur-sm">{claimedReward.reward}</div>
                <div className="text-sm font-bold text-gray-900 mt-3 flex items-center justify-center gap-1">
                  徽章解锁：<span className="bg-orange-100 px-2 py-0.5 rounded text-orange-700">{claimedReward.badge}</span>
                </div>
              </div>

              <button 
                onClick={() => setClaimedReward(null)}
                className="w-full py-4 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-xl font-black text-lg hover:shadow-xl hover:shadow-orange-300/50 transition-all transform hover:-translate-y-1 active:scale-95"
              >
                开心收下
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
