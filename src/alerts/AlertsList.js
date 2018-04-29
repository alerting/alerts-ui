import React, { Component } from 'react';

import { Card, Grid, Header, Label, Modal } from 'semantic-ui-react';

import Moment from 'react-moment';
import 'moment-timezone';
import Pluralize from 'react-pluralize';

import Alert from './Alert';

import './AlertsList.css';

class AlertsList extends Component {
  render() {
    if (this.props.alerts === null) {
      return '';
    }
    return (
       <div className="alerts">
         {this.props.hits.map((hit, indx) => {
            return <AlertsList.Item key={indx} hit={hit} />
         })}
        </div>
    );
  }
}

class AlertListItem extends Component {
  urgencyColours = {
    "Immediate": "red",
    "Expected": "orange",
    "Future": "yellow",
    "Past": "green"
  }

  severityColours = {
    "Extreme": "red",
    "Severe": "orange",
    "Moderate": "yellow",
    "Minor": "green"
  }

  certaintyColours = {
    "Observed": "red",
    "Likely": "orange",
    "Possible": "yellow",
    "Unlikely": "green"
  }

  typeColours = {
    "Alert": "red",
    "Update": "orange",
    "Cancel": "green",
    "Ackowledge": "teal",
    "Error": "black"
  }

  render() {
    var info = this.props.hit.info;

    return (
      <Modal trigger={<Card className="info" fluid>
        <Card.Content>
            <Card.Header>
              <Grid columns="16">
                  <Grid.Row>
                    <Grid.Column largeScreen="12" computer="10" widescreen="10" tablet="10" mobile="16" verticalAlign="middle">
                        <Header as="h3">{info.headline.toUpperCase()}</Header>
                    </Grid.Column>
                    <Grid.Column largeScreen="4" computer="6" widescreen="6" tablet="6" mobile="16" textAlign="right" verticalAlign="middle">
                        <Label color={this.urgencyColours[info.urgency]} size="small">
                          {info.urgency}
                        </Label>
                        <Label color={this.severityColours[info.severity]} size="small">
                          {info.severity}
                        </Label>
                        <Label color={this.certaintyColours[info.certainty]} size="small">
                        {info.certainty}
                        </Label>

                        <br/>

                        {(info.response_types || []).map((r, indx) => (
                          <Label key={indx} size="small">{r}</Label>
                        ))}
                    </Grid.Column>
                  </Grid.Row>
              </Grid>
            </Card.Header>
            <Card.Meta>
            Issued by {info.sender_name}
            <br />
            <Moment format="lll">{info.effective || alert.sent}</Moment> to <Moment format="lll">{info.expires}</Moment>
              
            <div className="areas">
              {info.areas.map((a, i) => {
                  a.hit = (this.props.hit.area_hits || []).indexOf(i) !== -1;
                  return a;
              })
                  .sort((a, b) => a.description >= b.description)
                  .filter((a, indx) => info.areas.length < 4 || indx < 3)
                  .map((area, indx) => {
                  return (
                  <span className={area.hit ? 'area hit' : 'area'} key={indx}>{ area.description }</span>
                  );
              })}

              {info.areas.length > 4
                ?  <span className='area'>+ <Pluralize singular="additional area" count={info.areas.length - 3} /></span>
                : ''}
            </div>
            </Card.Meta>
        </Card.Content>
      </Card>} basic closeIcon>
        <Modal.Header>Alert details</Modal.Header>
        <Modal.Content>
          <Alert info={info} />
        </Modal.Content>
      </Modal>
    )
  }
}

AlertsList.Item = AlertListItem;
export default AlertsList;
