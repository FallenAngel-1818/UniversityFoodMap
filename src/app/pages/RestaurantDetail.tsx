import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { mockRestaurants, mockGroupOrders } from '../data/mockData';
import { ArrowLeft, MapPin, Clock, Phone, Star, Calendar, Users, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../components/ui/badge';
import { ReviewDetailDialog } from '../components/ReviewDetailDialog';
import { StartGroupOrderDialog } from '../components/StartGroupOrderDialog';
import { toast } from 'sonner';

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = mockRestaurants.find(r => r.id === id);
  const [showReviewDetail, setShowReviewDetail] = useState(false);
  const [selectedReviewIndex, setSelectedReviewIndex] = useState(0);
  const [verifyVotes, setVerifyVotes] = useState(restaurant?.verifyVotes || { hasIt: 0, tasty: 0, closed: 0 });
  const [myVerify, setMyVerify] = useState<string | null>(null);
  const [showCouponConfirm, setShowCouponConfirm] = useState(false);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showStartGroupOrder, setShowStartGroupOrder] = useState(false);
  const [hasClickedEatToday, setHasClickedEatToday] = useState(false);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">餐厅不存在</h2>
          <button
            onClick={() => navigate('/')}
            className="text-[#E2001A] hover:underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const topDishes = restaurant.dishes?.filter(d => d.isPopular).slice(0, 3) || [];

  const handleVerify = (type: 'hasIt' | 'tasty' | 'closed') => {
    if (myVerify === type) {
      // 取消投票
      setVerifyVotes(prev => ({ ...prev, [type]: prev[type] - 1 }));
      setMyVerify(null);
    } else {
      // 新投票或更换投票
      if (myVerify) {
        setVerifyVotes(prev => ({ ...prev, [myVerify]: prev[myVerify as keyof typeof prev] - 1 }));
      }
      setVerifyVotes(prev => ({ ...prev, [type]: prev[type] + 1 }));
      setMyVerify(type);
    }
  };

  const openReviewDetail = (index: number) => {
    setSelectedReviewIndex(index);
    setShowReviewDetail(true);
  };

  const handleUseCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setShowCouponConfirm(true);
  };

  const confirmUseCoupon = () => {
    setShowCouponConfirm(false);
    setShowSuccessPrompt(true);
    setTimeout(() => {
      setShowSuccessPrompt(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="relative h-80 bg-gray-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* 返回按钮 */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(-1);
          }}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-20"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>

        {/* 右上角 今天吃了 交互区 */}
        <div className="absolute top-6 right-6 z-20">
          {!hasClickedEatToday ? (
            <button 
              onClick={() => setHasClickedEatToday(true)}
              className="bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white px-5 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              今天吃了
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, originX: 1, originY: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20 flex flex-col gap-2"
            >
              <div className="text-xs text-gray-500 font-medium px-1 mb-1">快捷评价，进度+1</div>
              <div className="flex gap-2">
                <button onClick={() => { handleVerify('tasty'); toast.success('打卡：好吃！进度+1'); setHasClickedEatToday(false); }} className="flex flex-col items-center gap-1 bg-orange-50 hover:bg-orange-100 p-2 rounded-xl min-w-[60px] transition-colors">
                  <span className="text-xl">🤤</span>
                  <span className="text-[10px] text-orange-600 font-bold">好吃</span>
                </button>
                <button onClick={() => { toast.success('打卡：排队久！进度+1'); setHasClickedEatToday(false); }} className="flex flex-col items-center gap-1 bg-red-50 hover:bg-red-100 p-2 rounded-xl min-w-[60px] transition-colors">
                  <span className="text-xl">⌛</span>
                  <span className="text-[10px] text-[#E2001A] font-bold">排队慢</span>
                </button>
                <button onClick={() => { toast.success('打卡：出餐快！进度+1'); setHasClickedEatToday(false); }} className="flex flex-col items-center gap-1 bg-yellow-50 hover:bg-yellow-100 p-2 rounded-xl min-w-[60px] transition-colors">
                  <span className="text-xl">⚡</span>
                  <span className="text-[10px] text-yellow-600 font-bold">出餐快</span>
                </button>
                <button onClick={() => { handleVerify('hasIt'); toast.success('打卡：确实有！进度+1'); setHasClickedEatToday(false); }} className="flex flex-col items-center gap-1 bg-green-50 hover:bg-green-100 p-2 rounded-xl min-w-[60px] transition-colors">
                  <span className="text-xl">✊</span>
                  <span className="text-[10px] text-green-600 font-bold">打卡</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* 餐厅基本信息 */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-semibold">{restaurant.rating}</span>
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                {restaurant.category}
              </span>
              <span className="text-lg font-semibold">¥{restaurant.price}/人</span>
            </div>
            {restaurant.description && (
              <p className="text-white/90">{restaurant.description}</p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 基础信息卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-md space-y-4 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">商家信息</h2>
            {/* 发起拼单按钮 */}
            <button
              onClick={() => setShowStartGroupOrder(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200 shadow-sm"
            >
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">发起拼单</span>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#E2001A]" />
              <div>
                <p className="text-sm text-gray-500">位置</p>
                <p className="font-medium">{restaurant.distance}m 距离校园</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#E2001A]" />
              <div>
                <p className="text-sm text-gray-500">营业时间</p>
                <p className="font-medium">{restaurant.openHours}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#E2001A]" />
              <div>
                <p className="text-sm text-gray-500">电话</p>
                <p className="font-medium">{restaurant.phone}</p>
              </div>
            </div>
            {/* 预期排队时间 */}
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#E2001A]" />
              <div>
                <p className="text-sm text-gray-500">预期排队时间</p>
                <p className="font-medium text-orange-600">
                  {restaurant.votes.crowded > restaurant.votes.fast ? '约 15-30 分钟 (高峰期拥挤)' : '无需排队 (点餐较快)'}
                </p>
              </div>
            </div>
            
            {/* 过敏原信息 */}
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="w-5 h-5 flex items-center justify-center text-[#E2001A] font-bold">⚠️</div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">过敏原信息</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {restaurant.hasAllergenFree && (
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 border border-green-200 rounded">提供无过敏原菜品</span>
                  )}
                  {restaurant.allergens && restaurant.allergens.length > 0 ? (
                    restaurant.allergens.map(a => (
                      <span key={a} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">可能含: {a}</span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-600">未标注或无常见过敏原</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {restaurant.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          {/* 商家真实性验证 */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">帮助其他同学 - 验证商家真实性</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleVerify('hasIt')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  myVerify === 'hasIt'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                }`}
              >
                <span className="text-2xl">✊</span>
                <span className="text-xs font-medium text-gray-700">确实有</span>
                <span className={`text-sm font-bold ${myVerify === 'hasIt' ? 'text-green-600' : 'text-gray-600'}`}>
                  {verifyVotes.hasIt}
                </span>
              </button>
              <button
                onClick={() => handleVerify('tasty')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  myVerify === 'tasty'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <span className="text-2xl">🤤</span>
                <span className="text-xs font-medium text-gray-700">好吃</span>
                <span className={`text-sm font-bold ${myVerify === 'tasty' ? 'text-orange-600' : 'text-gray-600'}`}>
                  {verifyVotes.tasty}
                </span>
              </button>
              <button
                onClick={() => handleVerify('closed')}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  myVerify === 'closed'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                <span className="text-2xl">🏃</span>
                <span className="text-xs font-medium text-gray-700">没出摊/跑路了</span>
                <span className={`text-sm font-bold ${myVerify === 'closed' ? 'text-red-600' : 'text-gray-600'}`}>
                  {verifyVotes.closed}
                </span>
              </button>
            </div>
            {verifyVotes.hasIt >= 20 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎉</span>
                  <span className="text-sm text-gray-700">
                    此商家已获得<span className="font-bold text-orange-600">{verifyVotes.hasIt}</span>位同学认证，已升级至榜单推荐！
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* 学生优惠券 */}
        {restaurant.coupons && restaurant.coupons.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🎫 学生优惠券
            </h2>
            <div className="space-y-3">
              {restaurant.coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-dashed border-red-300 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-1">
                        {coupon.title}
                      </h3>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleUseCoupon(coupon)}
                          className="px-4 py-1.5 bg-[#E2001A] text-white text-sm font-medium rounded-full hover:bg-[#C10016] transition-colors"
                        >
                          立即使用
                        </button>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>有效期至 {coupon.validUntil}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 推荐菜品 TOP3 */}
        {topDishes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              🏆 人气推荐 TOP3
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topDishes.map((dish, index) => (
                <div key={dish.id} className="relative">
                  {/* 排名徽章 */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 shadow-lg">
                    {index + 1}
                  </div>
                  <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{dish.name}</h3>
                      <p className="text-lg font-bold text-[#E2001A]">¥{dish.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 菜品展示 */}
        {restaurant.dishes && restaurant.dishes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">菜品展示</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {restaurant.dishes.map((dish) => (
                <div key={dish.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{dish.name}</h3>
                    <p className="text-base font-semibold text-[#E2001A]">¥{dish.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 学生评价 */}
        {restaurant.reviews && restaurant.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">学生评价 ({restaurant.reviews.length})</h2>
            </div>
            
            {/* 只展示评价的缩略卡片，引导用户点击 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restaurant.reviews.slice(0, 4).map((review, index) => (
                <div 
                  key={review.id} 
                  onClick={() => openReviewDetail(index)}
                  className="bg-gray-50 hover:bg-red-50/50 p-4 rounded-xl border border-gray-100 cursor-pointer transition-all hover:border-red-200 group flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.avatar}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full bg-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{review.userName}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">{review.content}</p>
                  
                  {/* 图片缩略图预览 */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.slice(0, 3).map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={img}
                            alt={`预览图${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {idx === 2 && review.images!.length > 3 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                              +{review.images!.length - 3}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200/60">
                    <div className="flex flex-wrap gap-1">
                      {review.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-white text-gray-500 rounded border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-medium text-[#E2001A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      阅读全文 <ArrowLeft className="w-3 h-3 rotate-180" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 发起拼单对话框 */}
      <StartGroupOrderDialog
        isOpen={showStartGroupOrder}
        onClose={() => setShowStartGroupOrder(false)}
        defaultRestaurantId={restaurant.id}
        defaultRestaurantName={restaurant.name}
        onSuccess={(newOrder) => {
          mockGroupOrders.unshift(newOrder);
          window.dispatchEvent(new Event('groupOrdersUpdated'));
        }}
      />

      {/* 评价详情对话框 */}
      {showReviewDetail && restaurant.reviews && (
        <ReviewDetailDialog
          isOpen={showReviewDetail}
          onClose={() => setShowReviewDetail(false)}
          reviews={restaurant.reviews}
          initialIndex={selectedReviewIndex}
        />
      )}

      {/* 优惠券确认使用弹窗 */}
      <AnimatePresence>
        {showCouponConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">确认使用优惠券？</h3>
              <p className="text-gray-600 mb-6">
                即将使用「{selectedCoupon?.title}」，确认后将同步至商家。
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCouponConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmUseCoupon}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white font-medium hover:shadow-lg transition-all"
                >
                  确认使用
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 成功提示弹窗 */}
        {showSuccessPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 max-w-sm w-max"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <div className="font-bold text-lg mb-1">使用成功</div>
                <div className="text-sm text-white/90">已同步至商家端，到店报出手机号尾号即可核销</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}