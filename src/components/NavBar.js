import React from 'react';
import { Navbar, FormGroup, Button, FormControl } from 'react-bootstrap';
import { Link } from 'react-router';
if(process.env.WEBPACK) require('./NavBar.scss');

export default ({normalLogin, showRegister, register, logout, usernameChange, passwordChange, username, password, loggedIn}) => {
    return <NavBar
      handleLogin={normalLogin}
      handleRegister={register}
      showRegister={showRegister}
      handleLogout={logout}
      handleUsernameChange={usernameChange}
      handlePasswordChange={passwordChange}
      username={username}
      password={password}
      loggedIn={loggedIn} />;
}

class NavBar extends React.Component {
  render() {
    return (
        <Navbar className="mainNav" fixedTop>
            <Navbar.Header>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Navbar.Form  pullRight>
              { this.props.loggedIn.isLoggedIn ?
                <div>
                <FormGroup>
                  <FormControl.Static className="loggedInUser">{this.props.loggedIn.user} </FormControl.Static>
                </FormGroup>
                <Link to="/details"><Button className="navButton">Account</Button></Link>
                <Button className="navButton" onClick={this.props.handleLogout}>Logout</Button>
                </div>
                :
                <div>
                <FormGroup>
                  <FormControl type='text' onChange={this.props.handleUsernameChange} defaultValue={this.props.username} name="username" placeholder="Username"/>
                  <FormControl type="password" onChange={this.props.handlePasswordChange} defaultValue={this.props.password} name="password" placeholder="Password" />
                </FormGroup>
                <Button className="navButton" onClick={this.props.handleLogin}>Login</Button>
                <Button className="navButton" onClick={this.props.showRegister}>Register</Button>
                </div>
              }
              </Navbar.Form>
            </Navbar.Collapse>
          </Navbar>

    );
  }
}
