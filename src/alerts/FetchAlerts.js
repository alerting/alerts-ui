import React, { Component } from 'react';

import { Container, Loader, Message } from 'semantic-ui-react';
import URI from 'urijs';
import Pagination from 'semantic-ui-react-button-pagination';

import AlertsList from './AlertsList';

class FetchAlerts extends Component {
  defaultResult = {
    total_hits: 0,
    hits: []
  }

  constructor() {
    super();

    // Put a default response to this.state
    this.state = {
      result: this.defaultResult,
      loading: false,
      errors: []
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.searchId !== props.searchId) {
      this.fetch(props.params);
    } else {
      if (props.params.start !== this.props.params.start) {
        props.params.start = this.props.params.start;
      }
    }
  }

  componentDidMount() {
    this.fetch(this.props.params);
  }

  updateValue(key, val) {
    this.props.params[key] = val;
    this.fetch(this.props.params);
  }

  fetch(params) {
    var state = this.state;
    state.loading = true;
    state.result = this.defaultResult
    state.errors = [];
    this.setState(state);

    fetch(URI('https://api.alerts.zacharyseguin.ca/alerts')
      .search(params || {}).toString())
      .then(res => {
        return res.json();
      }, err => {
        console.error(err);
        var state = this.state;
        state.loading = false;
        state.errors = ["An unexpected error occured while requesting alerts."];
        this.setState(state);

        if (this.props.loaded) {
          this.props.loaded(false, err);
        }
      })
      .then(json => {
        var state = this.state;
        state.result = json;
        state.loading = false;
        state.errors = [];
        this.setState(state);

        if (this.props.loaded) {
          this.props.loaded(true, json);
        }
      }, err => {
        console.error(err);
        var state = this.state;
        state.loading = false;
        state.errors = ["An unexpected error occured while requesting alerts."];
        this.setState(state);

        if (this.props.loaded) {
          this.props.loaded(false, err);
        }
      });
  }

  render() {
    if (this.state.result) {
      return (
        <Container className="search">
          {this.props.loader !== false ? (<Loader active={this.state.loading} size="medium" content="Fetching alerts" inline="centered" />) : ''}
          <AlertsList hits={this.state.result.hits} />

          <Container>
            {this.state.errors.map( (message, indx) => {
              return (
                <Message header="Error" content={message} key={indx} error />
              );
            })}
          </Container>

          {this.state.result && this.state.result.total > (this.props.params.size || 10) ? (
              <Container className="paginator">
                <Pagination offset={this.props.params.start || 0}
                            limit={this.props.params.size || 10}
                            total={Math.min(parseInt(this.state.result.total), 10000)} onClick={(e, props, offset) => {
                  this.updateValue('start', offset);
                }} />
              </Container>
            )
          : ''}
        </Container>
      );
    }

    return (
      <Container className="search">
        {this.props.loader !== false ? (<Loader active={this.state.loading} size="medium" content="Fetching alerts" inline="centered" />) : ''}
      </Container>
    )
  }
}

export default FetchAlerts;
