import { type FC } from 'react';
import { Navigate, type PathRouteProps, type RouteProps } from 'react-router-dom';
import { getToken } from '../../state/locals';

const PrivateRoute: FC<RouteProps> = ({ children }) => {
  const token = getToken();
  if (!token || token.length <= 0) {
    return <Navigate to='/login' />;
  }

  return <>{children}</>;
};

export interface PrivatePageProps extends PathRouteProps {}

export const PrivatePage: FC<PrivatePageProps> = ({ children }) => {
  return <PrivateRoute>{children}</PrivateRoute>
};