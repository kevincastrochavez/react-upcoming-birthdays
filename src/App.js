import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BirthdayProvider from './components/BirthdayProvider';
import PrivateRoutes from './PrivateRoutes';

/**
 * This will retry failed chunks up to 5 times
 * @param {Function} lazyComponent - lazy component import function
 * @param {Number} attemptsLeft - number of attempts to make (defaults to 5)
 * @returns {Promise<any>} Promise that rejects if all additional attempts fail.
 */
function componentLoader(lazyComponent, attemptsLeft = 5) {
  return new Promise((resolve, reject) => {
    lazyComponent()
      .then(resolve)
      .catch((error) => {
        // let us retry after 100 ms
        setTimeout(() => {
          if (attemptsLeft === 1) {
            reject(error);
            return;
          }
          componentLoader(lazyComponent, attemptsLeft - 1).then(
            resolve,
            reject
          );
        }, 100);
      });
  });
}

// Lazy load imports
const Navigation = lazy(() =>
  componentLoader(() => import('./components/navigation/Navigation'))
);
const LoginPage = lazy(() =>
  componentLoader(() => import('./pages/login/Login'))
);
const DashboardPage = lazy(() =>
  componentLoader(() => import('./pages/dashboard/Dashboard'))
);

function App() {
  return (
    <BirthdayProvider>
      <Navigation />

      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />

          <Route element={<PrivateRoutes />}>
            <Route index path='/' element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BirthdayProvider>
  );
}

export default App;
