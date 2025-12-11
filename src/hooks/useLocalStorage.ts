import { useState } from 'react';

export function useLocalStorage<T>(keyName: string, defaultValue: T): [T, (value: T | ((data: T) => T)) => void] {
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

    const setValue = (value: T | ((data: T) => T)) => {
        let data: T;

        if (typeof value === 'function') {
            data = (value as (data: T) => T)(storedValue);
        } else {
            data = value;
        }

        try {
            window.localStorage.setItem(keyName, JSON.stringify(data)); // ✔ đúng
        } catch (err) {
            console.error(err);
        }

        setStoredValue(data); // ✔ đúng
    };

    return [storedValue, setValue];
}
