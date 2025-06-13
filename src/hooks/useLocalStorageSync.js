import { useEffect } from "react";

export function useLocalStorageSync(key, value) {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
}