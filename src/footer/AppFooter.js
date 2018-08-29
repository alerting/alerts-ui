import React from 'react';
import { Container /*, Image */ } from 'semantic-ui-react';

import './AppFooter.css';
//import logo from '../resources/logo.svg';

/**
 *       <Container as="p" textAlign="center">
         <a href="https://zacharyseguin.ca">
            <Image size="medium" centered src={logo} alt="Zachary Seguin" />
         </a>
      </Container>
 */

const AppFooter = () => (
   <Container as="footer" className="app-footer">
      <Container as="p" textAlign="center">
        Copyright &copy; 2018 &mdash; <a href="https://zacharyseguin.ca">Zachary Seguin</a>
        <br />
        Source code available on <a href="https://github.com/alerting">GitHub</a>.
      </Container>
   </Container>
)

export default AppFooter;
