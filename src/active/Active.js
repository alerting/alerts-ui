import React, { Component } from 'react';

import { Menu, Loader } from 'semantic-ui-react';
import { Switch, Route, NavLink, withRouter } from 'react-router-dom';
import {geolocated} from 'react-geolocated';
import moment from 'moment';
import Pluralize from 'react-pluralize';
import FetchAlerts from '../alerts/FetchAlerts';

const Active = () => {
   return (
      <div>
         <Menu pointing secondary>
            <Menu.Item as={NavLink} exact to ="/active" content="Active for your location" />
            <Menu.Item as={NavLink} exact to ="/active/all" content="All active" />
         </Menu>

         <Switch>
            <Route exact path='/active' component={Active.Localized} />
            <Route exact path='/active/all' component={Active.All} />
         </Switch>
      </div>
   )
};

class AlertsLocalized extends Component {
   loaded(success, results) {
      if (success) {
         var state = this.state || {};
         state.total_hits = results.total_hits;
         this.setState(state);
      }
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
            {this.state && 'total_hits' in this.state
               ? <p>There <Pluralize singular="is" plural="are" count={this.state.total_hits} showCount={false} /> <Pluralize singular="active alert" count={this.state.total_hits} zero="no active alerts" /> for your location.</p>
               : ''}

            <FetchAlerts loaded={(success, results) => this.loaded(success, results)}
                         params={{
                            language: 'en-CA',
                            sort: '-effective',
                            status: 'actual',
                            effective_lte: moment().toISOString(),
                            expires_gte: moment().toISOString(),
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
   loaded(success, results) {
      if (success) {
         var state = this.state || {};
         state.total_hits = results.total_hits;
         this.setState(state);
      }
   }

   render() {
      return (
         <div>
            {this.state && 'total_hits' in this.state
               ? <p>There <Pluralize singular="is" plural="are" count={this.state.total_hits} showCount={false} /> <Pluralize singular="active alert" count={this.state.total_hits} zero="no active alerts" />.</p>
               : ''}

            <FetchAlerts loaded={(success, results) => this.loaded(success, results)}
                         params={{
                            language: 'en-CA',
                            sort: '-effective',
                            status: 'actual',
                            effective_lte: moment().toISOString(),
                            expires_gte: moment().toISOString()
                         }} />
         </div>
      );
   }
}

Active.All = ActiveAll;

export default withRouter(Active);