import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LotroApp from './components/LotroApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<LotroApp />, document.getElementById('root'));
registerServiceWorker();
