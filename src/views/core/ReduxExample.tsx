import { useDispatch, useSelector } from 'react-redux';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { increment, incrementBy } from '@/redux/exampleSlice';
import type { AppDispatch, RootState } from '@/redux/store';

export function ReduxExamplePage() {
  const value = useSelector((state: RootState) => state.reduxExample.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Redux Toolkit example</h1>
      <div className="theme-card">
        <p>This route demonstrates dispatch/select usage with Redux Toolkit.</p>
        <p>
          <b>Value: {value}</b>
        </p>
        <div className="row">
          <button className="theme-button" type="button" onClick={() => dispatch(increment())}>
            Increment +1
          </button>
          <button className="theme-button" type="button" onClick={() => dispatch(incrementBy(5))}>
            Increment +5
          </button>
        </div>
      </div>
    </LayoutDefault>
  );
}
