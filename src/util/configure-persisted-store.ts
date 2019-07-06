import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import thunk from 'redux-thunk';
import { GlobalState, rootReducer } from '../reducers';

export function configureTestStore(initialState: Partial<GlobalState> = {}) {
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}

export default function configurePersistedStore() {
  const { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ } = (window || {}) as any;
  const composeEnhancers = __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const persistedReducer = persistReducer(
    {
      key: 'root',
      storage,
      version: 1,
      throttle: 100,
      whitelist: process.env.NODE_ENV === 'development' ? [ 'auth', 'accounts' ] : [ 'auth' ]
    },
    rootReducer
  );

  const store = createStore(
    persistedReducer,

    composeEnhancers(applyMiddleware(thunk))
  );

  const persistor = persistStore(store);

  return { store, persistor };
}
