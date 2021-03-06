import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { appReducer } from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index';

const initialState = {};
const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware, thunk];

const store = createStore(
  appReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

sagaMiddleware.run(rootSaga);


export default store;