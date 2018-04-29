import React, { Component } from 'react';
import './App.css';

import { Grid } from 'semantic-ui-react';

import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import AppHeader from './header/AppHeader';
import AppMenu from './header/AppMenu';
import AppFooter from './footer/AppFooter';

// Pages
import Active from './active/Active';
import Search from './search/Search';
import Alert from './alerts/Alert';

class App extends Component {
  previousLocation = this.props.location;

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;

    if (nextProps.history.action !== "POP" && (!location.state || !location.state.modal)) {
      this.previousLocation = this.props.location;
    }
  }

  render() {
    const { location } = this.props;
    const isModal = !!(location.state && location.state.modal && this.previousLocation !== location);

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
              <Switch location={isModal ? this.previousLocation : location}>
                <Route exact path='/' render={() => <Redirect to="/active" />} />
                <Route path='/active' component={Active} />
                <Route path='/search' component={Search} />
                <Route path='/alert/:id' component={Alert} />
              </Switch>
              { isModal ? <Route path="/alert/:id" component={Alert.Modal} /> : null}
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

export default withRouter(App);
