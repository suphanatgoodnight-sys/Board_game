
import React, { useState } from 'react';
import { recordReturn } from '../services/googleSheetService';
import { BoardGame } from '../types';

interface ReturnModalProps {
  onClose: () => void;
  boardGames: BoardGame[];
}

const ReturnModal: React.FC<ReturnModalProps> = ({ onClose, boardGames }) => {
  const [studentId, setStudentId] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !selectedGame) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await recordReturn(studentId, selectedGame);
      // Because of 'no-cors', we assume success.
      alert('คืนบอร์ดเกมสำเร็จ!');
      onClose();
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">คืนบอร์ดเกม</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-4">กรอกข้อมูลเพื่อยืนยันการคืนบอร์ดเกม</p>
          
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="returnGame" className="block text-sm font-medium text-gray-700 mb-1">บอร์ดเกมที่ต้องการคืน</label>
              <select
                id="returnGame"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              >
                <option value="" disabled>-- เลือกบอร์ดเกม --</option>
                {boardGames.map(game => (
                  <option key={game.id} value={game.name}>{game.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="returnStudentId" className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวนักศึกษา</label>
              <input
                type="text"
                id="returnStudentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกเลขประจำตัวของท่าน"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-wait"
            >
              {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันคืนบอร์ดเกม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;
