import { createContext } from 'react';
import type { AuthContextType } from '../types/auth';

// Tạo context với type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props cho provider
