import React from 'react';

const MusicWave = () => {
  return (
    <div className="flex items-center justify-center">
      <svg width="34" height="24" viewBox="0 0 120 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f472b6" /> {/* pink-400 */}
            <stop offset="100%" stopColor="#6366f1" /> {/* indigo-500 */}
          </linearGradient>
        </defs>

        <rect x="10" y="10" width="5" height="30" fill="url(#waveGradient)">
          <animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="10;20;10" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="30" y="10" width="5" height="30" fill="url(#waveGradient)">
          <animate attributeName="height" values="10;30;10" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="20;10;20" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="50" y="10" width="5" height="30" fill="url(#waveGradient)">
          <animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="10;20;10" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="70" y="10" width="5" height="30" fill="url(#waveGradient)">
          <animate attributeName="height" values="10;30;10" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="20;10;20" dur="1s" repeatCount="indefinite" />
        </rect>
        <rect x="90" y="10" width="5" height="30" fill="url(#waveGradient)">
          <animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite" />
          <animate attributeName="y" values="10;20;10" dur="1s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  );
};

export default MusicWave;
