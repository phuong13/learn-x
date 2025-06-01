import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CountdownTimer = ({ timeLimit, onTimeout }) => {
  const safeTimeLimit = Number(timeLimit) > 0 ? Number(timeLimit) : 60;
  const [timeLeft, setTimeLeft] = useState(safeTimeLimit);

  useEffect(() => {
    setTimeLeft(safeTimeLimit);
  }, [safeTimeLimit]);

  useEffect(() => {
    if (timeLeft === 0 && onTimeout) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const percentage = (timeLeft / safeTimeLimit) * 100;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg text-center w-full h-48 flex flex-col items-center justify-center shadow-md">
      <div style={{ width: 120, height: 120 }}>
        <CircularProgressbar
          value={percentage}
          text={formatTime(timeLeft)}
          styles={buildStyles({
            textColor: '#14919B',
            pathColor: '#14919B',
            trailColor: '#e5e7eb',
            textSize: '24px', 
          })}
        />
      </div>
      <div className='text-lg font-semibold mt-4 text-slate-700'>
        Thời gian còn lại
      </div>
    </div>

  );
};

export default CountdownTimer;
