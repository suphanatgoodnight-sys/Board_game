
import React, { useState } from 'react';
import { BoardGame } from '../types';
import BoardGameCard from './BoardGameCard';

interface BoardGameListProps {
  boardGames: BoardGame[];
  selectedCount: number;
  onToggleSelect: (id: number) => void;
  onConfirm: () => void;
}

const CATEGORIES = [
  'ทั้งหมด',
  'ยอดนิยม',
  'เกมวางกลยุทธ์',
  'เกมปาร์ตี้',
  'เกมสวมบทบาท',
  'เกมแนวเศรษฐศาสตร์',
  'เกมปริศนา',
];

const BoardGameList: React.FC<BoardGameListProps> = ({ boardGames, selectedCount, onToggleSelect, onConfirm }) => {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  const filteredGames = boardGames.filter(game => {
    if (activeCategory === 'ทั้งหมด') return true;
    if (activeCategory === 'ยอดนิยม') return game.isPopular;
    return game.category === activeCategory;
  });

  return (
    <div>
       <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">บอร์ดเกม</h2>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24">
        {filteredGames.length > 0 ? (
          filteredGames.map(game => (
            <BoardGameCard
              key={game.id}
              game={game}
              onToggleSelect={onToggleSelect}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            ไม่มีบอร์ดเกมในหมวดหมู่นี้
          </div>
        )}
      </div>

      {boardGames.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 p-4 z-10">
          <div className="container mx-auto flex justify-center items-center">
            <button
              onClick={onConfirm}
              disabled={selectedCount === 0}
              className="w-full max-w-md bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              ยืนยัน ({selectedCount} รายการ)
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default BoardGameList;
