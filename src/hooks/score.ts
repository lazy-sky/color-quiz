import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void) {
  const savedCallback = useRef(() => {});

  // 최신 함수를 기억
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 인터벌 설정
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }
    
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
}