import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'semantic-ui-css/semantic.min.css';
import App from './App';
import GoogleAnalytics, { initGoogleAnalytics } from './components/GoogleAnalytics';
import './index.css';
import * as serviceWorker from './serviceWorker';
import configurePersistedStore from './util/configure-persisted-store';

initGoogleAnalytics();

const { store, persistor } = configurePersistedStore();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App/>
        <GoogleAnalytics/>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
