import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [maxDistance, setMaxDistance] = useState(50);
  const [location, setLocation] = useState('New Delhi');
  const [lookingFor, setLookingFor] = useState('Women');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [globalMode, setGlobalMode] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('matchkar_settings');
        if (stored) {
          const p = JSON.parse(stored);
          if (p.maxDistance !== undefined) setMaxDistance(p.maxDistance);
          if (p.location) setLocation(p.location);
          if (p.lookingFor) setLookingFor(p.lookingFor);
          if (p.minAge !== undefined) setMinAge(p.minAge);
          if (p.maxAge !== undefined) setMaxAge(p.maxAge);
          if (p.globalMode !== undefined) setGlobalMode(p.globalMode);
        }
      } catch (e) {
        // ignore
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem('matchkar_settings', JSON.stringify({
      maxDistance, location, lookingFor, minAge, maxAge, globalMode
    })).catch(() => {});
  }, [maxDistance, location, lookingFor, minAge, maxAge, globalMode, loaded]);

  return (
    <SettingsContext.Provider value={{
      maxDistance, setMaxDistance,
      location, setLocation,
      lookingFor, setLookingFor,
      minAge, setMinAge,
      maxAge, setMaxAge,
      globalMode, setGlobalMode,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
