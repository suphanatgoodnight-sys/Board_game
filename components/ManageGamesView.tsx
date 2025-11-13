import React, { useState } from 'react';
import { BoardGame } from '../types';

interface ManageGamesViewProps {
  boardGames: BoardGame[];
  onAddGame: (newGame: { name: string; description: string; imageUrl: string }) => void;
  onBack: () => void;
}

const ManageGamesView: React.FC<ManageGamesViewProps> = ({ boardGames, onAddGame, onBack }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    setError(null);
    onAddGame({ name, description, imageUrl });
    // Reset form
    setName('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto">
       <button onClick={onBack} className="text-blue-600 hover:underline mb-6 inline-block">&larr; กลับไปหน้าหลัก</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Game Form */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">เพิ่มบอร์ดเกมใหม่</h2>
          <p className="text-gray-500 mb-6">กรอกรายละเอียดเพื่อเพิ่มเกมในระบบ</p>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gameName" className="block text-sm font-medium text-gray-700 mb-1">ชื่อบอร์ดเกม</label>
              <input
                type="text"
                id="gameName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="เช่น Avalon"
                required
              />
            </div>
            <div>
              <label htmlFor="gameDescription" className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
              <textarea
                id="gameDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="อธิบายเกี่ยวกับเกมสั้นๆ"
                required
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              เพิ่มบอร์ดเกม
            </button>
          </form>
        </div>

        {/* Existing Games List */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">รายการบอร์ดเกมทั้งหมด</h2>
          <div className="max-h-[400px] overflow-y-auto pr-4 space-y-3">
            {boardGames.slice().reverse().map(game => (
              <div key={game.id} className="flex items-center bg-gray-50 p-3 rounded-md">
                <img src={game.imageUrl} alt={game.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                <div>
                  <p className="font-semibold text-gray-700">{game.name}</p>
                  <p className="text-sm text-gray-500 truncate">{game.description}</p>
                </div>
              </div>
            ))}
             {boardGames.length === 0 && <p className="text-gray-500">ยังไม่มีบอร์ดเกมในระบบ</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGamesView;
