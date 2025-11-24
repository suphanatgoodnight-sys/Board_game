
import React, { useState } from 'react';
import { BoardGame } from '../types';

interface ManageGamesViewProps {
  boardGames: BoardGame[];
  onAddGame: (newGame: { name: string; description: string; imageUrl: string }) => void;
  onUpdateGame: (game: BoardGame) => void;
  onDeleteGames: (ids: number[]) => void;
  onBack: () => void;
}

const ManageGamesView: React.FC<ManageGamesViewProps> = ({ boardGames, onAddGame, onUpdateGame, onDeleteGames, onBack }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // State for selection and editing
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleEditClick = () => {
    if (selectedIds.length !== 1) return;
    const game = boardGames.find(g => g.id === selectedIds[0]);
    if (game) {
      setName(game.name);
      setDescription(game.description);
      setImageUrl(game.imageUrl);
      setEditingId(game.id);
      setError(null);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteClick = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`คุณต้องการลบบอร์ดเกมที่เลือก ${selectedIds.length} รายการใช่หรือไม่?`)) {
      onDeleteGames(selectedIds);
      setSelectedIds([]);
      if (editingId && selectedIds.includes(editingId)) {
        handleCancelEdit();
      }
    }
  };

  const handleCancelEdit = () => {
    setName('');
    setDescription('');
    setImageUrl('');
    setEditingId(null);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !imageUrl) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    setError(null);
    
    if (editingId) {
      const originalGame = boardGames.find(g => g.id === editingId);
      if (originalGame) {
        onUpdateGame({
          ...originalGame,
          name,
          description,
          imageUrl,
        });
        alert('แก้ไขบอร์ดเกมเรียบร้อย');
        handleCancelEdit();
        setSelectedIds([]);
      }
    } else {
      onAddGame({ name, description, imageUrl });
      // Reset form
      setName('');
      setDescription('');
      setImageUrl('');
    }
  };

  // Determine UI state
  const canEdit = selectedIds.length === 1;
  const canDelete = selectedIds.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
       <button onClick={onBack} className="text-blue-600 hover:underline mb-6 inline-block">&larr; กลับไปหน้าหลัก</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg h-fit sticky top-4">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            {editingId ? 'แก้ไขบอร์ดเกม' : 'เพิ่มบอร์ดเกมใหม่'}
          </h2>
          <p className="text-gray-500 mb-6">
            {editingId ? 'แก้ไขรายละเอียดของเกม' : 'กรอกรายละเอียดเพื่อเพิ่มเกมในระบบ'}
          </p>
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
                placeholder="เช่น Suphanat"
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
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className={`flex-1 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 ${editingId ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'}`}
              >
                {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มบอร์ดเกม'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">รายการบอร์ดเกมทั้งหมด</h2>
          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 mb-4">
            {boardGames.slice().reverse().map(game => (
              <div 
                key={game.id} 
                className={`flex items-center justify-between bg-gray-50 p-3 rounded-md border ${selectedIds.includes(game.id) ? 'border-blue-500 bg-blue-50' : 'border-transparent'}`}
              >
                <div className="flex items-center overflow-hidden mr-2">
                  <img src={game.imageUrl} alt={game.name} className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-700 truncate">{game.name}</p>
                    <p className="text-sm text-gray-500 truncate">{game.description}</p>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 cursor-pointer"
                  checked={selectedIds.includes(game.id)}
                  onChange={() => handleCheckboxChange(game.id)}
                />
              </div>
            ))}
             {boardGames.length === 0 && <p className="text-gray-500 text-center">ยังไม่มีบอร์ดเกมในระบบ</p>}
          </div>

          {/* Action Buttons */}
          {(canEdit || canDelete) && (
            <div className="border-t pt-4 flex justify-end space-x-3 animate-fade-in">
              {canEdit && (
                <button
                  onClick={handleEditClick}
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-200 flex items-center shadow-sm"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  แก้ไขบอร์ดเกม
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center shadow-sm"
                >
                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  ลบบอร์ดเกม
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageGamesView;
