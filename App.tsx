
import React, { useState, useMemo, useEffect } from 'react';
import { BoardGame, View } from './types';
import { INITIAL_BOARD_GAMES } from './data/boardGames';
import Header from './components/Header';
import BoardGameList from './components/BoardGameList';
import ConfirmationModal from './components/ConfirmationModal';
import BorrowForm from './components/BorrowForm';
import ReturnModal from './components/ReturnModal';
import ManageGamesView from './components/ManageGamesView';
import SearchView from './components/SearchView';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.List);
  
  // Initialize state from localStorage if available, otherwise use default data
  const [boardGames, setBoardGames] = useState<BoardGame[]>(() => {
    try {
      const savedGames = localStorage.getItem('boardGames');
      if (savedGames) {
        const parsed: any[] = JSON.parse(savedGames);
        // Migration for old data: Add default category and isPopular if missing
        return parsed.map(game => ({
          ...game,
          category: game.category || 'เกมวางกลยุทธ์',
          isPopular: game.isPopular ?? false,
        }));
      }
      return INITIAL_BOARD_GAMES;
    } catch (error) {
      console.error('Error loading board games from localStorage:', error);
      return INITIAL_BOARD_GAMES;
    }
  });

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isReturnModalOpen, setReturnModalOpen] = useState(false);

  // Save to localStorage whenever boardGames changes
  useEffect(() => {
    localStorage.setItem('boardGames', JSON.stringify(boardGames));
  }, [boardGames]);

  const selectedGames = useMemo(() => boardGames.filter(game => game.selected), [boardGames]);

  const handleToggleSelect = (id: number) => {
    setBoardGames(prevGames =>
      prevGames.map(game =>
        game.id === id ? { ...game, selected: !game.selected } : game
      )
    );
  };

  const handleConfirmSelection = () => {
    if (selectedGames.length > 0) {
      setConfirmationModalOpen(true);
    } else {
      alert('กรุณาเลือกบอร์ดเกมอย่างน้อย 1 รายการ');
    }
  };

  const handleProceedToBorrow = () => {
    setConfirmationModalOpen(false);
    setView(View.BorrowForm);
  };

  const handleBorrowSuccess = () => {
    setView(View.BorrowSuccess);
    // Reset selections after borrowing
    setBoardGames(prevGames =>
      prevGames.map(game => ({ ...game, selected: false }))
    );
  };
  
  const handleAddGame = (newGameData: { name: string; description: string; imageUrl: string; category: string; isPopular: boolean }) => {
    const newGame: BoardGame = {
      ...newGameData,
      id: boardGames.length > 0 ? Math.max(...boardGames.map(g => g.id)) + 1 : 1,
      selected: false,
    };
    setBoardGames(prevGames => [...prevGames, newGame]);
  };

  const handleUpdateGame = (updatedGame: BoardGame) => {
    setBoardGames(prevGames =>
      prevGames.map(game => (game.id === updatedGame.id ? updatedGame : game))
    );
  };

  const handleDeleteGames = (ids: number[]) => {
    setBoardGames(prevGames => prevGames.filter(game => !ids.includes(game.id)));
  };

  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลบอร์ดเกมทั้งหมดให้กลับเป็นค่าเริ่มต้นตามไฟล์ระบบใช่หรือไม่? ข้อมูลที่คุณเพิ่มเองจะหายไป')) {
      setBoardGames(INITIAL_BOARD_GAMES);
      localStorage.removeItem('boardGames'); // Optional: clear storage directly to ensure clean slate
    }
  };

  const handleBackToList = () => {
    setView(View.List);
  };

  const renderContent = () => {
    switch (view) {
      case View.Search:
        return (
          <SearchView
            boardGames={boardGames}
            onToggleSelect={handleToggleSelect}
            onConfirm={handleConfirmSelection}
            selectedCount={selectedGames.length}
            onBack={handleBackToList}
          />
        );
      case View.BorrowForm:
        return <BorrowForm selectedGames={selectedGames} onSuccess={handleBorrowSuccess} onBack={handleBackToList} />;
      case View.BorrowSuccess:
        return (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white shadow-lg rounded-xl max-w-lg mx-auto mt-10">
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืมบอร์ดเกมสำเร็จ!</h2>
            <p className="text-gray-600 mb-6">กรุณาคืนบอร์ดเกมตามขั้นตอนดังนี้:</p>
            <div className="text-left bg-gray-100 p-4 rounded-lg border border-gray-200">
              <p className="mb-2">1. ไปที่หน้าเลือกบอร์ดเกม</p>
              <p>2. กดปุ่ม "คืนบอร์ดเกม" และใส่เลขประจำตัวของนักศึกษา</p>
            </div>
            <button
              onClick={handleBackToList}
              className="mt-8 w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              กลับไปหน้าหลัก
            </button>
          </div>
        );
      case View.ManageGames:
        return (
          <ManageGamesView 
            boardGames={boardGames} 
            onAddGame={handleAddGame} 
            onUpdateGame={handleUpdateGame}
            onDeleteGames={handleDeleteGames}
            onResetData={handleResetData}
            onBack={handleBackToList} 
          />
        );
      case View.List:
      default:
        return (
          <BoardGameList
            boardGames={boardGames}
            onToggleSelect={handleToggleSelect}
            onConfirm={handleConfirmSelection}
            selectedCount={selectedGames.length}
          />
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-800">
      <Header 
        onReturnClick={() => setReturnModalOpen(true)} 
        onManageClick={() => setView(View.ManageGames)}
        onSearchClick={() => setView(View.Search)}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {isConfirmationModalOpen && (
        <ConfirmationModal
          selectedGames={selectedGames}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleProceedToBorrow}
        />
      )}

      {isReturnModalOpen && (
        <ReturnModal
          boardGames={boardGames}
          onClose={() => setReturnModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
