import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

/**
* HOC that checks if user has permission to access WrappedComponent.
* Otherwhise FallbackComponent will be rendered.
* @param {Array} permissions array of arrays [string, boolean]. First element is
* the permission name, second specifies write permission. If no permissions are supplied,
* just cheks auth
* @param {Component} WrappedComponent
* @param {Component} FallbackComponent
*/
export default function requirePermissions(permissions = [], WrappedComponent, FallbackComponent) {
  class PermissionsHOC extends PureComponent {

    findMissingPermission(permissions) {
      const { perms } = this.props.user;
      if(!permissions.length) return false;
      const faulty = permissions.find(
        (p) => {

          if(!perms[p[0]])
            return true;
          if(p[1] && !perms[p[0]].read)
            return true;
          return false;
        }
      );
      return faulty;
    }
    render() {

      //if not logged in
      if(!this.props.user) {
        if(FallbackComponent)
          return <FallbackComponent {...this.props} />
        return
          <span></span>
      }
      //if missig permissions
      if(this.findMissingPermission(permissions)) {
        if(FallbackComponent)
          return <FallbackComponent {...this.props} />
        return
          <span></span>
      }
      return <WrappedComponent {...this.props}/>
    }
  }

  return connect(
    (state) => {
      return {
        user: state.auth.user
      }
    }
  )(PermissionsHOC)
}
