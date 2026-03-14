import { useState, useRef, useEffect } from 'react';
import { X, Heart, Bookmark, ChevronDown, Star } from 'lucide-react';
import { Review, currentUser } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  initialIndex: number;
}

export function ReviewDetailDialog({ isOpen, onClose, reviews, initialIndex }: ReviewDetailDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [localLikes, setLocalLikes] = useState<number>(reviews[initialIndex]?.likes || 0);
  const [replyText, setReplyText] = useState('');

  const [replies, setReplies] = useState(reviews[initialIndex]?.replies || []);

  useEffect(() => {
    setLocalLikes(reviews[currentIndex]?.likes || 0);
    setLiked(false);
    setBookmarked(false);
    setReplies(reviews[currentIndex]?.replies || []);
    setReplyText('');
  }, [currentIndex, reviews]);

  const currentReview = reviews[currentIndex];

  const navigateTo = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentIndex < reviews.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLocalLikes(prev => prev + 1);
      setLiked(true);
    } else {
      setLocalLikes(prev => prev - 1);
      setLiked(false);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setReplies([
      ...replies,
      {
        id: Date.now(),
        name: currentUser.name,
        school: `${currentUser.campus} 学生`,
        avatar: currentUser.avatar,
        content: replyText,
        time: '刚刚'
      }
    ]);
    setReplyText('');
  };

  if (!isOpen || !currentReview) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden relative flex flex-col md:flex-row"
      >
        {/* 左侧：图片区域 (仅在有图片时显示，并占据较大空间) */}
        {currentReview.images && currentReview.images.length > 0 ? (
          <div className="md:w-3/5 bg-gray-100 flex-shrink-0 relative overflow-hidden h-[40vh] md:h-auto">
            {/* 只显示第一张作为主图，如果有更多图则显示角标指示 */}
            <img
              src={currentReview.images[0]}
              alt="评价主图"
              className="w-full h-full object-cover"
            />
            {currentReview.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                1 / {currentReview.images.length}
              </div>
            )}
            
            {/* 如果是在大屏幕上，允许在图片上叠加一个小按钮 */}
          </div>
        ) : (
           <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-orange-50 to-red-50 flex-col items-center justify-center p-8 text-center border-r border-gray-100">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <span className="text-4xl">✍️</span>
             </div>
             <p className="text-gray-500 font-medium">无配图评价</p>
           </div>
        )}

        {/* 右侧：内容区域 */}
        <div className="flex-1 flex flex-col h-full max-h-[60vh] md:max-h-[85vh]">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/10 hover:bg-black/20 md:bg-gray-100 md:hover:bg-gray-200 rounded-full text-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 左侧指示箭头 */}
          {currentIndex > 0 && (
             <button
                onClick={() => navigateTo('prev')}
                className="hidden md:flex absolute top-1/2 -left-12 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full items-center justify-center text-white transition-all z-50"
             >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </button>
          )}

          {/* 右侧指示箭头 (在大屏幕上显示于评价区域中间) */}
          {currentIndex < reviews.length - 1 && (
             <button
                onClick={() => navigateTo('next')}
                className="hidden md:flex absolute top-1/2 -right-12 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full items-center justify-center text-white transition-all z-50"
             >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </button>
          )}

          {/* 用户信息 */}
          <div className="p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-4">
              <img
                src={currentReview.avatar}
                alt={currentReview.userName}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  {currentReview.userName}
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-orange-50 text-orange-600 font-normal">
                    {currentReview.userSchool} {currentReview.userType === 'student' ? '学生' : '教职工'}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                        i < currentReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 评价内容 (可滚动) */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
            {/* 文字内容 */}
            <p className="text-gray-800 leading-relaxed text-base md:text-lg">{currentReview.content}</p>

            {/* 标签 */}
            {currentReview.tags && currentReview.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentReview.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-red-50 text-[#E2001A] rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 推荐菜 */}
            {currentReview.recommendedDishes && currentReview.recommendedDishes.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                   <span>👍</span> 达人推荐菜品：
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentReview.recommendedDishes.map((dish) => (
                    <span
                      key={dish}
                      className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm"
                    >
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 日期 */}
            <div className="text-sm text-gray-400 pt-2">{currentReview.date}</div>
            
            {/* 模拟的其他评论区 */}
            <div className="pt-6 border-t border-gray-100">
               <h4 className="font-semibold text-gray-900 mb-4 text-sm">共 {replies.length} 条回复</h4>
               <div className="space-y-4">
                  {replies.map(reply => (
                    <div key={reply.id} className="flex gap-3">
                       <img src={reply.avatar} alt="avatar" className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                       <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-800">{reply.name}</div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600 font-normal">
                              {reply.school}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{reply.content}</div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="text-xs text-gray-400">{reply.time}</div>
                            <button className="text-xs text-gray-500 font-medium hover:text-[#E2001A] transition-colors">回复</button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* 底部输入框与操作按钮 */}
          <div className="border-t border-gray-100 bg-white flex-shrink-0">
            {/* 快速回复栏 */}
            <div className="p-3 md:p-4 border-b border-gray-50 flex items-center gap-3">
              <img src={currentUser.avatar} alt="我" className="w-8 h-8 rounded-full object-cover" />
              <input 
                type="text" 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder="说点什么吧..." 
                className="flex-1 bg-gray-100 text-sm rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-orange-200 transition-all"
              />
              <button 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="px-4 py-1.5 bg-[#E2001A] text-white text-sm font-medium rounded-full hover:bg-[#C10016] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                发送
              </button>
            </div>

            <div className="p-4 md:px-6 md:py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
                  <span className="font-semibold">{localLikes}</span>
                </button>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`flex items-center gap-2 transition-colors ${
                    bookmarked ? 'text-[#E2001A]' : 'text-gray-600 hover:text-[#E2001A]'
                  }`}
                >
                  <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-[#E2001A]' : ''}`} />
                  <span className="hidden md:inline font-medium">收藏</span>
                </button>
              </div>

              {/* 翻页按钮 */}
              <div className="flex items-center gap-3">
                 {currentIndex > 0 && (
                   <button 
                     onClick={() => navigateTo('prev')}
                     className="flex items-center gap-1 text-gray-500 font-medium px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-all"
                   >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                     <span className="hidden md:inline">上一条</span>
                   </button>
                 )}
                 {currentIndex < reviews.length - 1 && (
                   <button 
                     onClick={() => navigateTo('next')}
                     className="flex items-center gap-1 text-[#E2001A] font-medium px-4 py-2 bg-red-50 hover:bg-red-100 rounded-full transition-all hover:scale-105 active:scale-95"
                   >
                     <span>下一条</span>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
