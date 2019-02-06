import React, { Component } from 'react';

import { Accordion, Card, Grid, Header, Icon, Label, List, Modal, Loader, Message } from 'semantic-ui-react';

import nl2br from 'react-newline-to-break';
import Moment from 'react-moment';
import 'moment-timezone';
import URI from 'urijs';
import { withRouter } from 'react-router-dom';
import Pluralize from 'react-pluralize';

import AlertsMap from './AlertsMap';

import './Alert.css';

class Alert extends Component {
  static urgencyColours = {
    "IMMEDIATE": "red",
    "EXPECTED": "orange",
    "FUTURE": "yellow",
    "PAST": "green"
  }

  static severityColours = {
    "EXTREME": "red",
    "SEVERE": "orange",
    "MODERATE": "yellow",
    "MINOR": "green"
  }

  static certaintyColours = {
    "OBSERVED": "red",
    "LIKELY": "orange",
    "POSSIBLE": "yellow",
    "UNLIKELY": "green"
  }

  static typeColours = {
    "ALERT": "red",
    "UPDATE": "orange",
    "CANCEL": "green",
    "ACK": "teal",
    "ERROR": "black"
  }

  constructor() {
    super();

    this.state = {
      areaIndex: -1,
      error: false,
      hit: null,
    };
  }

  componentDidMount() {
    var state = this.state;

    // Get hit from props
    if (this.props.hit) {
      state.hit = this.props.hit;
      this.setState(state);
    }
    // If it's in the location state, grab it there
    else if (typeof this.props.location.state === 'object' && this.props.location.state.hit) {
      state.hit = this.props.location.state.hit;
      this.setState(state);
    }
    // Else, load it
    else {
      this.fetch(this.props.match.params.id);
    }
  }

  fetch(id) {
    // Seperate the alert into its components
    id = id.split(':');

    if (id.length !== 2) {
      var state = this.state;
      state.error = true;
      this.setState(state);
    }

    const aid = id[0];
    const iid = parseInt(id[1], 10)

    fetch(URI(`/api/alerts/${aid}`)
      .toString())
      .then(res => res.json(), err => {
        var state = this.state;
        state.error = true;
        this.setState(state);
      })
      .then(json => {
        var state = this.state;
        state.hit = {
          alert_id: aid,
          id: `${aid}:${iid}`,
          info: json.infos[iid]
        };
        this.setState(state);
      });
  }

  handleAreasClick(e, p) {
    var state = this.state;
    state.areasIndex = state.areasIndex === p.index ? -1 : p.index;
    this.setState(state);
  }

  render() {
    // If we had an error fetching details,
    // indicate so.
    if (this.state.error) {
      return <Message header="Error" content="An error occurred loading the alert." error />;
    }

    const info = (this.state.hit || {}).info;

    // If we don't have any info, we're loading it.
    // Return a loader icon.
    if (info === null || info === undefined) {
      return <Loader active size="medium" content="Fetching alert" inline="centered" />;
    }

    return (
      <Card className="info" fluid>
        <Card.Content>
          <Card.Header>
            <Grid columns="16">
              <Grid.Row>
                <Grid.Column largeScreen="12" computer="10" widescreen="10" tablet="10" mobile="16" verticalAlign="middle">
                  <Header as="h3">{(info.headline || "").toUpperCase()}</Header>
                </Grid.Column>
                <Grid.Column largeScreen="4" computer="6" widescreen="6" tablet="6" mobile="16" textAlign="right" verticalAlign="middle">
                  <Label color={Alert.urgencyColours[info.urgency]} size="small">
                    {info.urgency}
                  </Label>
                  <Label color={Alert.severityColours[info.severity]} size="small">
                    {info.severity}
                  </Label>
                  <Label color={Alert.certaintyColours[info.certainty]} size="small">
                    {info.certainty}
                  </Label>

                  <br />

                  {(info.response_types || []).map((r, indx) => (
                    <Label key={indx} size="small">{r}</Label>
                  ))}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
          <Card.Meta>
            Issued by {info.web ? (<a href={info.web}>{info.senderName}</a>) : info.sender_name}
            <br />
            <Moment format="lll">{info.effective || alert.sent}</Moment> to <Moment format="lll">{info.expires}</Moment>

            <div className="areasMap">
              <AlertsMap hits={[ this.state.hit ]} />
            </div>

            <Accordion>
              <Accordion.Title active={this.state.areasIndex === 0} index={0} onClick={(e, p) => this.handleAreasClick(e, p)}>
                <Icon name='dropdown' />
                Affected areas (<Pluralize singular="area" count={info.areas.length} />)
              </Accordion.Title>
              <Accordion.Content active={this.state.areasIndex === 0}>
              <div className="areas">
                {info.areas.sort((a, b) => a.description >= b.description)
                .map((area, indx) => {
                  return (
                    <span className='area' key={indx}>{area.description}</span>
                  );
                })}
              </div>
              </Accordion.Content>
            </Accordion>
          </Card.Meta>
        </Card.Content>
        <Card.Content>
          <Card.Description>
            {nl2br((info.description || "").trim())}
          </Card.Description>
        </Card.Content>
        {(info.instruction || "").length > 0 ? (
          <Card.Content>
            <Card.Description className="instruction">
              {nl2br((info.instruction || "").trim())}
            </Card.Description>
          </Card.Content>
        ) : ''}
        {(info.resources) ? (
          <Card.Content extra className="instruction">
            <List>
              {info.resources.map(res => {
                var resourceUri = res.digest
                  ? URI(res.digest.toLowerCase()).suffix(URI(res.uri).suffix().toLowerCase())
                    .absoluteTo(URI("/resources/"))
                  : URI(URI(res.uri).filename().toLowerCase())
                    .absoluteTo(URI("/resources/"));

                return (
                  <List.Item key={resourceUri}>
                    <List.Icon name="file" />
                    <List.Content>
                      <List.Header><a href={resourceUri} target="_blank">{unescape(URI(res.uri).filename())}</a></List.Header>
                      <List.Description>{res.description}</List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Card.Content>
        ) : ''}
      </Card>
    )
  }
}

class AlertModal extends Component {
  onClose() {
    this.props.history.goBack();
  }

  render() {
    var hit = null;

    if ('hit' in this.props.location.state) {
      hit = this.props.location.state.hit;
    } else {
      // TODO: Load alert details
    }

    if (hit === null) {
      return (
        <Modal closeIcon open onClose={() => this.onClose()}>
          <Modal.Header>Alert details</Modal.Header>
          <Modal.Content>Modal cannot load alert details at this time.</Modal.Content>
        </Modal>
      )
    }

    return (
      <Modal basic closeIcon open onClose={() => this.onClose()}>
        <Modal.Header>Alert details</Modal.Header>
        <Modal.Content>
          <Alert hit={hit} />
        </Modal.Content>
      </Modal>
    );
  }
}

Alert.Modal = withRouter(AlertModal);

export default withRouter(Alert);
