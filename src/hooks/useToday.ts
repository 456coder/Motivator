import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { dateKey } from '@/logic/dates';

/** Today's date key. Updates when the app comes back to the front, and each minute (for midnight). */
export function useToday() {
  const [today, setToday] = useState(dateKey);
  useEffect(() => {
    const update = () => setToday(dateKey());
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') update();
    });
    const timer = setInterval(update, 60_000);
    return () => {
      sub.remove();
      clearInterval(timer);
    };
  }, []);
  return today;
}
