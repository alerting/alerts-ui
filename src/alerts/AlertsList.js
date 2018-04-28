import React, { Component } from 'react';

import { Card, Grid, Header, Label, List } from 'semantic-ui-react';

import nl2br from 'react-newline-to-break';
import Moment from 'react-moment';
import 'moment-timezone';
import URI from 'urijs';

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
      <div className="alert">
         <Card className="info" fluid>
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
               Issued by {info.web ? (<a href={info.web}>{info.sender_name}</a>) : info.sender_name}
               <br />
               <Moment format="lll">{info.effective || alert.sent}</Moment> to <Moment format="lll">{info.expires}</Moment>
                  
               <div className="areas">
                  {info.areas.map((a, i) => {
                     a.hit = (this.props.hit.area_hits || []).indexOf(i) !== -1;
                     return a;
                  })
                     .sort((a, b) => a.description >= b.description)
                     .map((area, indx) => {
                     return (
                     <span className={area.hit ? 'area hit' : 'area'} key={indx}>{ area.description }</span>
                     );
                  })}
               </div>
               </Card.Meta>
            </Card.Content>
            <Card.Content>
               <Card.Description>
                  { nl2br(info.description.trim()) }
               </Card.Description>
            </Card.Content>
            { info.instruction.length > 0 ? (
               <Card.Content>
                  <Card.Description className="instruction">
                     { nl2br(info.instruction.trim()) }
                  </Card.Description>
               </Card.Content>
            ) : ''}
            {(info.resources) ? (
               <Card.Content extra className="instruction">
               <List>
                  {info.resources.map(res => {
                     var resourceUri = res.digest
                     ? URI(res.digest.toLowerCase()).suffix(URI(res.uri).suffix().toLowerCase())
                        .absoluteTo(URI("https://www2.csclub.uwaterloo.ca/~ztseguin/alerts/resources/"))
                     : URI(URI(res.uri).filename().toLowerCase())
                        .absoluteTo(URI("https://www2.csclub.uwaterloo.ca/~ztseguin/alerts/resources/"));

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
      </div>
    )
  }
}

AlertsList.Item = AlertListItem;
export default AlertsList;
