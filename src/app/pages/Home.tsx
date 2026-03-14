import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { RestaurantCard } from '../components/RestaurantCard';
import { WhatToEatDialog } from '../components/WhatToEatDialog';
import { UploadRestaurantDialog } from '../components/UploadRestaurantDialog';
import { StartGroupOrderDialog } from '../components/StartGroupOrderDialog';
import { GroupOrderDetailModal } from '../components/GroupOrderDetailModal';
import { mockRestaurants, todayRecommendations, categories, campuses, mockGroupOrders, GroupOrder } from '../data/mockData';
import { ChevronRight, Sparkles, Filter, SlidersHorizontal, Upload, Users, Plus, CheckCircle, ArrowRight, Clock, Store, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import heroBgImage from 'figma:asset/258ce63629ac7acdb6d401ec8702c019518a94d2.png';

export function Home() {
  const navigate = useNavigate();
  const [selectedCampus, setSelectedCampus] = useState('bift');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [showWhatToEat, setShowWhatToEat] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showStartGroupOrder, setShowStartGroupOrder] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
  const [joinedOrders, setJoinedOrders] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [localGroupOrders, setLocalGroupOrders] = useState<GroupOrder[]>(mockGroupOrders);
  const [detailOrder, setDetailOrder] = useState<GroupOrder | null>(null);
  const [successOrder, setSuccessOrder] = useState<GroupOrder | null>(null);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  
  const commonAllergens = ['花生', '海鲜', '乳制品', '麸质', '大豆', '坚果'];

  useEffect(() => {
    const handleUpdate = () => {
      setLocalGroupOrders([...mockGroupOrders]);
    };
    window.addEventListener('groupOrdersUpdated', handleUpdate);
    return () => window.removeEventListener('groupOrdersUpdated', handleUpdate);
  }, []);

  // 筛选餐厅（所有学校共享餐厅）
  const filteredRestaurants = useMemo(() => {
    let filtered = [...mockRestaurants]; // 不再按校区筛选

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.tags.some(tag => tag.toLowerCase().includes(query)) ||
        r.popularDishes.some(dish => dish.toLowerCase().includes(query))
      );
    }

    // 分类过滤
    if (selectedCategory !== '全部') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    // 价格过滤
    filtered = filtered.filter(r => r.price >= priceRange[0] && r.price <= priceRange[1]);

    // 有优惠过滤
    if (hasDiscountOnly) {
      filtered = filtered.filter(r => r.studentDiscount && r.campus === selectedCampus);
    }

    // 过敏原过滤
    if (selectedAllergens.length > 0) {
      filtered = filtered.filter(r => {
        // 如果餐厅标记了"无过敏原"，可以直接放行吗？取决于业务逻辑。这里如果用户选了某个过敏原，如果餐厅含有该过敏原就排除。
        if (!r.allergens) return true;
        return !r.allergens.some(a => selectedAllergens.includes(a));
      });
    }

    // 排序
    filtered.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  // 学生特惠餐厅（按当前校区筛选）
  const discountRestaurants = mockRestaurants.filter(r => r.studentDiscount && r.campus === selectedCampus);

  // 热门餐厅（按好吃投票排序）
  const hotRestaurants = [...mockRestaurants]
    .sort((a, b) => b.votes.delicious - a.votes.delicious)
    .slice(0, 6);

  // 同校拼单
  const campusGroupOrders = localGroupOrders.filter(g => g.campus === selectedCampus && g.status === 'recruiting').slice(0, 2);

  const handleUploadSuccess = () => {
    // 不要立即关闭对话框，对话框内部会处理
    // 3秒后显示奖励
    setTimeout(() => {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 5000);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Hero Section */}
      <div 
        className="text-white bg-cover bg-center relative"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">发现校园美食</h2>
              <p className="text-white/90">让每一餐都充满期待</p>
            </div>

            {/* 校区选择 - 改为紧凑的下拉式 */}
            <div className="flex justify-center mb-4">
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 outline-none cursor-pointer hover:bg-white/20 transition-colors"
              >
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.id} className="text-gray-900">
                    {campus.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 搜索框 */}
            <SearchBar onSearch={setSearchQuery} />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* 今日推荐 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#E2001A]" />
              <h2 className="text-2xl font-bold text-gray-900">今日推荐</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayRecommendations.map((dish, index) => (
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/restaurant/${dish.restaurantId}`)}
                className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-6 flex flex-col md:flex-row gap-4 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
              >
                {/* 霸榜标签 */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#E2001A] to-[#FF9512] text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                  霸占{dish.dominatedList} {dish.dominatedDays} 天
                </div>
                
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full md:w-32 h-40 md:h-32 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {dish.name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2 font-medium">
                    <span>所属商家：</span>
                    <span className="text-gray-800">{dish.restaurant}</span>
                  </div>
                  <p className="text-xs text-orange-600 mb-3 bg-orange-100/50 inline-block px-2 py-1 rounded-md self-start">{dish.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="text-xl font-bold text-[#E2001A]">
                      ¥{dish.price}
                    </div>
                    <span className="text-sm font-medium text-gray-500 group-hover:text-[#E2001A] flex items-center gap-1">
                      去看看 <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 同校拼单 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-[#E2001A]" />
              <h2 className="text-2xl font-bold text-gray-900">同校拼单</h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/group-orders')}
                className="text-gray-500 hover:text-[#E2001A] flex items-center gap-1 text-sm transition-colors"
              >
                更多拼单 <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowStartGroupOrder(true)}
                className="text-[#E2001A] flex items-center gap-1 text-sm bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
              >
                <Plus className="w-4 h-4" /> 发起拼单
              </button>
            </div>
          </div>
          
          {campusGroupOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campusGroupOrders.map((order, index) => {
                const isJoined = joinedOrders.includes(order.id);
                const currentJoinedCount = isJoined ? order.joinedUsers.length + 1 : order.joinedUsers.length;
                const progressPercentage = Math.min((currentJoinedCount / order.totalSlots) * 100, 100);

                return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 relative overflow-hidden group"
                >
                  <img
                    src={order.restaurantImage}
                    alt={order.restaurantName}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-[#E2001A] transition-colors flex items-center gap-2">
                      {order.restaurantName}
                      {isJoined && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs">{order.time}</span>
                      <span>由 {order.initiator.name} 发起</span>
                    </div>
                    
                    {/* 拼单进度条 */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#E2001A] to-[#FF9512] transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#E2001A]">
                        {currentJoinedCount}/{order.totalSlots}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-end mt-4 sm:mt-0">
                    {order.initiator.name === '我' ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailOrder(order);
                        }}
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        查看拼单详情
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isJoined) {
                            setJoinedOrders(prev => [...prev, order.id]);
                            const newJoinedCount = order.joinedUsers.length + 1;
                            if (newJoinedCount === order.totalSlots) {
                              setSuccessOrder(order);
                            } else {
                              toast.success('加入拼单成功！请在个人中心查看。');
                            }
                          } else {
                            toast.info('您已经加入了这个拼单');
                          }
                        }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isJoined 
                            ? 'bg-green-50 text-green-600 border border-green-200' 
                            : 'bg-[#E2001A] text-white hover:bg-[#C10016]'
                        }`}
                      >
                        {isJoined ? '已加入' : '加入'}
                      </button>
                    )}
                  </div>
                </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">当前校区暂无拼单，快去发起一个吧！</p>
            </div>
          )}
        </section>

        {/* 吃什么按钮 */}
        <section>
          <div className="rounded-2xl bg-gradient-to-r from-[#E2001A] to-[#FF9512] p-[3px] shadow-xl hover:shadow-2xl transition-shadow">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowWhatToEat(true)}
              className="w-full py-6 bg-[#FFFDF8] text-[#E2001A] rounded-[13px] transition-all flex items-center justify-center gap-3 text-xl font-bold"
            >
              <Sparkles className="w-6 h-6" />
              不知道吃什么？点我随机推荐！
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </section>

        {/* 学生特惠 */}
        {discountRestaurants.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">💰 学生特惠</h2>
              <button className="text-[#E2001A] flex items-center gap-1 hover:gap-2 transition-all">
                查看更多 <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {discountRestaurants.slice(0, 3).map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RestaurantCard 
                    restaurant={restaurant} 
                    selectedCampus={selectedCampus}
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 场景榜单 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🌟 场景推荐榜</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['约会', '自习', '夜宵'].map((scene) => (
              <div key={scene} className="bg-white rounded-xl shadow-md border border-orange-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 border-b border-orange-100 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900">
                    {scene === '约会' ? '💕 约会精选' : scene === '自习' ? '📚 自习好去处' : '🌙 深夜食堂'}
                  </h3>
                  <span className="text-xs text-orange-600 bg-white px-2 py-1 rounded-full font-medium shadow-sm">Top 3</span>
                </div>
                <div className="p-4 space-y-4">
                  {mockRestaurants
                    .filter(r => (!selectedCampus || r.campus === selectedCampus) && r.tags && r.tags.includes(scene))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map((r, idx) => (
                      <div key={r.id} onClick={() => navigate(`/restaurant/${r.id}`)} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-gray-300 text-white' : 'bg-amber-600 text-white'}`}>
                          {idx + 1}
                        </div>
                        <img src={r.image} alt={r.name} className="w-12 h-12 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">{r.name}</h4>
                          <p className="text-xs text-gray-500 truncate">{r.category} · {r.distance}m</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 热门餐厅 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔥 热门餐厅</h2>
          </div>

          {/* 筛选器 */}
          <div className="mb-6 space-y-4">
            {/* 分类筛选 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-500 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#E2001A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 排序和价格 */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#E2001A]"
                >
                  <option value="distance">距离最近</option>
                  <option value="rating">评分最高</option>
                  <option value="price">价格最低</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm text-gray-600">价格：</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="flex-1 accent-[#E2001A]"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  ¥0 - ¥{priceRange[1]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer bg-red-50 text-[#E2001A] px-3 py-2 rounded-lg transition-colors hover:bg-red-100">
                  <input
                    type="checkbox"
                    checked={hasDiscountOnly}
                    onChange={(e) => setHasDiscountOnly(e.target.checked)}
                    className="accent-[#E2001A] w-4 h-4"
                  />
                  <span className="text-sm font-medium">有优惠</span>
                </label>
              </div>
            </div>

            {/* 过敏原筛选 */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600 mr-2">避开过敏原：</span>
              {commonAllergens.map(allergen => (
                <button
                  key={allergen}
                  onClick={() => {
                    setSelectedAllergens(prev => 
                      prev.includes(allergen) 
                        ? prev.filter(a => a !== allergen) 
                        : [...prev, allergen]
                    )
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    selectedAllergens.includes(allergen)
                      ? 'bg-[#E2001A] text-white border-[#E2001A] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {selectedAllergens.includes(allergen) && '✓ '}{allergen}
                </button>
              ))}
              {selectedAllergens.length > 0 && (
                <button 
                  onClick={() => setSelectedAllergens([])}
                  className="text-xs text-gray-400 hover:text-[#E2001A] ml-2 underline"
                >
                  清除
                </button>
              )}
            </div>
          </div>

          {/* 餐厅列表 */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <RestaurantCard 
                    restaurant={restaurant} 
                    selectedCampus={selectedCampus}
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">没有找到符合条件的餐厅</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('全部');
                  setPriceRange([0, 100]);
                }}
                className="mt-4 px-6 py-2 bg-[#E2001A] text-white rounded-lg hover:bg-[#C10016] transition-colors"
              >
                重置筛选
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 吃什么对话框 */}
      <WhatToEatDialog
        isOpen={showWhatToEat}
        onClose={() => setShowWhatToEat(false)}
        campus={selectedCampus}
      />

      {/* 上传餐厅对话框 */}
      <UploadRestaurantDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onSubmitSuccess={handleUploadSuccess}
        campus={selectedCampus}
      />

      {/* 悬浮上传按钮 - 右下角 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowUploadDialog(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:shadow-3xl transition-all"
      >
        <Upload className="w-7 h-7" />
      </motion.button>

      {/* 发起拼单对话框 */}
      <StartGroupOrderDialog
        isOpen={showStartGroupOrder}
        onClose={() => setShowStartGroupOrder(false)}
        onSuccess={(newOrder) => {
          mockGroupOrders.unshift(newOrder);
          window.dispatchEvent(new Event('groupOrdersUpdated'));
        }}
      />

      {/* 我的拼单详情对话框 */}
      <GroupOrderDetailModal
        isOpen={detailOrder !== null}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
      />

      {/* 奖励提示 */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎉</div>
              <div>
                <div className="font-bold text-lg">系统审核通过！</div>
                <div className="text-sm text-white/90">感谢你上传餐厅，赠送你一张饮品卡，下次去餐厅可以免费兑换饮品！</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 拼单成功（满员）弹窗 */}
      <AnimatePresence>
        {successOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center"
            >
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 py-8 px-6 text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <h3 className="text-2xl font-bold mb-1">拼单成功！</h3>
                <p className="text-white/90">人员已满，发车准备</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-left flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#E2001A] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">约定时间</div>
                    <div className="font-bold text-gray-900 text-lg">{successOrder.time}</div>
                    <div className="text-sm text-[#E2001A] mt-1">不见不散哦！</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-left flex items-start gap-3">
                  <Store className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">目标商家</div>
                    <div className="font-medium text-gray-900">{successOrder.restaurantName}</div>
                  </div>
                </div>

                <button
                  onClick={() => setSuccessOrder(null)}
                  className="w-full py-3 bg-[#E2001A] text-white font-bold rounded-xl hover:bg-[#C10016] hover:shadow-lg transition-all active:scale-95"
                >
                  我知道了
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}