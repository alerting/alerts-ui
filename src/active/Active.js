import React, { Component } from 'react';

import { Button, Header, Menu, Loader } from 'semantic-ui-react';
import { Switch, Route, NavLink, withRouter } from 'react-router-dom';
import { geolocated } from 'react-geolocated';
import moment from 'moment';
import Pluralize from 'react-pluralize';
import FetchAlerts from '../alerts/FetchAlerts';
import AlertsMap from '../alerts/AlertsMap';

import './Active.css';

var Active = () => {
  return (
    <div>
      <Header as="h1" className="invisible">Active alerts</Header>

      <Menu pointing secondary>
        <Menu.Item as={NavLink} exact to="/active" content="Active for your location" />
        <Menu.Item as={NavLink} exact to="/active/all" content="All active" />
      </Menu>

      <Switch>
        <Route exact path='/active'
          component={Active.Localized} />
        <Route exact path='/active/all'
          component={Active.All} />
      </Switch>
    </div>
  );
};

class AlertsLocalized extends Component {
  constructor() {
    super();

    this.state = {
      time: moment(),
      loaded: false
    };
  }

  loaded(success, results) {
    if (success) {
      var state = this.state;
      state.total = parseInt(results.total, 10);
      state.loaded = true;
      this.setState(state);
    }
  }

  refresh() {
    var state = this.state;
    state.time = moment();
    state.loaded = false;
    this.setState(state);
  }

  render() {
    // If the user's browser doesn't have geolocation,
    // show a message to this effect.
    if (!this.props.isGeolocationAvailable) {
      return <p>Your browser does not support Geolocation.</p>;
    }

    // If geolocation is not enabled,
    // show a message to this effect.
    if (!this.props.isGeolocationEnabled) {
      return <p>Geolocation is not enabled.</p>;
    }

    // If we don't have the user's location yet,
    // let's show a message to this effect.
    if (!this.props.coords) {
      return <Loader active size="medium" content="Locating" inline="centered" />;
    }

    return (
      <div>
        {this.state.loaded
          ? <Button className="refresh-button" floated="right" circular icon="refresh" onClick={() => this.refresh()} />
          : null}

        {this.state.loaded
          ? <p>There <Pluralize singular="is" plural="are" count={this.state.total} showCount={false} /> <Pluralize singular="active alert" count={this.state.total} zero="no active alerts" /> for your location.</p>
          : null}

        <FetchAlerts loaded={(success, results) => this.loaded(success, results)}
          searchId={this.state.time.toISOString()}
          params={{
            count: 100,
            superseded: false,
            language: 'en-CA',
            sort: '-effective',
            status: 'actual',
            effective_lte: this.state.time.toISOString(),
            expires_gte: this.state.time.toISOString(),
            point: `${this.props.coords.latitude},${this.props.coords.longitude}`
          }} />
      </div>
    );
  }
}

Active.Localized = geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(AlertsLocalized);


class ActiveAll extends Component {
  constructor() {
    super();

    this.state = {
      time: moment(),
      total: 0,
      hits: [],
      loaded: false
    };
  }

  loaded(success, results) {
    if (success) {
      var state = this.state;
      state.total = results.total;
      state.hits = results.hits;
      state.loaded = true;
      this.setState(state);
    }
  }

  refresh() {
    var state = this.state;
    state.time = moment();
    state.loaded = false;
    state.hits = [];
    this.setState(state);
  }

  render() {
    return (
      <div>
        {this.state.loaded
          ? <Button className="refresh-button" floated="right" circular icon="refresh" onClick={() => this.refresh()} />
          : null}

        {this.state.loaded
          ? <p>There <Pluralize singular="is" plural="are" count={this.state.total} showCount={false} /> <Pluralize singular="active alert" count={this.state.total} zero="no active alerts" />.</p>
          : null}

        <AlertsMap hits={ this.state.hits } selectable={true} />

        <FetchAlerts loaded={(success, results) => this.loaded(success, results)}
          searchId={this.state.time.toISOString()}
          params={{
            count: 100,
            superseded: false,
            language: 'en-CA',
            sort: '-effective',
            status: 'actual',
            effective_lte: this.state.time.toISOString(),
            expires_gte: this.state.time.toISOString()
          }} />
      </div>
    );
  }
}

Active.All = ActiveAll;

export default withRouter(Active);