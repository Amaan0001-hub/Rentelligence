
"use client";
import { useEffect, useState } from 'react';

export const useTempStorage = (key) => {
  const [value, setValue] = useState(null);

  const setTempValue = (data) => {
    const storageId = `temp_${Date.now()}`;
    sessionStorage.setItem(storageId, JSON.stringify(data));
    sessionStorage.setItem(key, storageId); 
    setValue(data);
  };


  useEffect(() => {
    const storageId = sessionStorage.getItem(key);
    if (storageId) {
      const data = JSON.parse(sessionStorage.getItem(storageId));
      setValue(data);
      sessionStorage.removeItem(storageId);
      sessionStorage.removeItem(key);
    }
  }, [key]);

  return [value, setTempValue];
};