// src/components/IndexPage.js
import React from 'react';
import BookPreview from './BookPreview';
import EditModal from './EditModal';
import AddModal from './AddModal';
import BookView from './BookView';
import RequestView from './RequestView';
import { ListGroup, Pagination, Jumbotron, Button } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link } from 'react-router';
import io from 'socket.io-client';
if(process.env.WEBPACK) require('./IndexPage.scss');

const socket = io.connect('https://gj-book-trader.herokuapp.com/');
//const socket = io.connect('localhost:3000');


export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.showAddModal = this.showAddModal.bind(this);
    this.addBook = this.addBook.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleEditBook = this.handleEditBook.bind(this);
    this.handleDeleteBook = this.handleDeleteBook.bind(this);
    this.handleAddBook = this.handleAddBook.bind(this);

    this.state = {
      selectedBook: {},
      showEditModal: false,
      showAddModal: false
    }
  }


  closeModal() {
    this.setState({showEditModal: false, showAddModal: false, selectedBook: {} });
  }

  showEditModal(book) {
    this.setState({showEditModal: true, selectedBook: book});
  }

  showAddModal() {
    this.setState({showAddModal: true});
  }

  addBook(newBook) {
    this.closeModal();
    socket.emit('newBook', newBook);
  }

  handleTitleChange(e) {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    selectedBook.title = e.target.value;
    this.setState({selectedBook: selectedBook});
  }

  handleAuthorChange(e) {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    selectedBook.author = e.target.value;
    this.setState({selectedBook: selectedBook});
  }

  handleLinkChange(e) {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    selectedBook.image_url = e.target.value;
    this.setState({selectedBook: selectedBook});
  }


  handleEditBook() {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    socket.emit('editBook', selectedBook);
    this.closeModal();
  }

  handleDeleteBook() {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    socket.emit('deleteBook', selectedBook);
    this.closeModal();
  }

  handleAddBook() {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    selectedBook.username = this.props.app.state.loggedIn.user;
    this.addBook(selectedBook);
  }






  render() {
    let loggedIn = this.props.app.state.loggedIn;
    let data = this.props.app.state.data;
    let requestData = this.props.app.state.requestData;
    let booksPerPage = this.props.app.state.booksPerPage;


    return (
      <div className="well text-center">
        {loggedIn.isLoggedIn ?
        <div>
          {requestData.length > 0 ?
            <RequestView
              data={requestData}
              loggedIn={loggedIn}
              booksPerPage={booksPerPage}
              xsCol={6}
              mdCol={2}
            />
            :
            <div></div>
          }
            <BookView
              data={data.filter(function(arr) {
                return arr.username === loggedIn.user;
              })}
              loggedIn={loggedIn}
              showEditModal={this.showEditModal}
              title={'My Books'}
              booksPerPage={booksPerPage}
              xsCol={6}
              mdCol={2}
            />
            <div className='col-xs-12'>
              <button onClick={this.showAddModal}>Add Book</button>
            </div>
          </div>
          :
          <div>
            <Jumbotron className="jumbo">
              <h1>Book Trader</h1>
              <p>Register to start trading books</p>
              <p><Button bsStyle="primary" onClick={this.props.app.showRegister}>Register</Button></p>
            </Jumbotron>
          </div>
          }
          {data.length > 0 ?
          <div>
            <BookView
              data={data}
              loggedIn={loggedIn}
              showEditModal={this.showEditModal}
              title={'All Books'}
              booksPerPage={booksPerPage}
              xsCol={6}
              mdCol={2}
              />
              <div className='col-xs-12'>
                <Link to="/browse"><Button>Browse All Books</Button></Link>
              </div>
            </div>
            :
            <div></div>
          }

        <footer>
          <AddModal
            showAddModal={this.state.showAddModal}
            closeModal={this.closeModal}
            selectedBook={this.state.selectedBook}
            loggedIn={loggedIn}
            handleAuthorChange={this.handleAuthorChange}
            handleTitleChange={this.handleTitleChange}
            handleLinkChange={this.handleLinkChange}
            handleAddBook={this.handleAddBook} />
          <EditModal
            showEditModal={this.state.showEditModal}
            closeModal={this.closeModal}
            selectedBook={this.state.selectedBook}
            loggedIn={loggedIn}
            handleAuthorChange={this.handleAuthorChange}
            handleTitleChange={this.handleTitleChange}
            handleLinkChange={this.handleLinkChange}
            handleEditBook={this.handleEditBook}
            handleDeleteBook={this.handleDeleteBook} />
        </footer>
      </div>
    );
  }
}
