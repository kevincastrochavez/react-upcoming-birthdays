import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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

// IMPORTS
const Navigation = lazy(() =>
  componentLoader(() => import('./components/navigation/Navigation'))
);
const LoginPage = lazy(() =>
  componentLoader(() => import('./pages/login/Login'))
);

function App() {
  return (
    <>
      <Navigation />

      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />} />
          {/* <Route path='about' element={<About />} /> */}

          {/* Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for. */}
          {/* <Route path="*" element={<NoMatch />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
