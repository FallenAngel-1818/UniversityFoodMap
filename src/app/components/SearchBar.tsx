import { Search, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { mockRestaurants } from '../data/mockData';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = '搜索餐厅/菜系/关键词' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    onSearch(e.target.value); // 实时过滤主页列表
  };

  const suggestions = query.trim() 
    ? mockRestaurants.filter(r => 
        r.name.toLowerCase().includes(query.toLowerCase()) || 
        r.popularDishes.some(d => d.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div ref={wrapperRef} className="w-full relative">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder={placeholder}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#E2001A] focus:ring-2 focus:ring-[#E2001A]/20 outline-none transition-all text-gray-900"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-white text-[#E2001A] rounded-xl font-semibold hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            搜索
          </button>
        </div>
      </form>

      {/* 联想搜索下拉框 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-28 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <ul className="py-2">
            {suggestions.map((restaurant) => (
              <li 
                key={restaurant.id}
                onClick={() => {
                  navigate(`/restaurant/${restaurant.id}`);
                  setShowSuggestions(false);
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-b-0 border-gray-50"
              >
                <img src={restaurant.image} alt={restaurant.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{restaurant.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {restaurant.distance}m</span>
                    <span>·</span>
                    <span className="truncate">{restaurant.popularDishes.join(', ')}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}