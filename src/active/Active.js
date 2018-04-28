import React, { Component } from 'react';
import { Header, Tab } from 'semantic-ui-react';

import moment from 'moment';
import 'moment-timezone';
import Pluralize from 'react-pluralize';

import {geolocated} from 'react-geolocated';

import FetchAlerts from '../alerts/FetchAlerts';

class Active extends Component {
   loaded(success, obj) {
      if (success) {
         var state = this.state || {};
         state.active = obj;
         this.setState(state);
      }
   }

   yourLoaded(success, obj) {
      if (success) {
         var state = this.state || {};
         state.yourActive = obj;
         this.setState(state);
      }
   }

   renderYourLocation() {
      if (!this.props.coords) {
         return (
            <p>Finding your location...</p>
         );
      }

      return (
         <div>
            {this.state && this.state.yourActive
               ? (<p>There are <Pluralize singular="active alert" count={this.state.yourActive.total_hits || 0} zero="no active alerts" /> for your location.</p>)
               : 'Loading alerts for your location...'
            }

            <FetchAlerts   loaded={(success, obj) => this.yourLoaded(success, obj)}
                     params={{ language: 'en-CA',
                     point: `${this.props.coords.latitude},${this.props.coords.longitude}`,
                     sort: '-effective',
                     status: 'actual',
                     effective_lte: moment().toISOString(),
                     expires_gte: moment().toISOString()}} />
         </div>
      );
   }

   render() {
      const panes = [
         { menuItem: 'Active at your location', render: () => this.renderYourLocation() },
         { menuItem: 'All active alerts', render: () => <Active.AllAlerts /> },
      ];

      return (
         <div>
            <Header as="h1">Active Alerts</Header>
            <Tab menu={{ secondary: true, pointing: true}} panes={panes} />
         </div>
      );
   }
}

class AllActiveAlerts extends Component {
   loaded(success, obj) {
      if (success) {
         var state = this.state || {};
         state.hits = obj.total_hits;
         this.setState(state);
      }
   }

   render() {
      return (
         <div>
            {this.state && this.state.hits
               ? (<p>There are <Pluralize singular="active alert" count={this.state.hits || 0} />.</p>)
               : ''
            }

            <FetchAlerts   loaded={(success, obj) => this.loaded(success, obj)}
                           params={{ language: 'en-CA',
                                 sort: '-effective',
                                 status: 'actual',
                                 effective_lte: moment().toISOString(),
                                 expires_gte: moment().toISOString()}} />
         </div>
      );
   }
}

Active.AllAlerts = AllActiveAlerts;

export default geolocated({
   positionOptions: {
     enableHighAccuracy: false
   },
   userDecisionTimeout: 5000
 })(Active);