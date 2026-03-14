import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Heart, MapPin, Star, Settings, LogOut, ChevronRight, Award, Clock, Bookmark, Ticket, UploadCloud, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { mockRestaurants, mockGroupOrders, currentUser } from '../data/mockData';

export function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'coupons' | 'bookmarks' | 'history' | 'uploads' | 'group-orders' | 'reviews'>('coupons');

  // 模拟用户数据从 mockData 引入
  const user = currentUser;

  // 模拟优惠券数据
  const myCoupons = [
    {
      id: '1',
      title: '免费饮品券',
      description: '感谢上传商家，可在任意饮品店免费兑换一杯饮品',
      restaurantName: '通用',
      validUntil: '2026-06-30',
      value: '¥15',
      type: 'reward' as const
    },
    {
      id: '2',
      title: '星巴克9折优惠',
      description: '凭北京服装学院学生证享受',
      restaurantName: '星巴克咖啡',
      validUntil: '2026-12-31',
      value: '9折',
      type: 'discount' as const
    },
    {
      id: '3',
      title: '海底捞学生优惠',
      description: '学生专享6.9折',
      restaurantName: '海底捞火锅',
      validUntil: '2026-12-31',
      value: '6.9折',
      type: 'discount' as const
    },
    {
      id: '4',
      title: '日式拉面免费汤品',
      description: '凭中医药大学学生证免费领取一碗汤',
      restaurantName: '日式拉面馆',
      validUntil: '2026-12-31',
      value: '免费汤',
      type: 'free' as const
    },
    {
      id: '5',
      title: '满30减5',
      description: '串香麻辣烫学生优惠',
      restaurantName: '串香麻辣烫',
      validUntil: '2026-12-31',
      value: '-¥5',
      type: 'discount' as const
    }
  ];

  // 收藏的餐厅
  const favoriteRestaurants = mockRestaurants.slice(0, 4);
  const visitedRestaurants = mockRestaurants.slice(2, 6);
  // 用户上传的餐厅
  const uploadedRestaurants = mockRestaurants.filter(r => r.id === 'new-store-mock' || r.id === '13'); // Mocking some uploaded places

  // 我的拼单记录 (我发起的 + 我加入的)
  const myGroupOrders = mockGroupOrders;

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white relative">
        {/* 右上角设置菜单 */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors backdrop-blur-sm"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
          
          {showSettingsMenu && (
            <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl overflow-hidden py-1 border border-gray-100 origin-top-right">
              <button 
                onClick={() => setShowSettingsMenu(false)}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-[#E2001A] transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" /> 账号设置
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button 
                onClick={() => setShowSettingsMenu(false)}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> 退出登录
              </button>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            {/* 头像 */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white/30 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-sm font-semibold shadow-lg">
                Lv.5
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
              <div className="flex flex-col md:flex-row items-center gap-2 text-white/80 text-sm mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {user.campus}
                </span>
                <span className="hidden md:block">·</span>
                <span>加入于 {user.joinDate}</span>
              </div>
              <p className="text-sm text-white/90 mb-4 bg-white/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                {user.bio}
              </p>

              {/* 统计数据 */}
              <div className="grid grid-cols-4 gap-4 max-w-md">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.favorites}</div>
                  <div className="text-xs text-white/70">收藏</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.visited}</div>
                  <div className="text-xs text-white/70">足迹</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.reviews}</div>
                  <div className="text-xs text-white/70">评价</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.points}</div>
                  <div className="text-xs text-white/70">积分</div>
                </div>
              </div>
            </div>

            {/* 编辑按钮 */}
            <button className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors">
              编辑资料
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 学生认证 (置于顶部满宽) */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900">学生认证</h3>
                <button 
                  onClick={() => setShowHistoryModal(true)}
                  className="px-2 py-0.5 bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-xs rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3 h-3" /> 历史认证
                </button>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full border border-green-200">
                已认证
              </span>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-5 rounded-xl border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">
                  🎓
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-lg">北京服装学院</div>
                  <div className="text-sm text-gray-500 mt-1">2024级 · 数字媒体艺术专业的研究生</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                认证有效期至：2027年7月
              </div>
            </div>
          </div>
        </div>

        {/* 标签切换与内容区 */}
        <div>
          {/* 标签切换 */}
          <div className="bg-white rounded-xl shadow-md mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('coupons')}
                  className={`flex-1 py-4 px-6 transition-colors relative ${
                    activeTab === 'coupons'
                      ? 'text-[#E2001A] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Ticket className="w-5 h-5" />
                    <span>优惠券</span>
                  </div>
                  {activeTab === 'coupons' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`flex-1 py-4 px-6 transition-colors relative ${
                    activeTab === 'bookmarks'
                      ? 'text-[#E2001A] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Bookmark className="w-5 h-5" />
                    <span>我的收藏</span>
                  </div>
                  {activeTab === 'bookmarks' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-4 px-6 transition-colors relative ${
                    activeTab === 'history'
                      ? 'text-[#E2001A] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>浏览记录</span>
                  </div>
                  {activeTab === 'history' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('uploads')}
                  className={`flex-1 py-4 px-6 transition-colors relative ${
                    activeTab === 'uploads'
                      ? 'text-[#E2001A] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <UploadCloud className="w-5 h-5" />
                    <span>我的上传</span>
                  </div>
                  {activeTab === 'uploads' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('group-orders')}
                  className={`flex-1 py-4 px-6 transition-colors relative ${
                    activeTab === 'group-orders'
                      ? 'text-[#E2001A] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>我的拼单</span>
                  </div>
                  {activeTab === 'group-orders' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512]"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-4 px-6 transition-colors relative ${
                    activeTab === 'reviews'
                      ? 'text-[#E2001A] font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>评价</span>
                  </div>
                  {activeTab === 'reviews' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512]"></div>
                  )}
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="space-y-4">
              {activeTab === 'coupons' && myCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Ticket className="w-10 h-10 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#E2001A] transition-colors">
                        {coupon.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {coupon.restaurantName}
                        </span>
                        <span>有效期至 {coupon.validUntil}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {coupon.description}
                      </div>
                    </div>
                    <button className="flex-shrink-0 px-4 py-2 text-sm text-white bg-gradient-to-r from-[#E2001A] to-[#FF9512] hover:opacity-90 rounded-lg transition-colors">
                      使用
                    </button>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'bookmarks' && favoriteRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#E2001A] transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {restaurant.category}
                        </span>
                        <span>¥{restaurant.price}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        加入收藏：2024年3月{Math.floor(Math.random() * 13) + 1}日
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${restaurant.id}`); }}
                      className="flex-shrink-0 px-4 py-2 text-sm text-white bg-gradient-to-r from-[#E2001A] to-[#FF9512] hover:opacity-90 rounded-lg transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'history' && visitedRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#E2001A] transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          {restaurant.category}
                        </span>
                        <span>¥{restaurant.price}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        浏览时间：刚刚
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${restaurant.id}`); }}
                      className="flex-shrink-0 px-4 py-2 text-sm text-[#E2001A] hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      查看详情
                    </button>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'uploads' && (
                uploadedRestaurants.length > 0 ? uploadedRestaurants.map((restaurant, index) => (
                  <motion.div
                    key={restaurant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#E2001A] transition-colors">
                            {restaurant.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs border border-green-200 rounded-full">
                            已上线
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="px-2 py-0.5 bg-gray-100 rounded">
                            {restaurant.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span> {restaurant.rating}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>由我上传于 2026年3月</span>
                          <span className="text-orange-500">帮助了 {restaurant.verifyVotes?.hasIt || 0} 位同学</span>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/restaurant/${restaurant.id}`); }}
                        className="flex-shrink-0 px-4 py-2 text-sm text-[#E2001A] hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        查看详情
                      </button>
                    </div>
                  </motion.div>
                )) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无上传记录</h3>
                    <p className="text-gray-600 mb-6">发现新店？快去首页上传，帮助更多同学！</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      去首页上传
                    </button>
                  </div>
                )
              )}

              {activeTab === 'group-orders' && (
                myGroupOrders.length > 0 ? myGroupOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                  >
                    <div className="flex gap-4 p-4">
                      <img
                        src={order.restaurantImage}
                        alt={order.restaurantName}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-[#E2001A] transition-colors">
                            {order.restaurantName}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-lg ${
                            order.status === 'recruiting' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                            order.status === 'full' ? 'bg-green-50 text-green-600 border border-green-200' :
                            'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}>
                            {order.status === 'recruiting' ? '拼单中' :
                             order.status === 'full' ? '已满员' : '已完成'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <Clock className="w-4 h-4" />
                          <span>{order.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {order.joinedUsers.map((u, i) => (
                              <img key={i} src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100" />
                            ))}
                            {order.joinedUsers.length < order.totalSlots && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                                +{order.totalSlots - order.joinedUsers.length}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-[#E2001A]">
                            进度 {order.joinedUsers.length}/{order.totalSlots}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-6xl mb-4">🤝</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无拼单记录</h3>
                    <p className="text-gray-600 mb-6">去商家详情页发起拼单，和同学一起享受美食吧！</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-lg hover:opacity-90 transition-all"
                    >
                      去探索美食
                    </button>
                  </div>
                )
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {[
                    {
                      id: 'my-r1',
                      restaurantId: '1',
                      restaurantName: '老北京炸酱面',
                      rating: 5,
                      content: '这家炸酱面真的很正宗，份量很足，酱香浓郁，每次不知道吃什么的时候就会来这里，强烈推荐他们家的小碗干炸！',
                      date: '2026-03-10',
                      images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'],
                      tags: ['份量足', '地道老店'],
                      likes: 12
                    },
                    {
                      id: 'my-r2',
                      restaurantId: '3',
                      restaurantName: '串香麻辣烫',
                      rating: 4,
                      content: '离学校很近，下课直接过来很方便。菜品很新鲜，红油锅底又麻又辣，就是饭点排队人有点多。',
                      date: '2026-03-05',
                      images: ['https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'],
                      tags: ['麻辣过瘾', '排队王'],
                      likes: 5
                    }
                  ].map((review, idx) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div 
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => navigate(`/restaurant/${review.restaurantId}`)}
                        >
                          <h3 className="font-bold text-gray-900 group-hover:text-[#E2001A] transition-colors">{review.restaurantName}</h3>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#E2001A]" />
                        </div>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 leading-relaxed">{review.content}</p>
                      
                      {review.images && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((img, imgIdx) => (
                            <img key={imgIdx} src={img} alt="评价配图" className="w-20 h-20 rounded-lg object-cover" />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex gap-2">
                          {review.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Heart className="w-4 h-4" /> {review.likes}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>

      {/* 历史认证弹窗 */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                历史认证记录
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-white shadow-sm border border-gray-200 p-5 rounded-xl opacity-80 grayscale-[20%]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">学生认证</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full border border-gray-200">
                    已过期
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl flex-shrink-0">
                      🎓
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">北京服装学院</div>
                      <div className="text-sm text-gray-500 mt-0.5">2020级 · 数字媒体艺术专业本科</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 border-t border-gray-200 pt-2 mt-1">
                    认证有效期至：2024年7月
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}