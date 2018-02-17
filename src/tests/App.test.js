import React from 'react';
import ReactDOM from 'react-dom';
import LotroApp from './../components/LotroApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<LotroApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
