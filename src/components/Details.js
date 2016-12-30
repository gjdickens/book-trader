// src/components/Details.js
import React from 'react';
import { Link, browserHistory } from 'react-router';
import { ListGroup, Form, FormGroup, FormControl, Col, Button } from 'react-bootstrap';

export default class Details extends React.Component {
  constructor(props) {
    super(props);

    this.cancel = this.cancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.prePopulateForm = this.prePopulateForm.bind(this);

    this.state = {
      formDetails: {
        first_name: "",
        last_name: "",
        city: "",
        state: "",
        country: ""
      }
  }
}

  componentWillMount() {
    this.prePopulateForm();
  }

  prePopulateForm() {
    let formDetails = JSON.parse(JSON.stringify(this.props.app.state.details));
    let newFormDetails = JSON.parse(JSON.stringify(this.state.formDetails));
    if(formDetails.first_name) {newFormDetails.first_name = formDetails.first_name};
    if(formDetails.last_name) {newFormDetails.last_name = formDetails.last_name};
    if(formDetails.city) {newFormDetails.city = formDetails.city};
    if(formDetails.state) {newFormDetails.state = formDetails.state};
    if(formDetails.country) {newFormDetails.country = formDetails.country};
    this.setState({formDetails: newFormDetails});
  }



  cancel() {
    browserHistory.push('/');
  }

  handleChange(e) {
    let details = JSON.parse(JSON.stringify(this.state.formDetails));
    details[e.target.id] = e.target.value;
    this.setState({formDetails: details});
  }

  render() {
    let loggedIn = this.props.app.state.loggedIn;
    let app = this.props.app;

    return (
      <div className="well text-center">
        <h1>{loggedIn.user}</h1>
        <h3>Update Details</h3>
        <Form horizontal>
          <FormGroup>
            <Col sm={2}>First Name</Col>
            <Col sm={10}>
              <FormControl type="text" onChange={this.handleChange} id='first_name' defaultValue={this.state.formDetails.first_name} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}>Last Name</Col>
            <Col sm={10}>
              <FormControl type="text" onChange={this.handleChange} id='last_name' defaultValue={this.state.formDetails.last_name} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}>City</Col>
            <Col sm={10}>
              <FormControl type="text" onChange={this.handleChange} id='city' defaultValue={this.state.formDetails.city} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}>State</Col>
            <Col sm={10}>
              <FormControl type="text" onChange={this.handleChange} id='state' defaultValue={this.state.formDetails.state} />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2}>Country</Col>
            <Col sm={10}>
              <FormControl type="text" onChange={this.handleChange} id='country' defaultValue={this.state.formDetails.country} />
            </Col>
          </FormGroup>


          <FormGroup>
            <Col sm={12}>
              <Button onClick={app.handleDetailsSubmit.bind(null, this.state.formDetails)}>Update</Button>
              <Button onClick={this.cancel}>Cancel</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}
