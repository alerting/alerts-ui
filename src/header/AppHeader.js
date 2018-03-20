import React from 'react';
import { Container, Header, Image } from 'semantic-ui-react';

import logo from './logo.svg';
import './AppHeader.css';

const AppHeader = () => (
   <Container as="header" className="app-header" textAlign="center">
      <a href="https://zacharyseguin.ca"><Image size="medium" src={logo} alt="Zachary Seguin" /></a>
      <Header as="span" color="red">alerts</Header>
   </Container>
)

export default AppHeader;