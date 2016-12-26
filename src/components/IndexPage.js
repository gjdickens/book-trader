// src/components/IndexPage.js
import React from 'react';
import BookPreview from './BookPreview';
import EditModal from './EditModal';
import AddModal from './AddModal';
import BookView from './BookView';
import { ListGroup, Pagination } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
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
    this.setBooksPerPage = this.setBooksPerPage.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.state = {
      data: [],
      selectedBook: {},
      showEditModal: false,
      showAddModal: false,
      booksPerPage: 6
    }
  }

  componentDidMount() {
    var that = this;
    this.handleResize();
    window.addEventListener('resize', ::this.handleResize);

    socket.on('bookData', function(data) {
      that.setState({data: data });
    });
    socket.on('newBookData', function(data) {
      let newData = that.state.data.concat([data]);
      that.setState({data: newData });
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
    this.closeModal();that.fitBooksToScreen();
  }

  handleDeleteBook() {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    socket.emit('deleteBook', selectedBook);
    this.closeModal();
  }

  handleAddBook() {
    let selectedBook = JSON.parse(JSON.stringify(this.state.selectedBook));
    selectedBook.username = this.props.appState.loggedIn.user;
    this.addBook(selectedBook);
  }

  setBooksPerPage() {
    const elem = ReactDOM.findDOMNode(this);
    const w = elem.parentNode.offsetWidth;
    if(w > 992) { this.setState({booksPerPage: 6 }) }
    else { this.setState({booksPerPage: 2 }) }
  }

  handleResize() {
    this.setBooksPerPage();
  }





  render() {
    let loggedIn = this.props.appState.loggedIn;

    return (
      <div className="well text-center">
        {loggedIn.isLoggedIn ?
        <div>
            <BookView
              data={this.state.data.filter(function(arr) {
                return arr.username === loggedIn.user;
              })}
              loggedIn={loggedIn}
              showEditModal={this.showEditModal}
              title={'My Books'}
              booksPerPage={this.state.booksPerPage}
            />
            <div className='col-xs-12'>
              <button onClick={this.showAddModal}>Add Book</button>
            </div>
          </div>
          :
          <div></div>
          }
          {this.state.data.length > 0 ?
          <BookView
            data={this.state.data}
            loggedIn={loggedIn}
            showEditModal={this.showEditModal}
            title={'All Books'}
            booksPerPage={this.state.booksPerPage}
            />
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
