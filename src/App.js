import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TourProvider } from '@reactour/tour';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

import {
  useActionFriends,
  useLanguage,
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
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import { Analytics } from '@vercel/analytics/react';

import Dashboard from './pages/dashboard/Dashboard';
import AllFriends from './pages/allFriends/AllFriends';
import FriendDetails from './pages/friendDetails/FriendDetails';
import ShareImport from './pages/shareImport/ShareImport';
import Notifications from './components/notifications/Notifications';

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

// TODOS
// Add Confeti animation

function App() {
  const { userUid } = useUserInfo();
  const { setIsFetchingFriends, setIsFetchingList, setFetchingListFailed } =
    useSetAddingFriends();
  const { setIsUserSharingList } = useSetUserInfo();
  const { setFriendsList } = useSetFriends();
  const { isFetchingFriends, isFetchingList } = useActionFriends();
  const { languageSelectedObj } = useLanguage();
  const { i18n } = useTranslation();
  const redirect = useNavigate();
  const [tourStep, setTourStep] = useState(0);

  const globalCollection = 'friends';
  const personalCollection = userUid;
  const sharedListCollection = 'sharingList';

  const getSharedList = async () => {
    try {
      setIsFetchingList(true);
      const sharingRef = doc(
        db,
        `friends/${userUid}/sharingList`,
        'sharingList'
      );
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
      onSnapshot(
        collection(db, `friends/${userUid}/sharingList`),
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'modified') {
              const { sharing } = change.doc.data();
              setIsUserSharingList(sharing);
            }
          });
        }
      );
    } catch (error) {
      setFetchingListFailed(false);
    }
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

  useEffect(() => {
    i18n.changeLanguage(languageSelectedObj.value);
  }, [languageSelectedObj, i18n]);

  const steps = [
    {
      selector: 'body',
      content: t('tour.welcomeMessage'),
    },
    {
      selector: "[data-tour='spotlightFriend']",
      content: t('tour.spotlight'),
    },
    {
      selector: "[data-tour='nextFriends']",
      content: t('tour.nextFriends'),
    },
    {
      selector: "[data-tour='searchFriend']",
      content: t('tour.search'),
    },
    {
      selector: "[data-tour='allFriends']",
      content: t('tour.allFriends'),
    },
    {
      selector: "[data-tour='shareCode']",
      content: t('tour.qrCode'),
    },
    {
      selector: "[data-tour='addFriend']",
      content: t('tour.start'),
    },
  ];

  const setCurrentStep = (step) => {
    switch (step) {
      case 0:
      case 1:
      case 2:
      case 3:
        redirect('/', true);
        break;
      case 4:
        redirect('/allFriends', true);
        break;
      case 5:
        redirect('/shareImport', true);
        break;
      case 6:
        redirect('/', true);
        break;
      default:
        break;
    }
    setTourStep(step);
  };

  return (
    <>
      <TourProvider
        steps={steps}
        currentStep={tourStep}
        setCurrentStep={setCurrentStep}
      >
        <Analytics />
        <Navigation />
        <Toaster />
        <AddFriend />
        <Notifications />

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
                  {isFetchingFriends ? (
                    <DashboardSkeleton />
                  ) : (
                    <Dashboard setTourStep={setTourStep} />
                  )}

                  <BottomNav />
                </>
              }
            />

            <Route
              path='/allFriends'
              element={
                <>
                  {isFetchingFriends ? (
                    <AllFriendsSkeleton />
                  ) : (
                    <AllFriends setTourStep={setTourStep} />
                  )}

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
                  {isFetchingList ? (
                    <ShareImportSkeleton />
                  ) : (
                    <ShareImport setTourStep={setTourStep} />
                  )}

                  <BottomNav />
                </>
              }
            />
          </Route>
        </Routes>
      </TourProvider>
    </>
  );
}

export default App;
