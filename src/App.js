/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { Notification } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import {
  useAddingFriends,
  useSetAddingFriends,
  useSetFriends,
  useUserInfo,
} from './components/BirthdayProvider';
import BottomNav from './components/bottomNav/BottomNav';
import AddFriend from './components/addFriend/AddFriend';
import PrivateRoutes from './helper/PrivateRoutes';
import { Toaster } from './componentsShadcn/ui/toaster';
import { db } from './firebase';
import LoginSkeleton from './pages/login/LoginSkeleton';
import DashboardSkeleton from './pages/dashboard/DashboardSkeleton';
import AllFriendsSkeleton from './pages/allFriends/AllFriendsSkeleton';
import ShareImportSkeleton from './pages/shareImport/ShareImportSkeleton';

const addedNotificationCss = css`
  position: fixed;
  bottom: 90px;
  left: 24px;
  right: 24px;
  z-index: 10;
`;

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

// TODOS FOR APP
// Link for Spotlight to go to details page
// Link for logo to go to Homepage
// Figure out color for links
// Share functionality for the QR code
// When having the url/shareImport/id, load the import
// Check if QR code belongs to app
// Implement the import functionality, along with uploading of separate images
// Friends details page, with Edit and Delete buttons and forms, and notifications
// Improve 3D object

function App() {
  const { userUid } = useUserInfo();
  const { setFriendsList } = useSetFriends();
  const { friendWasAdded } = useAddingFriends();
  const { setFriendWasAdded } = useSetAddingFriends();
  const checkIcon = <IconCheck />;

  const getFriendslist = (userUid) => {
    const friendsList = [];
    // Listening for realtime updates
    onSnapshot(collection(db, userUid), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          friendsList.push(change.doc.data());
        }
      });

      setFriendsList(friendsList);
    });
  };

  useEffect(() => {
    if (userUid) {
      getFriendslist(userUid);
    }
  }, [userUid]);

  if (friendWasAdded) {
    setTimeout(() => {
      setFriendWasAdded(false);
    }, 3000);
  }

  return (
    <>
      <Navigation />
      <Toaster />
      <AddFriend />
      {friendWasAdded && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your friend was successfully added'
          withBorder
          onClose={() => setFriendWasAdded(false)}
        />
      )}

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

          <Route element={<PrivateRoutes />}>
            <Route
              index
              path='/'
              element={
                <Suspense fallback={<DashboardSkeleton />}>
                  <DashboardPage />
                  <BottomNav />
                </Suspense>
              }
            />

            <Route
              path='/allFriends'
              element={
                <Suspense fallback={<AllFriendsSkeleton />}>
                  <AllFriendsPage />
                  <BottomNav />
                </Suspense>
              }
            />

            <Route
              path='/shareImport'
              element={
                <Suspense fallback={<ShareImportSkeleton />}>
                  <ShareImportPage />
                  <BottomNav />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
