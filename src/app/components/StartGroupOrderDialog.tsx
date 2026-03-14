import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Users, FileText, Store } from 'lucide-react';
import { toast } from 'sonner';
import { currentUser } from '../data/mockData';

interface StartGroupOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  // 如果在商家详情页，传入该商家的 ID 和名称；如果在首页，则为 undefined，需要用户选择或填写
  defaultRestaurantId?: string;
  defaultRestaurantName?: string;
  isCrossCampus?: boolean;
  campusId?: string;
  onSuccess: (orderData: any) => void;
}

export function StartGroupOrderDialog({ 
  isOpen, 
  onClose, 
  defaultRestaurantId, 
  defaultRestaurantName,
  isCrossCampus = false,
  campusId = 'bift',
  onSuccess 
}: StartGroupOrderDialogProps) {
  const [restaurantName, setRestaurantName] = useState(defaultRestaurantName || '');
  const [peopleCount, setPeopleCount] = useState('2');
  const [myPeopleCount, setMyPeopleCount] = useState('1');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantName) {
      toast.error('请填写或选择商家名称');
      return;
    }
    if (!time) {
      toast.error('请填写拼单时间');
      return;
    }
    
    const total = parseInt(peopleCount, 10) || 2;
    const mine = parseInt(myPeopleCount, 10) || 1;

    if (mine >= total) {
      toast.error('我方人数不能大于或等于总人数需求');
      return;
    }

    // 生成当前用户（发起人）
    const initiator = {
      name: '我',
      avatar: currentUser.avatar
    };

    // 把"我方人数"对应数量的用户加入已拼单列表 (复制发起人头像占位)
    const initialJoinedUsers = Array(mine).fill(initiator);

    const newOrder = {
      id: `order-${Date.now()}`,
      restaurantId: defaultRestaurantId || `custom-${Date.now()}`,
      restaurantName,
      restaurantImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', // Default mock image
      time,
      totalSlots: total,
      joinedUsers: initialJoinedUsers,
      initiator,
      campus: campusId, // Use passed campus
      status: 'recruiting',
      notes
    };

    onSuccess(newOrder);
    toast.success('发起拼单成功！已同步至大厅。');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{isCrossCampus ? '发起跨校拼单' : '发起同校拼单'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 商家名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-[#E2001A]" />
              拼单商家
            </label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              disabled={!!defaultRestaurantName}
              placeholder="请输入想要拼单的商家名称"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E2001A] focus:ring-1 focus:ring-[#E2001A] outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 拼单人数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#E2001A]" />
                总人数需求
              </label>
              <select
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E2001A] focus:ring-1 focus:ring-[#E2001A] outline-none transition-all bg-white"
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} 人</option>
                ))}
              </select>
            </div>

            {/* 我方人数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#E2001A]" />
                我方已有
              </label>
              <select
                value={myPeopleCount}
                onChange={(e) => setMyPeopleCount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E2001A] focus:ring-1 focus:ring-[#E2001A] outline-none transition-all bg-white"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} 人</option>
                ))}
              </select>
            </div>
          </div>

          {/* 拼单时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E2001A]" />
              预计时间
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="例如：12:00"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E2001A] focus:ring-1 focus:ring-[#E2001A] outline-none transition-all"
            />
          </div>

          {/* 备注信息 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#E2001A]" />
              备注说明 (选填)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：我不吃香菜，大家A一下跑腿费..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#E2001A] focus:ring-1 focus:ring-[#E2001A] outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white font-bold rounded-xl shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
            >
              确认发起
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}