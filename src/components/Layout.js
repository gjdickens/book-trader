// src/components/Layout.js
import React from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import { Link, browserHistory } from 'react-router';
import NavBar from './NavBar';
import RegisterModal from './RegisterModal';
import io from 'socket.io-client';
if(process.env.WEBPACK) require('./Layout.scss');

const socket = io.connect('https://gj-book-trader.herokuapp.com/');
//const socket = io.connect('localhost:3000');

export default class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.usernameChange = this.usernameChange.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.showRegister = this.showRegister.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.modalUsernameChange = this.modalUsernameChange.bind(this);
    this.modalPasswordChange = this.modalPasswordChange.bind(this);
    this.normalLogin= this.normalLogin.bind(this);
    this.setBooksPerPage = this.setBooksPerPage.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleDetailsSubmit = this.handleDetailsSubmit.bind(this);
    this.updateDetails = this.updateDetails.bind(this);
    this.requestBook = this.requestBook.bind(this);
    this.filterRequests = this.filterRequests.bind(this);
    this.cancelRequest = this.cancelRequest.bind(this);
    this.acceptOffer = this.acceptOffer.bind(this);
    this.rejectOffer = this.rejectOffer.bind(this);

    this.state = {
      username: "",
      password: "",
      showRegisterModal: false,
      loggedIn: {
        isLoggedIn: false,
        user: ""
      },
      modalInput: {
        username: "",
        password: ""
      },
      data: [],
      requestData: [],
      allRequestData: [],
      booksPerPage: 6,
      details: {
        first_name: "",
        last_name: "",
        city: "",
        state: "",
        country: "",
        postcode: ""
      }
    }
  }

  componentDidMount() {
    var that = this;
    window.addEventListener('resize', this.handleResize);

    socket.on('bookData', function(data) {
      that.setState({data: data });
    });
    socket.on('requestData', function(data) {
      let pendingData = data.filter(function(arr) {
        return arr.status === "Pending";
      })
      that.setState({allRequestData: pendingData });
    });
    socket.on('newBookData', function(data) {
        let newData = that.state.data.concat([data]);
        that.setState({data: newData });
    });
    socket.on('newRequestData', function(data) {
      if (data.status === "Pending") {
        let newData = that.state.allRequestData.concat([data]);
        if (that.state.loggedIn.isLoggedIn) {
          that.setState({requestData: that.filterRequests(newData, that.state.loggedIn.user), allRequestData: newData });
        }
        else {
          that.setState({allRequestData: newData});
        }
      }

    });
    socket.on('deleteBookData', function(data) {
      that.setState({
        data: that.state.data.filter(function(selected) { return selected._id !== data._id })
      });
    });
    socket.on('deleteRequestData', function(data) {
      that.setState({
        requestData: that.state.requestData.filter(function(selected) { return selected._id !== data })
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
    socket.on('editRequestData', function(data) {
      let newData = that.state.allRequestData.map(function(selected) {
          if(selected._id === data._id) {
            selected = data;
          }
          return selected;
      });
      let filteredData = newData.filter(function(arr) {
        return arr.status === "Pending";
      });
      if (that.state.loggedIn.isLoggedIn) {
        that.setState({requestData: that.filterRequests(filteredData, that.state.loggedIn.user), allRequestData: filteredData});
      }
      else {
        that.setState({allRequestData: filteredData});
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
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
      that.setState({details: json});
    });
  }

  updateDetails(username, details) {
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: username,
        first_name: details.first_name,
        last_name: details.last_name,
        city: details.city,
        state: details.state,
        country: details.country
      }),
      headers: myHeaders
      };
    fetch('/updateDetails', options)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      that.setState({details: json});
    });
  }


  handleResize() {
    this.setBooksPerPage();
  }

  setBooksPerPage() {
    const elem = ReactDOM.findDOMNode(this);
    const w = elem.parentNode.offsetWidth;
    if(w > 992) { this.setState({booksPerPage: 6 }) }
    else { this.setState({booksPerPage: 2 }) }
  }

  login(username, password){
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: myHeaders
      };
    fetch('/login', options)
    .then(function(response) {
      if (response.status === 200) {
        that.setState({requestData: that.filterRequests(that.state.allRequestData, username), "loggedIn": {"user": username, "isLoggedIn": true }, "username": "", "password": "" });
        that.fetchDetails(username);
      }

    });
  }

  normalLogin() {
    this.login(this.state.username, this.state.password);
  }

  register(){
    var that = this;
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    var options = {
      method: 'post',
      body: JSON.stringify({
        username: this.state.modalInput.username,
        password: this.state.modalInput.password
      }),
      headers: myHeaders
      };
    fetch('/register', options)
    .then(function(response) {
      if (response.status === 200) {
        that.login(that.state.modalInput.username, that.state.modalInput.password);
        that.closeModal();
      }
    });
    }


  closeModal() {
    this.setState({"showRegisterModal": false});
  }


  usernameChange(e) {
    this.setState({"username": e.target.value});
  }

  passwordChange(e) {
    this.setState({"password": e.target.value});
  }

  showRegister() {
    this.setState({"showRegisterModal": true});
  }

  logout() {
    var that = this;
    fetch('/logout')
      .then(function(response) {
        that.setState({"loggedIn": {"user": "", "isLoggedIn": false }, "username": "", "password": "" });
        browserHistory.push('/');
      })
  }

  modalUsernameChange(e) {
    this.setState({"modalInput": {"username": e.target.value, "password": this.state.modalInput.password}});
  }

  modalPasswordChange(e) {
    this.setState({"modalInput": {"username": this.state.modalInput.username, "password": e.target.value }});
  }

  handleDetailsSubmit(formDetails) {
    this.updateDetails(this.state.loggedIn.user, formDetails);
    browserHistory.push('/');
  }

  requestBook(request) {
    socket.emit('newRequest', request);
  }

  cancelRequest(request) {
    socket.emit('deleteRequest', request);
  }

  acceptOffer(request) {
    socket.emit('acceptRequest', request);
  }

  rejectOffer(request) {
    socket.emit('rejectRequest', request);
  }

  filterRequests(data, username) {
    var that = this;
    let myRequestData = [];
    data.map(function(arr, i) {
      if (arr.offer_user === username) {
        arr.type = "Offer";
        myRequestData.push(arr);
      }
      else if (arr.requested_user === username) {
        arr.type = "Request";
        myRequestData.push(arr);
      }
    });
    return myRequestData;
  }

  render() {
    return (
      <div className="app-container">
        <header>
          <NavBar
            normalLogin={this.normalLogin}
            register={this.register}
            showRegister={this.showRegister}
            logout={this.logout}
            usernameChange={this.usernameChange}
            passwordChange={this.passwordChange}
            username={this.state.username}
            password={this.state.password}
            loggedIn={this.state.loggedIn} />
        </header>
        <div className="app-content">{React.cloneElement(this.props.children, { app: this })}</div>
        <footer>
          <RegisterModal
            showModal={this.state.showRegisterModal}
            closeModal={this.closeModal}
            modalUsernameChange={this.modalUsernameChange}
            modalPasswordChange={this.modalPasswordChange}
            register={this.register} />
        </footer>
      </div>
    );
  }
}
