import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import FetchAlerts from '../alerts/FetchAlerts';

const Active = () => (
   <Container>
      <Header as="h1">Active Alerts</Header>
      
      <p>
         <strong>Active alerts are not correctly processed at this time, so this is a list of most recently issued alerts.</strong>
      </p>
      <FetchAlerts params={{ language: 'en-CA', sort: '-sent', status: 'actual', active: true }} />
   </Container>
)

export default Active;