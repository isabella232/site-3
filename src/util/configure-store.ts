import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { getTokenFromStorage, pollLoginState } from '../actions/auth-actions';
import { GlobalState, rootReducer } from '../reducers';

export function configureTestStore(initialState: Partial<GlobalState> = {}) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}

export default function configureStore() {
  const { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ } = (window || {}) as any;
  const composeEnhancers = __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(thunk))
  );

  store.dispatch(getTokenFromStorage() as any);

  store.dispatch(pollLoginState() as any);

  return store;
}
