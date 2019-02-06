import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import { unregister } from './registerServiceWorker';

import { BrowserRouter } from 'react-router-dom';

import privateConfig from './private';

unregister();

// Init MapKit
window.mapkit.init({
   authorizationCallback: privateConfig.mapkitAuthorizationCallback
});

ReactDOM.render((
   <BrowserRouter>
      <App />
   </BrowserRouter>
), document.getElementById('root'));
