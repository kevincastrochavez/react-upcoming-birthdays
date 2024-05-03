import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

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
import Navigation from './components/navigation/Navigation';

import Dashboard from './pages/dashboard/Dashboard';
import AllFriends from './pages/allFriends/AllFriends';
import FriendDetails from './pages/friendDetails/FriendDetails';
import ShareImport from './pages/shareImport/ShareImport';

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
const LoginPage = lazy(() =>
  componentLoader(() => import('./pages/login/Login'))
);

// TODOS FOR APP
// Move notifications from here to Dashboard page
// Add notifications for switching list visibility
// Change Sour to Salty
// Improve 3D object
// Improve space next friends related shadows
// Figure out color for links
// Fix breadcrumbs name for details page
// Fix breadcrumbs link color for All Friends
// Change picture id in firebase
// Make app responsive for desktop
// Implement onboarding

function App() {
  const { userUid } = useUserInfo();
  const { setIsFetchingFriends, setIsFetchingList } = useSetAddingFriends();
  const { setIsUserSharingList } = useSetUserInfo();
  const { setFriendsList } = useSetFriends();
  const { isFetchingFriends, isFetchingList } = useActionFriends();

  const globalCollection = 'friends';
  const personalCollection = userUid;
  const sharedListCollection = 'sharingList';

  const getSharedList = async () => {
    setIsFetchingList(true);
    const sharingRef = doc(db, `friends/${userUid}/sharingList`, 'sharingList');
    const sharingSnap = await getDoc(sharingRef);
    const sharingHasBeenCreated = sharingSnap.exists();
    if (sharingHasBeenCreated) {
      const { sharing } = sharingSnap.data();
      setIsUserSharingList(sharing);
      setIsFetchingList(false);
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
          setIsFetchingList(false);
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
    setIsFetchingFriends(true);
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
        setIsFetchingFriends(false);
      }
    );
  };

  useEffect(() => {
    if (userUid) {
      getSharedList();
      getFriendslist(userUid);
    }
  }, [userUid]);

  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Toaster />
        <AddFriend />

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
                <>
                  {isFetchingFriends ? <DashboardSkeleton /> : <Dashboard />}

                  <BottomNav />
                </>
              }
            />

            <Route
              path='/allFriends'
              element={
                <>
                  {isFetchingFriends ? <AllFriendsSkeleton /> : <AllFriends />}

                  <BottomNav />
                </>
              }
            />

            <Route
              path='/allFriends/:id'
              element={
                <>
                  {isFetchingFriends ? (
                    <FriendDetailsSkeleton />
                  ) : (
                    <FriendDetails />
                  )}

                  <BottomNav />
                </>
              }
            />

            <Route
              path='/shareImport'
              element={
                <>
                  {isFetchingList ? <ShareImportSkeleton /> : <ShareImport />}

                  <BottomNav />
                </>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
