import { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, Sparkles, Plus, TrendingUp, MapPin, Search } from 'lucide-react';
import { Restaurant, mockRestaurants, categories } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

interface WhatToEatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campus: string;
}

export function WhatToEatDialog({ isOpen, onClose, campus }: WhatToEatDialogProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'random' | 'filter'>('random');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [maxPrice, setMaxPrice] = useState(100);
  const [recommendation, setRecommendation] = useState<Restaurant | null>(null);
  const [customRecommendation, setCustomRecommendation] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRecommendation = () => {
    setIsSpinning(true);
    setRecommendation(null);
    setCustomRecommendation(null);
    
    if (mode === 'custom') {
      setTimeout(() => {
        if (customOptions.length > 0) {
          const randomIndex = Math.floor(Math.random() * customOptions.length);
          setCustomRecommendation(customOptions[randomIndex]);
        }
        setIsSpinning(false);
      }, 1000);
      return;
    }

    let filteredRestaurants = [...mockRestaurants]; // 所有餐厅
    
    if (mode === 'filter') {
      if (selectedCategory !== '全部') {
        filteredRestaurants = filteredRestaurants.filter(r => r.category === selectedCategory);
      }
      filteredRestaurants = filteredRestaurants.filter(r => r.price <= maxPrice);
    }

    if (filteredRestaurants.length === 0) {
      filteredRestaurants = [...mockRestaurants];
    }

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length);
      setRecommendation(filteredRestaurants[randomIndex]);
      setIsSpinning(false);
    }, 1000);
  };

  const addCustomOption = () => {
    if (newOption.trim() && !customOptions.includes(newOption.trim())) {
      setCustomOptions([...customOptions, newOption.trim()]);
      setNewOption('');
      setShowSuggestions(false);
    }
  };

  const removeCustomOption = (option: string) => {
    setCustomOptions(customOptions.filter(opt => opt !== option));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (restaurant: Restaurant) => {
    setNewOption(restaurant.name);
    if (!customOptions.includes(restaurant.name)) {
      setCustomOptions([...customOptions, restaurant.name]);
    }
    setNewOption('');
    setShowSuggestions(false);
  };

  const suggestions = newOption.trim() 
    ? mockRestaurants.filter(r => 
        r.name.toLowerCase().includes(newOption.toLowerCase()) || 
        r.popularDishes.some(d => d.toLowerCase().includes(newOption.toLowerCase()))
      ).slice(0, 4)
    : [];

  useEffect(() => {
    if (isOpen && !recommendation) {
      getRecommendation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* 头部 */}
        <div className="sticky top-0 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white p-6 flex items-center justify-between rounded-t-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">今天吃什么？</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 模式切换 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-1">
            <button
              onClick={() => setMode('random')}
              className={`flex-1 min-w-[100px] py-3 rounded-xl transition-all font-medium text-sm md:text-base ${
                mode === 'random'
                  ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎲 随机推荐
            </button>
            <button
              onClick={() => setMode('filter')}
              className={`flex-1 min-w-[100px] py-3 rounded-xl transition-all font-medium text-sm md:text-base ${
                mode === 'filter'
                  ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 条件推荐
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex-1 min-w-[100px] py-3 rounded-xl transition-all font-medium text-sm md:text-base ${
                mode === 'custom'
                  ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✍️ 自定义盲盒
            </button>
          </div>
        </div>

          {/* 筛选条件 */}
        {mode === 'filter' && (
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                菜系类型
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#E2001A] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最高价格：¥{maxPrice}
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#E2001A]"
              />
            </div>

            {/* 看看大家在吃什么 */}
            <button
              onClick={() => {
                onClose();
                navigate('/rankings');
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              看看大家在吃什么
            </button>
          </div>
        )}

        {/* 自定义盲盒 */}
        {mode === 'custom' && (
          <div className="p-6 border-b border-gray-200 space-y-4">
            <div ref={wrapperRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                输入你纠结的选项 (可以是店名、菜名或任何想吃的东西)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomOption()}
                  placeholder="例如：麻辣烫 / 麦当劳 / 北食堂..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#E2001A]"
                />
                <button
                  onClick={addCustomOption}
                  className="px-4 py-2 bg-[#E2001A] text-white rounded-lg hover:bg-[#C10016] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              {/* 搜索联想结果 */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-16 left-0 right-24 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <ul className="py-2">
                    {suggestions.map((restaurant) => (
                      <li 
                        key={restaurant.id}
                        onClick={() => handleSuggestionClick(restaurant)}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-b-0 border-gray-50"
                      >
                        <img src={restaurant.image} alt={restaurant.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{restaurant.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5 truncate">
                            {restaurant.popularDishes.join(', ')}
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-[#E2001A]" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="min-h-[100px] bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200">
              {customOptions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {customOptions.map((option) => (
                    <span
                      key={option}
                      className="px-3 py-1.5 bg-white border border-orange-200 text-[#E2001A] rounded-lg shadow-sm flex items-center gap-2 font-medium"
                    >
                      {option}
                      <X 
                        className="w-4 h-4 cursor-pointer hover:bg-red-50 rounded-full transition-colors" 
                        onClick={() => removeCustomOption(option)}
                      />
                    </span>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-4">
                  <Sparkles className="w-6 h-6 mb-2 opacity-50" />
                  <p className="text-sm">添加几个选项，让我来帮你选！</p>
                </div>
              )}
            </div>
            
            <button
              onClick={getRecommendation}
              disabled={customOptions.length < 2 || isSpinning}
              className={`w-full py-3 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-bold ${
                customOptions.length < 2 || isSpinning
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] hover:shadow-lg'
              }`}
            >
              {isSpinning ? (
                <><RefreshCw className="w-5 h-5 animate-spin" /> 正在抽取...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> 开始抽取</>
              )}
            </button>
          </div>
        )}

        {/* 推荐结果 */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {isSpinning ? (
              <motion.div
                key="spinning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="text-6xl mb-4"
                >
                  🎲
                </motion.div>
                <p className="text-gray-500">正在为你挑选...</p>
              </motion.div>
            ) : mode === 'custom' && customRecommendation ? (
              <motion.div
                key="custom-result"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="text-sm text-gray-500 mb-4">就决定是你了！</div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#E2001A] to-[#FF9512] mb-8 px-6 py-4 bg-orange-50 rounded-2xl border-2 border-orange-100 shadow-inner">
                  {customRecommendation}
                </div>
                
                <button
                  onClick={getRecommendation}
                  className="w-full py-3 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  再抽一次
                </button>
              </motion.div>
            ) : recommendation && mode !== 'custom' ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="relative rounded-xl overflow-hidden">
                  <img
                    src={recommendation.image}
                    alt={recommendation.name}
                    className="w-full h-64 object-cover"
                  />
                  {recommendation.studentDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full">
                      {recommendation.studentDiscount}
                    </div>
                  )}
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {recommendation.name}
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">
                      {recommendation.category}
                    </span>
                    <span>人均 ¥{recommendation.price}</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {recommendation.distance}m</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {recommendation.tags.map((tag) => (
                      <span key={tag} className="text-sm px-3 py-1 bg-red-50 text-[#E2001A] rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-2">人气菜品推荐：</p>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.popularDishes.map((dish) => (
                      <span key={dish} className="px-3 py-1 bg-white rounded-lg text-gray-800">
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/restaurant/${recommendation.id}`);
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-800 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={getRecommendation}
                    className="flex-1 py-3 bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    换一个
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}