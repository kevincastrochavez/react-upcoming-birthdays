/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { Notification } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

import {
  useActionFriends,
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
const FriendDetailsPage = lazy(() =>
  componentLoader(() => import('./pages/friendDetails/FriendDetails'))
);

// TODOS FOR APP
// Delete image when friend is edited
// Friend details skeleton
// Add Notifications for errors in Adding, Editing and Deleting
// Make switch for sharing list work
// Check if QR code belongs to app
// Share functionality for the QR code
// Implement the import functionality, along with uploading of separate images
// When having the url/shareImport/id, load the import
// Improve 3D object
// Improve space next friends related shadows
// Figure out color for links
// Fix breadcrumbs name for details page
// Fix breadcrumbs link color for All Friends
// Change picture id in firebase

function App() {
  const { userUid } = useUserInfo();
  const { setFriendsList } = useSetFriends();
  const { friendWasAdded, friendWasDeleted, friendWasUpdated } =
    useActionFriends();
  const { setFriendWasAdded, setFriendWasDeleted, setFriendWasUpdated } =
    useSetAddingFriends();
  const checkIcon = <IconCheck />;

  const getFriendslist = (userUid) => {
    let friendsList = [];
    // Listening for realtime updates
    onSnapshot(collection(db, userUid), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          friendsList.push({ ...change.doc.data(), id: change.doc.id });
        }
        if (change.type === 'modified') {
          friendsList = friendsList.filter(
            (friend) => friend.id !== change.doc.id
          );
          friendsList.push({ ...change.doc.data(), id: change.doc.id });
        }
        if (change.type === 'removed') {
          friendsList = friendsList.filter(
            (friend) => friend.id !== change.doc.id
          );
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

  if (friendWasUpdated) {
    setTimeout(() => {
      setFriendWasUpdated(false);
    }, 3000);
  }

  if (friendWasDeleted) {
    setTimeout(() => {
      setFriendWasDeleted(false);
    }, 3000);
  }

  return (
    <>
      <BrowserRouter>
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

        {friendWasUpdated && (
          <Notification
            css={addedNotificationCss}
            icon={checkIcon}
            color='teal'
            title='Your friend was successfully updated'
            withBorder
            onClose={() => setFriendWasUpdated(false)}
          />
        )}
        {friendWasDeleted && (
          <Notification
            css={addedNotificationCss}
            icon={checkIcon}
            color='teal'
            title='Your friend was successfully deleted'
            withBorder
            onClose={() => setFriendWasDeleted(false)}
          />
        )}

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
              path='/allFriends/:id'
              element={
                <Suspense fallback={<h1>Loading...</h1>}>
                  <FriendDetailsPage />
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
