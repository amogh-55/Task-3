import React, { useContext, useReducer, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, count: action.count, myCount: action.myCount };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'INCREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount + 1 };
    case 'DECREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>MyCounter Value: {state.myCount}</h1>
      <Link to="/counter">Counter </Link><br></br>
      <Link to="/myCounter">Mycounter</Link>

      
    </div>
  );
};

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: response.data.count, myCount: response.data.myCount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      console.log('Incrementing counter...');
      await axios.post('http://localhost:5000/api/myCounter/increment');
      dispatch({ type: 'INCREMENT_MY_COUNT' });
      console.log('Counter incremented successfully');
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      console.log('Decrementing counter...');
      await axios.post('http://localhost:5000/api/myCounter/decrement');
      dispatch({ type: 'DECREMENT_MY_COUNT' });
      console.log('Counter decremented successfully');
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>my Counter</h2>
      <p>Count: {state.count}</p>
     
      <p>MyCount: {state.myCount}</p>
      <button onClick={incrementCounter}>Increment MyCount</button>
      <button onClick={decrementCounter}>Decrement MyCount</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: response.data.count, myCount: response.data.myCount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      console.log('Incrementing counter...');
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT' });
      console.log('Counter incremented successfully');
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      console.log('Decrementing counter...');
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT' });
      console.log('Counter decremented successfully');
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <p>MyCount: {state.myCount}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};


const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/myCounter">my Counter</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/myCounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
