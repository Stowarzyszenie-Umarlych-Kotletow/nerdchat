import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Main from './latestMessages/MainContent.js';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Main />
  </React.StrictMode>,
  document.getElementById('root')
);

