import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Users, Plus, CheckCircle, Store, Search } from 'lucide-react';
import { mockGroupOrders, campuses, GroupOrder } from '../data/mockData';
import { StartGroupOrderDialog } from '../components/StartGroupOrderDialog';
import { GroupOrderDetailModal } from '../components/GroupOrderDetailModal';
import { toast } from 'sonner';

export function GroupOrders() {
  const navigate = useNavigate();
  const [selectedCampus, setSelectedCampus] = useState('bift');
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [joinedOrders, setJoinedOrders] = useState<string[]>([]);
  const [localGroupOrders, setLocalGroupOrders] = useState<GroupOrder[]>(mockGroupOrders);
  const [detailOrder, setDetailOrder] = useState<GroupOrder | null>(null);
  const [successOrder, setSuccessOrder] = useState<GroupOrder | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setLocalGroupOrders([...mockGroupOrders]);
    };
    window.addEventListener('groupOrdersUpdated', handleUpdate);
    return () => window.removeEventListener('groupOrdersUpdated', handleUpdate);
  }, []);

  // 根据进度排序，优先显示即将拼满的
  const sortedOrders = [...localGroupOrders]
    .filter(g => g.campus === selectedCampus && g.status === 'recruiting')
    .sort((a, b) => {
      const aProgress = a.joinedUsers.length / a.totalSlots;
      const bProgress = b.joinedUsers.length / b.totalSlots;
      return bProgress - aProgress; // 进度高的在前面
    });

  const handleJoin = (e: React.MouseEvent, order: GroupOrder) => {
    e.stopPropagation();
    if (!joinedOrders.includes(order.id)) {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* 头部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">同校拼单大厅</h1>
          </div>
          <button
            onClick={() => setShowStartDialog(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" /> {selectedCampus === 'bift' ? '发起拼单' : '发起跨校拼单'}
          </button>
        </div>
        
        {/* 校区选择栏 */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {campuses.map(campus => (
            <button
              key={campus.id}
              onClick={() => setSelectedCampus(campus.id)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCampus === campus.id
                  ? 'bg-orange-100 text-orange-600 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {campus.name}
            </button>
          ))}
        </div>
      </div>

      {/* 拼单列表 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-gray-900 font-bold">即将拼满</h2>
          <span className="text-sm text-gray-500">共 {sortedOrders.length} 个拼单</span>
        </div>

        {sortedOrders.length > 0 ? (
          <div className="space-y-4">
            {sortedOrders.map((order, index) => {
              const isJoined = joinedOrders.includes(order.id);
              const currentJoinedCount = isJoined ? order.joinedUsers.length + 1 : order.joinedUsers.length;
              const isAlmostFull = order.totalSlots - currentJoinedCount === 1;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/restaurant/${order.restaurantId}`)}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 relative overflow-hidden"
                >
                  {isAlmostFull && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      差1人即满
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-5">
                    {/* 左侧：餐厅信息 */}
                    <div className="flex gap-4 flex-1">
                      <img
                        src={order.restaurantImage}
                        alt={order.restaurantName}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate hover:text-[#E2001A] transition-colors">
                            {order.restaurantName}
                          </h3>
                          {isJoined && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {order.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <img src={order.initiator.avatar} alt="发起人" className="w-5 h-5 rounded-full bg-gray-100" />
                            <span>由 {order.initiator.name} 发起</span>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg line-clamp-1 mb-2">
                            <span className="font-medium text-gray-700">备注：</span>{order.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 右侧：拼单进度与操作 */}
                    <div className="md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 mt-2 md:mt-0">
                      <div className="flex items-end justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">拼单进度</span>
                        <span className="text-sm font-bold text-[#E2001A]">
                          {currentJoinedCount} / {order.totalSlots} 人
                        </span>
                      </div>
                      
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4 shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-[#E2001A] to-[#FF9512] transition-all duration-500 ease-out"
                          style={{ width: `${(currentJoinedCount / order.totalSlots) * 100}%` }}
                        />
                      </div>
                      
                      {order.initiator.name === '我' ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailOrder(order);
                          }}
                          className="w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          查看详情
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => handleJoin(e, order)}
                          disabled={currentJoinedCount >= order.totalSlots && !isJoined}
                          className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                            isJoined 
                              ? 'bg-green-50 text-green-600 border border-green-200' 
                              : currentJoinedCount >= order.totalSlots
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#E2001A] text-white hover:bg-[#C10016] hover:shadow-md'
                          }`}
                        >
                          {isJoined ? (
                            <><CheckCircle className="w-4 h-4" /> 已加入拼单</>
                          ) : currentJoinedCount >= order.totalSlots ? (
                            '已满员'
                          ) : order.campus !== 'bift' ? (
                            '加入跨校拼单'
                          ) : (
                            '立即加入'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-orange-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">当前校区暂无拼单</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              大家似乎都还没行动，不如你来做第一个发起美食拼单的人吧！
            </p>
            <button
              onClick={() => setShowStartDialog(true)}
              className="px-6 py-2.5 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              {selectedCampus === 'bift' ? '发起同校拼单' : '发起跨校拼单'}
            </button>
          </div>
        )}
      </div>

      <StartGroupOrderDialog
        isOpen={showStartDialog}
        onClose={() => setShowStartDialog(false)}
        isCrossCampus={selectedCampus !== 'bift'}
        campusId={selectedCampus}
        onSuccess={(newOrder) => {
          mockGroupOrders.unshift(newOrder);
          window.dispatchEvent(new Event('groupOrdersUpdated'));
        }}
      />

      <GroupOrderDetailModal
        isOpen={detailOrder !== null}
        onClose={() => setDetailOrder(null)}
        order={detailOrder}
      />

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