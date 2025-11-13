
import React from 'react';

interface HeaderProps {
  onReturnClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReturnClick }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">ระบบยืม-คืนบอร์ดเกม</h1>
        <button
          onClick={onReturnClick}
          className="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2z"></path></svg>
          คืนบอร์ดเกม
        </button>
      </div>
    </header>
  );
};

export default Header;
