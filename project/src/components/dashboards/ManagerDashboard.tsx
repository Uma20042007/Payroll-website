import React from 'react';

interface ManagerDashboardProps {
  onLogout: () => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onLogout }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, Manager!</h1>
      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default ManagerDashboard;
