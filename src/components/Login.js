import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { loginWithToken } from '../actions/actions.auth';
import { bindActionCreators } from 'redux';
import { Redirect, withRouter } from 'react-router';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dispatchingLogin: false,
      tryingLogin: true
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('syn_token');
    if (token !== null) {
      if(this.props.location && this.props.location.query && this.props.location.query.redirect) {
        this.props.loginWithToken(token, this.props.location.query.redirect);
      } else {
        this.props.loginWithToken(token);
      }
      this.setState({dispatchingLogin: true});
    } else {
      this.setState({ tryingLogin: false})
    }

    // }else {
    //   this.props.logout();
    // }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.setState({ tryingLogin: false})
    }
  }

  getRedirectPath() {
    // if(!this.props.location.state) return '/';
    // const { from } = this.props.location.state;
    // return from && from.pathname ? from.pathname : '/';
    // const { location } = this.props;
    if(!location.search) return '/';
    let split = location.search.split('%2F');
    let path = '';
    split.shift();
    split.map((s) => path = `${path}/${s}`);
    return path;
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    console.log(from)
    console.log('try ', this.state.tryingLogin)
    console.log('authing ', this.props.isAuthenticated)
    console.log('auth ', this.props.isAuthenticated)
    if(this.state.tryingLogin)
      return <div></div>
    return (
      <div>
        { !this.state.tryingLogin && !this.props.isAuthenticated && !this.props.isAuthenticating ?
          <div>
            <h3>You have been successfully logged out!</h3>
            <p><a target="_self" href={`${window.location.origin}/loginpage`} >Login</a></p>
          </div>
          :
          <Redirect to={from} push/>
        }
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginWithToken: loginWithToken }, dispatch);
}

export default withRouter(
  connect(
    (state)=>({isAuthenticated: state.auth.isAuthenticated, isAuthenticating: state.auth.isAuthenticating}),
    mapDispatchToProps
  )(Login)
)
