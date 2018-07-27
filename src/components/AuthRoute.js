import React, { Component } from 'react';
import { Redirect, Route } from 'react-router';
import requirePermissions from './PermissionsHOC';

const AuthRoute = ({ perms, redirectPath, component: WrappedComponent, ...rest }) => {
  const ComponentOrRedirect = requirePermissions(perms || [], WrappedComponent, Redirect);

  return(
    <Route
      {...rest}
      render={ props =>
        <ComponentOrRedirect
          {...props}
          to={{
            pathname: redirectPath,
            state: { from: props.location }
          }}
        />
      }
    />
  )
}

export default AuthRoute;
