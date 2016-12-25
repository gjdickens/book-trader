// src/components/IndexPage.js
import React from 'react';
import BookPreview from './BookPreview';
import EditModal from './EditModal';
import AddModal from './AddModal';
import { ListGroup, Pagination } from 'react-bootstrap';
import io from 'socket.io-client';
if(process.env.WEBPACK) require('./IndexPage.scss');

//const socket = io.connect('https://gj-stock-tracker.herokuapp.com/');
const socket = io.connect('localhost:3000');



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
      data: [],
      selectedBook: {},
      showEditModal: false,
      showAddModal: false
    }
  }

  componentDidMount() {
    var that = this;
    socket.on('bookData', function(data) {
      that.setState({data: data});
    });
    socket.on('newBookData', function(data) {
      let currentData = that.state.data;
      that.setState({data: currentData.concat([data])});
      });
    socket.on('deleteBookData', function(data) {
      that.setState({
        data: that.state.data.filter(function(selected) { return selected._id !== data._id })
      });
    });
    socket.on('editBookData', function(data) {
      that.setState({
        data: that.state.data.map(function(selected) {
          if(selected._id === data._id) {
            selected = data;
          }
          return selected;
        })
      });
      });
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
    this.addBook(selectedBook);
  }




  render() {
    return (
      <div className="well">
          {this.state.data.map(bookData =>
            <BookPreview
              key={bookData._id}
              bookData={bookData}
              loggedIn={this.props.appState.loggedIn}
              handleBookClick={this.showEditModal} />, this)}
              {this.props.appState.loggedIn.isLoggedIn ?
            <button onClick={this.showAddModal}>Add Book</button>
            :
            <div></div>
          }
        <footer>
          <AddModal
            showAddModal={this.state.showAddModal}
            closeModal={this.closeModal}
            selectedBook={this.state.selectedBook}
            loggedIn={this.props.appState.loggedIn}
            handleAuthorChange={this.handleAuthorChange}
            handleTitleChange={this.handleTitleChange}
            handleLinkChange={this.handleLinkChange}
            handleAddBook={this.handleAddBook} />
          <EditModal
            showEditModal={this.state.showEditModal}
            closeModal={this.closeModal}
            selectedBook={this.state.selectedBook}
            loggedIn={this.props.appState.loggedIn}
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