import { useEffect, useMemo, useState } from 'react';

import { CounterInput } from '@/components/atoms/CounterInput';
import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useCounterStore } from '@/stores/counter';
import { useCoreStore, useNotificationsStore } from '@/toolkit/react-toolkit';
import { useAppProvidedVariable } from '@/context/AppContext';

export function HomePage() {
  const count = useCounterStore((state) => state.count);
  const doubleCount = useCounterStore((state) => state.doubleCount());
  const increment = useCounterStore((state) => state.increment);
  const incrementDelayed = useCounterStore((state) => state.incrementDelayed);
  const setCount = useCounterStore((state) => state.setCount);
  const setLoading = useCoreStore((state) => state.setLoading);
  const addMessage = useNotificationsStore((state) => state.addMessage);
  const { providedVariable, setProvidedVariable } = useAppProvidedVariable();
  const [websocketMessages, setWebsocketMessages] = useState<string[]>([]);

  useEffect(() => {
    setLoading('core', true);
    const coreTimeout = setTimeout(() => setLoading('core', false), 500);
    const sideTimeout = setTimeout(() => setLoading('usersList', false), 1500);
    setLoading('usersList', true);

    return () => {
      clearTimeout(coreTimeout);
      clearTimeout(sideTimeout);
      setLoading('usersList', false);
    };
  }, [setLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWebsocketMessages((messages) => [
        ...messages,
        `Simulated ws message at ${new Date().toLocaleTimeString()}`
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const mappedMessages = useMemo(
    () => websocketMessages.slice(-6).map((message) => <div key={message} className="theme-card">{message}</div>),
    [websocketMessages]
  );

  return (
    <LayoutDefault
      header={
        <h1 className="theme-page-title">
          <span>Home</span>
        </h1>
      }
    >
      <div className="grid-two">
        <div className="theme-card">
          <p>Counter</p>
          <p>
            <b style={{ fontSize: '2rem' }}>{count}</b> <small>({doubleCount})</small>
          </p>
          <div className="row">
            <button className="theme-button" type="button" onClick={increment}>Increment</button>
            <button className="theme-button" type="button" onClick={() => void incrementDelayed()}>
              Delayed increment
            </button>
          </div>
          <CounterInput value={count} min={0} max={5} onChange={setCount} />
        </div>

        <div className="theme-card">
          <h3>{providedVariable}</h3>
          <p>Provided from App.tsx through React context.</p>
          <label htmlFor="provided-input">Update by typing</label>
          <input
            id="provided-input"
            className="theme-input"
            value={providedVariable}
            onChange={(event) => setProvidedVariable(event.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <button className="theme-button" type="button" onClick={() => addMessage(`Hello world ${Date.now()}`)}>
          Add test alert
        </button>
        <button className="theme-button" type="button" onClick={() => setWebsocketMessages([])}>
          Reset messages
        </button>
      </div>

      <div className="grid-two">{mappedMessages}</div>
    </LayoutDefault>
  );
}
