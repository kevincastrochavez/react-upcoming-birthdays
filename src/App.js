/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import {
  useActionFriends,
  useSetAddingFriends,
  useSetFriends,
  useSetUserInfo,
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
import FriendDetailsSkeleton from './pages/friendDetails/FriendDetailsSkeleton';

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
// When having the url/shareImport/id, load the import
// Keep private certain friends when adding and editing so that they are always private
// Make the share button work
// Improve 3D object
// Improve space next friends related shadows
// Figure out color for links
// Fix breadcrumbs name for details page
// Change Dashboard to Home
// Fix breadcrumbs link color for All Friends
// Change picture id in firebase
// Get rid of transparency in Searching

function App() {
  const { userUid } = useUserInfo();
  const { setIsUserSharingList } = useSetUserInfo();
  const { setFriendsList } = useSetFriends();
  const {
    friendWasAdded,
    friendWasDeleted,
    friendWasUpdated,
    addingFriendFailed,
    updatingFriendFailed,
    deletingFriendFailed,
    friendsWereImported,
    importingFriendsFailed,
  } = useActionFriends();
  const {
    setFriendWasAdded,
    setFriendWasDeleted,
    setFriendWasUpdated,
    setAddingFriendFailed,
    setUpdatingFriendFailed,
    setDeletingFriendFailed,
    setFriendsWereImported,
    setImportingFriendsFailed,
  } = useSetAddingFriends();
  const checkIcon = <IconCheck />;
  const closeIcon = <IconX />;

  const globalCollection = 'friends';
  const personalCollection = userUid;
  const sharedListCollection = 'sharingList';

  const getSharedList = async () => {
    const sharingRef = doc(db, `friends/${userUid}/sharingList`, 'sharingList');
    const sharingSnap = await getDoc(sharingRef);
    const sharingHasBeenCreated = sharingSnap.exists();
    if (sharingHasBeenCreated) {
      const { sharing } = sharingSnap.data();
      setIsUserSharingList(sharing);
    }

    // For new users create a sharing list and set it to true
    if (!sharingHasBeenCreated) {
      setDoc(
        doc(
          db,
          globalCollection,
          personalCollection,
          sharedListCollection,
          'sharingList'
        ),
        {
          sharing: true,
        }
      )
        .then(() => {
          console.log('Sharing list created');
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Watch for changes to the sharing list and update the state
    onSnapshot(collection(db, `friends/${userUid}/sharingList`), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const { sharing } = change.doc.data();
          setIsUserSharingList(sharing);
        }
      });
    });
  };

  const getFriendslist = () => {
    let friendsList = [];
    // Listening for realtime updates
    onSnapshot(
      collection(db, `friends/${userUid}/personalFriends`),
      (snapshot) => {
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
      }
    );
  };

  useEffect(() => {
    if (userUid) {
      getSharedList();
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

  if (addingFriendFailed) {
    setTimeout(() => {
      setAddingFriendFailed(false);
    }, 3000);
  }

  if (updatingFriendFailed) {
    setTimeout(() => {
      setUpdatingFriendFailed(false);
    }, 3000);
  }

  if (deletingFriendFailed) {
    setTimeout(() => {
      setDeletingFriendFailed(false);
    }, 3000);
  }

  if (friendsWereImported) {
    setTimeout(() => {
      setFriendsWereImported(false);
    }, 3000);
  }

  if (importingFriendsFailed) {
    setTimeout(() => {
      setImportingFriendsFailed(false);
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

        {friendsWereImported && (
          <Notification
            css={addedNotificationCss}
            icon={checkIcon}
            color='teal'
            title='Your friends were successfully imported'
            withBorder
            onClose={() => setFriendsWereImported(false)}
          />
        )}

        {addingFriendFailed && (
          <Notification
            css={addedNotificationCss}
            icon={closeIcon}
            color='red'
            title='Something went wrong while adding your friend. Please try again later.'
            withBorder
            onClose={() => setAddingFriendFailed(false)}
          />
        )}

        {updatingFriendFailed && (
          <Notification
            css={addedNotificationCss}
            icon={closeIcon}
            color='red'
            title='Something went wrong while updating your friend. Please try again later.'
            withBorder
            onClose={() => setUpdatingFriendFailed(false)}
          />
        )}

        {deletingFriendFailed && (
          <Notification
            css={addedNotificationCss}
            icon={closeIcon}
            color='red'
            title='Something went wrong while deleting your friend. Please try again later.'
            withBorder
            onClose={() => setDeletingFriendFailed(false)}
          />
        )}

        {importingFriendsFailed && (
          <Notification
            css={addedNotificationCss}
            icon={closeIcon}
            color='red'
            title='Something went wrong while importing your friends. Please try again later.'
            withBorder
            onClose={() => setImportingFriendsFailed(false)}
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
                <Suspense fallback={<FriendDetailsSkeleton />}>
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
