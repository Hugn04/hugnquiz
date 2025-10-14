import { useSelector, useDispatch, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Dành cho TypeScript:
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
