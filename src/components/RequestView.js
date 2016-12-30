import React from 'react';
import { ListGroup, Pagination } from 'react-bootstrap';
import BookPreview from './BookPreview';
import ReactDOM, {findDOMNode} from 'react-dom';
//if(process.env.WEBPACK) require('./BookView.scss');


export default class RequestView extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.fitBooksToScreen = this.fitBooksToScreen.bind(this);
    this.handleResize = this.handleResize.bind(this);


    this.state = {
      activePage: 1,
      activeDataStart: 0,
      activeDataFinish: 6,
      loggedIn: {
        isLoggedIn: false,
        user: ""
      },
    }
  }

  componentDidMount() {
    this.handlePageSelect(this.state.activePage);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  fitBooksToScreen(activePage, data) {
    var that = this;
    let pageIndex = activePage * this.props.booksPerPage;
    let adjEventKey = Math.ceil((pageIndex / this.props.booksPerPage)) - 1;
    this.setState({
     activeDataStart: (adjEventKey * that.props.booksPerPage),
     activeDataFinish: (adjEventKey * that.props.booksPerPage) + that.props.booksPerPage
   });
  }

  handlePageSelect(eventKey) {
    this.setState({
     activePage: eventKey
    });
    this.fitBooksToScreen(eventKey, this.props.data);
  }

  handleResize() {
    this.handlePageSelect(1);
  }



  render() {
    let loggedIn = this.props.loggedIn;
    return (
      <div>
        <h3>My Requests</h3>
        <div className='col-xs-12'>
          {this.props.data.slice(this.state.activeDataStart, this.state.activeDataFinish).map(requestData =>
              <BookPreview
                key={requestData.offer_book._id}
                bookData={requestData.offer_book}
                loggedIn={loggedIn}
                requestData={requestData}
                xsCol={6}
                mdCol={2} /> , this) }
        </div>
        <Pagination
           className={this.props.data.length < this.props.booksPerPage? 'hidden':'shown'}
           prev
           next
           first
           last
           ellipsis
           items={Math.ceil(this.props.data.length / this.props.booksPerPage)}
           activePage={this.state.activePage}
           onSelect={this.handlePageSelect}>
        </Pagination>
      </div>
    );
  }
}
