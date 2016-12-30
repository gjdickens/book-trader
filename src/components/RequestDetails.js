// src/components/RequestDetails.js
import React from 'react';
import BookPreview from './BookPreview';
import Details from './Details';
import { ListGroup, Pagination, FormControl, Form, FormGroup, Col } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link, browserHistory } from 'react-router';
//if(process.env.WEBPACK) require('./BrowseBooks.scss');


export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.fetchDetails = this.fetchDetails.bind(this);
    this.prePopulateForm = this.prePopulateForm.bind(this);
    this.handleRequestBook = this.handleRequestBook.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleAcceptOffer = this.handleAcceptOffer.bind(this);
    this.handleRejectOffer = this.handleRejectOffer.bind(this);


    this.state = {
      selectedBook: {},
      selectedBookDetails: {
        first_name: "",
        last_name: "",
        city: "",
        state: "",
        country: ""
      },
      loggedIn: {
        isLoggedIn: false,
        user: ""
      },
      tradeBook: {},
    }
  }

  componentDidMount() {
    let requestId = this.props.params.requestId;
    let selectedRequest = this.props.app.state.requestData.filter(function(arr) {
      return arr._id === requestId;
    });
    let loggedIn = this.props.app.state.loggedIn;
    let selectedBook = selectedRequest[0].offer_book;
    let tradeBook = selectedRequest[0].requested_book;
    this.fetchDetails(selectedBook.username);
    this.setState({selectedBook: selectedBook, tradeBook: tradeBook});
  }


  fetchDetails(username) {
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: username
      }),
      headers: myHeaders
      };
    fetch('/getDetails', options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      that.prePopulateForm(json);
    });
  }

  prePopulateForm(bookDetails) {
    let newBookDetails = JSON.parse(JSON.stringify(this.state.selectedBookDetails));
    if(bookDetails.first_name) {newBookDetails.first_name = bookDetails.first_name};
    if(bookDetails.last_name) {newBookDetails.last_name = bookDetails.last_name};
    if(bookDetails.city) {newBookDetails.city = bookDetails.city};
    if(bookDetails.state) {newBookDetails.state = bookDetails.state};
    if(bookDetails.country) {newBookDetails.country = bookDetails.country};
    this.setState({selectedBookDetails: newBookDetails});
  }

  handleRequestBook() {
    let request = {
      offer_user: this.state.selectedBook.username,
      requested_user: this.state.tradeBook.username,
      offer_book: this.state.selectedBook,
      requested_book: this.state.tradeBook
    };
    this.props.app.requestBook(request);
    browserHistory.push('/');
  }

  handleCancelRequest() {
    this.props.app.cancelRequest(this.props.params.requestId);
    browserHistory.push('/');
  }

  handleAcceptOffer() {
    this.props.app.acceptOffer(this.props.params.requestId);
    browserHistory.push('/');
  }

  handleRejectOffer() {
    this.props.app.rejectOffer(this.props.params.requestId);
    browserHistory.push('/');
  }



  render() {
    return (
      <div className="well text-center">
      <div className='col-xs-12'>
        <h3>Pending Request</h3>
        <BookPreview
          key={this.state.selectedBook._id}
          bookData={this.state.selectedBook}
          loggedIn={this.state.loggedIn}
          xsCol={6}
          mdCol={6} />
          <Form horizontal className='col-xs-6'>
            <h3>{this.state.selectedBook.username}</h3>
            <FormGroup>
              <Col xs={4}>Name:</Col>
              <Col xs={8}>
                <FormControl.Static>{this.state.selectedBookDetails.first_name + ' ' + this.state.selectedBookDetails.last_name}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={4}>City:</Col>
              <Col xs={8}>
                <FormControl.Static>{this.state.selectedBookDetails.city}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={4}>State:</Col>
              <Col xs={8}>
                <FormControl.Static>{this.state.selectedBookDetails.state}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col xs={4}>Country:</Col>
              <Col xs={8}>
                <FormControl.Static>{this.state.selectedBookDetails.country}</FormControl.Static>
              </Col>
            </FormGroup>
          </Form>

        </div>
        <div className='col-xs-12'>
        <h3>Book Offered</h3>
        <Col xs={3}></Col>
          <BookPreview
            key={this.state.tradeBook._id}
            bookData={this.state.tradeBook}
            loggedIn={this.state.loggedIn}
            xsCol={6}
            mdCol={6} />
        <Col xs={3}></Col>
        </div>
      {this.props.location.pathname.split('/')[1] === "viewOffer" ?
      <p>
        <button onClick={this.handleAcceptOffer}>Accept Offer</button>
        <button onClick={this.handleRejectOffer}>Reject Offer</button>
      </p>
      :
      <p>
        <button onClick={this.handleCancelRequest}>Cancel Request</button>
      </p>
    }
        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
        <footer>
        </footer>
      </div>
    );
  }
}
