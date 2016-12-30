// src/components/BrowseBooks.js
import React from 'react';
import BookPreview from './BookPreview';
import { ListGroup, Pagination } from 'react-bootstrap';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link } from 'react-router';
//if(process.env.WEBPACK) require('./BrowseBooks.scss');


export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.showEditModal = this.showEditModal.bind(this);

    this.state = {
    }
  }

  showEditModal(e) {
    console.log(e);
  }


  render() {
    let data = this.props.app.state.data;
    let loggedIn = this.props.app.state.loggedIn;

    return (
      <div className="well text-center">
        <h3>Browse All Books</h3>
        <div className='col-xs-12'>
          {data.map(bookData =>
            <BookPreview
              key={bookData._id}
              bookData={bookData}
              loggedIn={loggedIn}
              xsCol={6}
              mdCol={2}
              handleBookClick={this.showEditModal} />, this) }
        </div>
        <p>
          <Link to="/">Go back to the main page</Link>
        </p>
        <footer>
        </footer>
      </div>
    );
  }
}
