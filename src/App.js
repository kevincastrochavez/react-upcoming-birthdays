import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

import { useSetFriends, useUserInfo } from './components/BirthdayProvider';
import BottomNav from './components/bottomNav/BottomNav';
import AddFriend from './components/addFriend/AddFriend';
import PrivateRoutes from './helper/PrivateRoutes';
import { Toaster } from './componentsShadcn/ui/toaster';
import { db } from './firebase';
import LoginSkeleton from './pages/login/LoginSkeleton';
import DashboardSkeleton from './pages/dashboard/DashboardSkeleton';

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
const AllFriendsPage = lazy(() =>
  componentLoader(() => import('./pages/allFriends/AllFriends'))
);
const ShareImportPage = lazy(() =>
  componentLoader(() => import('./pages/shareImport/ShareImport'))
);

function App() {
  // const { userUid } = useUserInfo();
  // const { setFriendsList } = useSetFriends();

  // const getFriendslist = async (userUid) => {
  //   const friendsList = [];
  //   const querySnapshot = await getDocs(collection(db, userUid));
  //   querySnapshot.forEach((doc) => {
  //     friendsList.push(doc.data());
  //   });
  //   setFriendsList(friendsList);
  // };

  // if (userUid) {
  //   getFriendslist(userUid);
  // }

  return (
    <>
      <Navigation />
      <Toaster />
      <AddFriend />

      <BrowserRouter>
        <Routes>
          <Route
            path='/login'
            element={
              <Suspense fallback={<LoginSkeleton />}>
                <LoginPage />
              </Suspense>
            }
          />

          {/* <Route element={<PrivateRoutes />}> */}
          <Route
            index
            path='/'
            element={
              <Suspense fallback={<DashboardSkeleton />}>
                {/* <DashboardPage /> */}
                <DashboardSkeleton />
                <BottomNav />
              </Suspense>
            }
          />

          <Route
            path='/allFriends'
            element={
              <Suspense fallback={<div>Loading All Friends...</div>}>
                <AllFriendsPage />
                <BottomNav />
              </Suspense>
            }
          />

          <Route
            path='/shareImport'
            element={
              <Suspense fallback={<div>Loading Share...</div>}>
                <ShareImportPage />
                <BottomNav />
              </Suspense>
            }
          />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
