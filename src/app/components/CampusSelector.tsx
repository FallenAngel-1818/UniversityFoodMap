import { campuses } from '../data/mockData';
import { MapPin } from 'lucide-react';

interface CampusSelectorProps {
  selected: string;
  onSelect: (campusId: string) => void;
}

export function CampusSelector({ selected, onSelect }: CampusSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-5 h-5 text-gray-500" />
      <div className="flex gap-2">
        {campuses.map((campus) => (
          <button
            key={campus.id}
            onClick={() => onSelect(campus.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selected === campus.id
                ? 'bg-gradient-to-r from-[#E2001A] to-[#FF9512] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {campus.name}
          </button>
        ))}
      </div>
    </div>
  );
}
