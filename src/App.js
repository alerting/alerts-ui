import React, { Component } from 'react';
import './App.css';

import { Grid } from 'semantic-ui-react';

import { Route, Switch } from 'react-router-dom';

import AppHeader from './header/AppHeader';
import AppMenu from './header/AppMenu';
import AppFooter from './footer/AppFooter';

// Pages
import Active from './active/Active';
import Search from './search/Search';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Grid columns={16} container>
          <Grid.Row>
          <Grid.Column width={16}>
              <AppHeader />
            </Grid.Column>
            <Grid.Column width={16}>
              <AppMenu />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Switch>
                <Route exact path='/' component={Active} />
                <Route exact path='/search' component={Search} />
              </Switch>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <AppFooter />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
