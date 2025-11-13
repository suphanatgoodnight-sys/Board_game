
import React from 'react';
import { BoardGame } from '../types';

interface BoardGameCardProps {
  game: BoardGame;
  onToggleSelect: (id: number) => void;
}

const BoardGameCard: React.FC<BoardGameCardProps> = ({ game, onToggleSelect }) => {
  const { id, name, description, imageUrl, selected } = game;

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer border-4 ${selected ? 'border-blue-500' : 'border-transparent'}`}
      onClick={() => onToggleSelect(id)}
    >
      <img className="w-full h-48 object-cover" src={imageUrl} alt={name} />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`checkbox-${id}`}
            checked={selected}
            onChange={() => onToggleSelect(id)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor={`checkbox-${id}`} className="ml-2 text-gray-700 font-medium">
            {selected ? 'เลือกแล้ว' : 'เลือก'}
          </label>
        </div>
      </div>
    </div>
  );
};

export default BoardGameCard;
