import React from 'react';
import { Header } from 'semantic-ui-react';

import FetchAlerts from '../alerts/FetchAlerts';

const Active = () => (
   <div>
      <Header as="h1">Active Alerts</Header>
      
      <p>
         <strong>Active alerts are not correctly processed at this time, so this is a list of most recently issued alerts.</strong>
      </p>
      <FetchAlerts params={{ language: 'en-CA', sort: '-effective', status: 'actual', active: true }} />
   </div>
)

export default Active;