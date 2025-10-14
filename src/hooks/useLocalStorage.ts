import { useState } from 'react';

export function useLocalStorage<T>(keyName: string, defaultValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(keyName);
            if (item) {
                return JSON.parse(item) as T;
            } else {
                window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (err) {
            console.error(err);
            return defaultValue;
        }
    });

    const setValue = (value: T) => {
        try {
            window.localStorage.setItem(keyName, JSON.stringify(value));
        } catch (err) {
            console.error(err);
        }
        setStoredValue(value);
    };

    return [storedValue, setValue];
}
