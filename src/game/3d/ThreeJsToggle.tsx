import React from 'react';

interface ThreeJsToggleProps {
  is3DEnabled: boolean;
  onToggle: () => void;
}

const ThreeJsToggle: React.FC<ThreeJsToggleProps> = ({ is3DEnabled, onToggle }) => {
  return (
    <div className="absolute top-4 right-20 z-10">
      <button
        className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${
          is3DEnabled 
            ? 'bg-purple-600 text-white hover:bg-purple-700' 
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
        onClick={onToggle}
      >
        {is3DEnabled ? '3D Mode' : '2D Mode'}
      </button>
    </div>
  );
};

export default ThreeJsToggle;
