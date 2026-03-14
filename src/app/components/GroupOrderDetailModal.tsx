import { X, CheckCircle, Users } from 'lucide-react';
import { GroupOrder } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface GroupOrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: GroupOrder | null;
}

export function GroupOrderDetailModal({ isOpen, onClose, order }: GroupOrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {/* 顶部：关闭按钮 */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 头部信息 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-b border-orange-100">
              <div className="flex items-center gap-4">
                <img
                  src={order.restaurantImage}
                  alt={order.restaurantName}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <div className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 我的拼单
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{order.restaurantName}</h3>
                  <div className="text-sm text-gray-600 mt-1">预计 {order.time}</div>
                </div>
              </div>
            </div>

            {/* 拼单进度和人员列表 */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">已拼人员</h4>
                <span className="text-sm font-medium text-[#E2001A]">
                  {order.joinedUsers.length} / {order.totalSlots} 人
                </span>
              </div>
              
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-6 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#E2001A] to-[#FF9512] transition-all duration-500 ease-out"
                  style={{ width: `${(order.joinedUsers.length / order.totalSlots) * 100}%` }}
                />
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {order.joinedUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-white shadow-sm" />
                        {idx === 0 && (
                          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold border-2 border-white">
                            发起人
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">已准备就绪</div>
                      </div>
                    </div>
                    {idx > 0 && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                ))}

                {/* 空位展示 */}
                {Array.from({ length: order.totalSlots - order.joinedUsers.length }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 bg-white opacity-60">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 font-medium">?</span>
                    </div>
                    <span className="text-sm font-medium text-gray-400">等待加入...</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
