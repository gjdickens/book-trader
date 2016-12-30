// src/components/BookRequest.js
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

    this.selectBook = this.selectBook.bind(this);
    this.fetchDetails = this.fetchDetails.bind(this);
    this.prePopulateForm = this.prePopulateForm.bind(this);
    this.handleRequestBook = this.handleRequestBook.bind(this);


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
      myBooks: [],
      tradeBook: {},
    }
  }

  componentDidMount() {
    let selectedBookId = this.props.params.bookId;
    let loggedIn = this.props.app.state.loggedIn;
    let selectedBook = this.props.app.state.data.filter(function(arr) {
      return arr._id === selectedBookId;
    });
    this.fetchDetails(selectedBook[0].username);
    let myBooks = this.props.app.state.data.filter(function(arr) {
      return arr.username === loggedIn.user;
    });
    this.setState({selectedBook: selectedBook[0], myBooks: myBooks});
  }

  selectBook(e) {
    let tradeBook = this.props.app.state.data.filter(function(arr) {
      return arr._id === e.target.value;
    })
    this.setState({tradeBook: tradeBook[0]});
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
    console.log(newBookDetails);
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



  render() {
    return (
      <div className="well text-center">
      <div className='col-xs-12'>
        <h3>Request Book</h3>
        <BookPreview
          key={this.state.selectedBook._id}
          bookData={this.state.selectedBook}
          loggedIn={this.state.loggedIn}
          xsCol={6}
          mdCol={6} />
          <Form horizontal className='col-xs-6'>
            <h3>{this.state.selectedBook.username}</h3>
            <FormGroup>
              <Col sm={4}>Name:</Col>
              <Col sm={8}>
                <FormControl.Static>{this.state.selectedBookDetails.first_name + ' ' + this.state.selectedBookDetails.last_name}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={4}>City:</Col>
              <Col sm={8}>
                <FormControl.Static>{this.state.selectedBookDetails.city}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={4}>State:</Col>
              <Col sm={8}>
                <FormControl.Static>{this.state.selectedBookDetails.state}</FormControl.Static>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={4}>Country:</Col>
              <Col sm={8}>
                <FormControl.Static>{this.state.selectedBookDetails.country}</FormControl.Static>
              </Col>
            </FormGroup>
          </Form>

        </div>
        <div className='col-xs-12'>
        <h3>Offer Book</h3>
          <Form horizontal className='col-xs-6'>
            <h4>Select Book to Offer</h4>
            <FormControl
              componentClass="select"
              onChange={this.selectBook}
              placeholder="select" >
              <option value="select">Books Available to Offer</option>
              {this.state.myBooks.map(bookData =>
                <option
                  value={bookData._id}
                  key={bookData._id}

                  >{bookData.title + ' - ' + bookData.author}</option>
              )}
            </FormControl>
          </Form>
            <BookPreview
              key={this.state.tradeBook._id}
              bookData={this.state.tradeBook}
              loggedIn={this.state.loggedIn}
              xsCol={6}
              mdCol={6} />
        </div>
        <p>
          <button onClick={this.handleRequestBook}>Request Trade</button>
        </p>
        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
        <footer>
        </footer>
      </div>
    );
  }
}
