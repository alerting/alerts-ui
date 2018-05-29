import React, { Component } from 'react';
import './Search.css';

import { Button, Card, Form, Grid, Header, Message } from 'semantic-ui-react';
import {geolocated} from 'react-geolocated';

import FetchAlerts from '../alerts/FetchAlerts';

class Search extends Component {
  statusOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'actual', value: 'actual', text: 'Actual' },
    { key: 'exercise', value: 'exercise', text: 'Excercise' },
    { key: 'system', value: 'system', text: 'System' },
    { key: 'test', value: 'test', text: 'Test' },
    { key: 'draft', value: 'draft', text: 'Draft' }
  ];

  messageTypeOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'alert', value: 'alert', text: 'Alert' },
    { key: 'update', value: 'update', text: 'Update' },
    { key: 'cancel', value: 'cancel', text: 'Cancel' },
    { key: 'ack', value: 'ack', text: 'Acknowledge' },
    { key: 'error', value: 'error', text: 'Error' }
  ];

  scopeOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'public', value: 'public', text: 'Public' },
    { key: 'restricted', value: 'restricted', text: 'Restricted' },
    { key: 'private', value: 'private', text: 'Private' }
  ];

  urgencyOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'immediate', value: 'immediate', text: 'Immediate' },
    { key: 'expected', value: 'expected', text: 'Expected' },
    { key: 'future', value: 'future', text: 'Future' },
    { key: 'past', value: 'past', text: 'Past' },
    { key: 'unknown', value: 'unknown', text: 'Unknown' }
  ];

  severityOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'extreme', value: 'extreme', text: 'Extreme' },
    { key: 'severe', value: 'severe', text: 'Severe' },
    { key: 'moderate', value: 'moderate', text: 'Moderate' },
    { key: 'minor', value: 'minor', text: 'Minor' },
    { key: 'unknown', value: 'unknown', text: 'Unknown' }
  ];

  certaintyOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'observed', value: 'observed', text: 'Observed' },
    { key: 'likely', value: 'likely', text: 'Likely' },
    { key: 'possible', value: 'possible', text: 'Possible' },
    { key: 'unlikely', value: 'unlikely', text: 'Unlikely' },
    { key: 'unknown', value: 'unknown', text: 'Unknown' }
  ];

  sortOptions = [
    { key: '-effective', value: '-effective', text: 'Effective (Descending)' },
    { key: 'effective', value: 'effective', text: 'Effective (Ascending)' },
    { key: '-_score', value: '-_score', text: 'Relevance' }
  ];

  languageOptions = [
    { key: 'any', value: 'any', text: 'Any' },
    { key: 'en-CA', value: 'en-CA', text: 'English' },
    { key: 'fr-CA', value: 'fr-CA', text: 'French' }
  ];

  constructor() {
    super()

    this.state = {
      params: {
        from: 0,
        size: 10,
        language: 'en-CA',
        sort: "-effective",
        status: "actual"
      },
      search_id: 0,
      search_params: null,
      results: null,
      loading: false,
      errors: []
    };
  }

  submitHandler(reset) {
    var state = this.state;
    state.loading = true;

    if (state.results !== null) {
      state.results.hits.hits = [];
    }
    state.errors = [];

    if (reset) {
      state.params.from = 0;
    }

    state.search_params = Object.assign({}, state.params);
    state.search_id++;
    this.setState(state);
  }

  updateValue(key, value) {
    var state = this.state;
    if (value === "any" || value === "") {
      delete state.params[key];
    } else {
      state.params[key] = value;
    }
    this.setState(state);
  }

  loaded(success, res) {
    var state = this.state;
    state.loading = false;
    this.setState(state);
  }

  render() {
    return (
      <div className="search">
        <Card fluid>
          <Card.Content>
            <Card.Header as="h2">
            Search criteria
            </Card.Header>
            <Card.Description>
                <Form onSubmit={(e) => this.submitHandler(true)} loading={this.state.loading}>
                  <Form.Group widths="equal">
                    <Form.Select options={this.languageOptions}
                                 value={this.state.params.language || "any"}
                                 label="Language"
                                 onChange={(e, { value }) => this.updateValue('language', value)} />
                    <Form.Select options={this.sortOptions} value={this.state.params.sort || "-effective"} label="Sort" onChange={(e, { value }) => this.updateValue('sort', value)} />
                  </Form.Group>

                  <Form.Group widths="equal">
                    <Form.Select options={this.statusOptions} value={this.state.params.status || "any"} label="Status" onChange={(e, { value }) => this.updateValue('status', value)} />
                    <Form.Select options={this.messageTypeOptions} value={this.state.params.message_type || "any"} label="Message Type" onChange={(e, { value }) => this.updateValue('message_type', value)} />
                    <Form.Select options={this.scopeOptions} value={this.state.params.scope || "any"} label="Scope" onChange={(e, { value }) => this.updateValue('scope', value)} />
                  </Form.Group>

                  <Form.Group widths="equal">
                    <Form.Select options={this.urgencyOptions} value={this.state.params.urgency || "any"} label="Urgency" onChange={(e, { value }) => this.updateValue('urgency', value)} />
                    <Form.Select options={this.severityOptions} value={this.state.params.severity || "any"} label="Severity" onChange={(e, { value }) => this.updateValue('severity', value)} />
                    <Form.Select options={this.certaintyOptions} value={this.state.params.certainty || "any"} label="Certainty" onChange={(e, { value }) => this.updateValue('certainty', value)} />
                  </Form.Group>

                  <Form.Group widths={16}>
                    <Form.Input label="Location"
                                width={6}
                                placeholder="Location"
                                value={this.state.params.area_description || ''}
                                onChange={(e, { value }) => this.updateValue('area_description', value)} />

                    <Form.Input label="Point (lat, lon)"
                                width={6}
                                placeholder="latitude, longitude"
                                value={this.state.params.point || ''}
                                onChange={(e, { value }) => this.updateValue('point', value.replace(' ', ''))} />

                    <Grid.Column width={4} className="form-btn">
                      <Button content="My Location" as="a"
                                  secondary
                                  compact
                                  fluid
                                  disabled={!this.props.isGeolocationEnabled || !this.props.isGeolocationAvailable || this.props.coords === null}
                                  onClick={(e, { value }) => {
                                    e.preventDefault();

                                    if (this.props.isGeolocationAvailable && this.props.isGeolocationEnabled) {
                                      this.updateValue('point', `${this.props.coords.latitude},${this.props.coords.longitude}`)
                                    } else {
                                      alert('Sorry');
                                    }
                                  }} />
                    </Grid.Column>
                  </Form.Group>

                  <Form.Group widths="equal">
                    <Form.Input label="Headline" placeholder="Headline" value={this.state.params.headline || ''} onChange={(e, { value }) => this.updateValue('headline', value)} />
                    <Form.Input label="Description" placeholder="Description" value={this.state.params.description || ''} onChange={(e, { value }) => this.updateValue('description', value)} />
                    <Form.Input label="Instruction" placeholder="Instruction" value={this.state.params.instruction || ''} onChange={(e, { value }) => this.updateValue('instruction', value)} />
                  </Form.Group>

                  <Form.Button>Search</Form.Button>
                </Form>
            </Card.Description>
          </Card.Content>
        </Card>

        <div className="alerts">
          {this.state.errors.map( (message, indx) => {
            return (
              <Message header="Error" content={message} key={indx} error />
            );
          })}
        </div>       

        {this.state.search_params ? (
          <div>
            {!this.state.loading ? (<Header as="h2">Search results</Header>) : ''}
            <FetchAlerts params={this.state.search_params}
                         searchId={this.state.search_id}
                         loader={false}
                         loaded={(success, res) => this.loaded(success, res)} />
          </div>
        ) : ''}
        
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  userDecisionTimeout: 5000
})(Search);
