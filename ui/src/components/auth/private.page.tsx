import { type FC } from 'react';
import { Navigate, type PathRouteProps, type RouteProps } from 'react-router-dom';
import { getToken } from '../../state/locals';

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const token = getToken();
  if (!token || token.length <= 0) {
    return <Navigate to='/' />;
  }

  return <>{children}</>;
};

export const PrivatePage: FC<PathRouteProps> = ({ children }) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};