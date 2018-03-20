import React from 'react';
import { Menu } from 'semantic-ui-react';

import { NavLink, withRouter } from 'react-router-dom';

const AppMenu = () => (
   <Menu>
      <Menu.Item as={NavLink} exact to ="/" content="Active" />
      <Menu.Item as={NavLink} exact to ="/search" content="Search" />
   </Menu>
);

export default withRouter(AppMenu);