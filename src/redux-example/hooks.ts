import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import type { IExampleDispatch, IExampleRootState } from '@/redux-example/store';

/**
 * Typed hooks for Redux usage examples.
 * These are ready if/when this example store is mounted in a Provider.
 */
export const useExampleDispatch = () => useDispatch<IExampleDispatch>();
export const useExampleSelector: TypedUseSelectorHook<IExampleRootState> = useSelector;
