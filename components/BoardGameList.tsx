
import React from 'react';
import { BoardGame } from '../types';
import BoardGameCard from './BoardGameCard';

interface BoardGameListProps {
  boardGames: BoardGame[];
  selectedCount: number;
  onToggleSelect: (id: number) => void;
  onConfirm: () => void;
}

const BoardGameList: React.FC<BoardGameListProps> = ({ boardGames, selectedCount, onToggleSelect, onConfirm }) => {
  return (
    <div>
       <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">บอร์ดเกม</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-24">
        {boardGames.map(game => (
          <BoardGameCard
            key={game.id}
            game={game}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
      {boardGames.length > 0 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-200 p-4">
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
