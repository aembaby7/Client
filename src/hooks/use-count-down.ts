import { useEffect, useState } from 'react';

export const useCountDown = (
  initialTime: number,
  callback: () => void,
  interval: number = 1000
) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const customInterval = setInterval(() => {
      if (time > 0) {
        setTime((prev) => {
          const diff = prev - interval;
          return diff < 0 ? 0 : diff;
        });
      }
    }, interval);
    if (time === 0) {
      callback();
    }
    return () => clearInterval(customInterval);
  }, [time]);

  return time;
};
