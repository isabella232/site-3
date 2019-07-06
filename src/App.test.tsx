import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import App from './App';
import { configureTestStore } from './util/configure-persisted-store';

it('renders without crashing', () => {
  const store = configureTestStore();
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <MemoryRouter>
        <App/>
      </MemoryRouter>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
