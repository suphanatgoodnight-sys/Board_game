import React, { useState, useEffect, useRef } from 'react';
import { BoardGame } from '../types';
import { recordReturn } from '../services/googleSheetService';

interface ReturnModalProps {
  boardGames: BoardGame[];
  onClose: () => void;
}

const ReturnModal: React.FC<ReturnModalProps> = ({ boardGames, onClose }) => {
  const [studentId, setStudentId] = useState('');
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (gameName: string) => {
    setSelectedGames(prevSelected => {
      if (prevSelected.includes(gameName)) {
        return prevSelected.filter(name => name !== gameName);
      } else {
        return [...prevSelected, gameName];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || selectedGames.length === 0) {
      setError('กรุณากรอกรหัสนักศึกษาและเลือกเกมที่ต้องการคืน');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const returnPromises = selectedGames.map(gameName => recordReturn(studentId, gameName));
      const results = await Promise.all(returnPromises);
      
      // Check for the first failed result to display the correct error message
      // This will correctly show "ไม่พบเลขประจำตัวนักเรียนที่ยืมบอร์ดเกม" if the script returns it.
      const firstFailedResult = results.find(res => !res.success);
      
      if (firstFailedResult) {
        throw new Error(firstFailedResult.message || 'การคืนเกมบางรายการล้มเหลว');
      }

      alert('คืนบอร์ดเกมสำเร็จ!');
      onClose();
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'เกิดข้อผิดพลาดในการส่งข้อมูล';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const dropdownText = selectedGames.length === 0 
    ? '-- เลือกบอร์ดเกม --' 
    : `เลือกแล้ว ${selectedGames.length} รายการ`;

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
          <p className="text-gray-600 mb-4">กรอกรหัสนักศึกษาและเลือกเกมที่ต้องการคืน</p>
          
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="returnStudentId" className="block text-sm font-medium text-gray-700 mb-1">เลขประจำตัวนักศึกษา</label>
              <input
                type="text"
                id="returnStudentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="กรอกเลขประจำตัว"
                required
              />
            </div>

            <div className="relative" ref={dropdownRef}>
              <label htmlFor="returnGame" className="block text-sm font-medium text-gray-700 mb-1">บอร์ดเกมที่ต้องการคืน</label>
              <button
                type="button"
                id="returnGame"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex justify-between items-center"
              >
                <span>{dropdownText}</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <ul>
                    {boardGames.map(game => (
                      <li key={game.id} className="hover:bg-gray-100">
                        <label className="flex items-center justify-between w-full px-4 py-2 cursor-pointer">
                          <span className="text-gray-800">{game.name}</span>
                          <input
                            type="checkbox"
                            checked={selectedGames.includes(game.name)}
                            onChange={() => handleCheckboxChange(game.name)}
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || selectedGames.length === 0}
              className="px-6 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันคืนบอร์ดเกม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnModal;