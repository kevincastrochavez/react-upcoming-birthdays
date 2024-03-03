import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useUserUid } from '../components/BirthdayProvider';

/**
 * Protects routes from unauthorized users, and redirects to login page if user is not logged in
 * @returns {JSX.Element}
 */
const PrivateRoutes = () => {
  const { userUid } = useUserUid();
  const location = useLocation();
  const auth = { token: !!userUid };

  return auth.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace={true} />
  );
};

export default PrivateRoutes;
