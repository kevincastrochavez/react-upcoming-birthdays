import React, { createContext, useContext, useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';

import { getUserUid } from '../helper/utils';

const BirthdayContext = createContext({});
const BirthdayUpdateContext = createContext({});

/**
 *  Provides whole application with information about the user
 * @param {[React.ReactNode]|React.ReactNode} children - React children
 * @returns {JSX.Element}
 */
export default function BirthdayProvider({ children }) {
  const existentUserUid = getUserUid('userUid');
  const [userUid, setUserUid] = useState(existentUserUid);
  const [isSearching, setIsSearching] = useState(false);
  const [isIdSearching, setIsIdSearching] = useState(false);
  const [searchText, setSearchText] = useDebouncedState('', 300);
  const [searchIdText, setSearchIdText] = useState('');
  const [isUserSharingList, setIsUserSharingList] = useState(true);
  const [friendsList, setFriendsList] = useState([]);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isEditingFriend, setIsEditingFriend] = useState(false);
  const [friendWasAdded, setFriendWasAdded] = useState(false);
  const [friendWasDeleted, setFriendWasDeleted] = useState(false);

  // Format birth date and attach it to each friend, in the long format and shortened format
  const birthdatesList = friendsList?.map((friend) => friend?.birthdate);
  const birthdatesListConverted = birthdatesList?.map((birthdate) =>
    formatBirthdate(birthdate)
  );
  const shortenedBirthdatesListConverted = birthdatesList?.map((birthdate) =>
    getShortenedBirthdate(birthdate)
  );

  birthdatesListConverted?.map(
    (birthdate, index) => (friendsList[index].birthdateFormatted = birthdate)
  );
  shortenedBirthdatesListConverted?.map(
    (birthdate, index) =>
      (friendsList[index].shortenedBirthdateFormatted = birthdate)
  );

  // Format full name and attach it to each friend, along with first name
  const fullNamesList = friendsList?.map((friend) => friend?.fullName);
  const fullNamesListConverted = fullNamesList?.map((fullName) =>
    formatFullName(fullName)
  );
  fullNamesListConverted?.map(({ firstName, formattedFullName }, index) => {
    friendsList[index].firstName = firstName;
    friendsList[index].formattedFullName = formattedFullName;
  });

  // TODO: Check if this is needed
  // Search logic for friends
  const friendsFilteredBySearch = friendsList?.filter((friend) =>
    friend.formattedFullName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedBirthdays = sortBirthdaysByClosest(friendsList);
  const spotlightFriend = getSpotlightFriend(sortedBirthdays);
  const nextFiveFriends = getNextFiveFriends(sortedBirthdays);

  const sortedBirthdaysByMonth = getBirthdaysByMonth(friendsList);

  return (
    <BirthdayUpdateContext.Provider
      value={{
        setUserUid,
        setFriendsList,
        setIsSearching,
        setSearchText,
        setIsUserSharingList,
        setIsIdSearching,
        setSearchIdText,
        setIsAddingFriend,
        setFriendWasAdded,
        setFriendWasDeleted,
        setIsEditingFriend,
      }}
    >
      <BirthdayContext.Provider
        value={{
          userUid,
          friendsList,
          isSearching,
          searchText,
          friendsFilteredBySearch,
          spotlightFriend,
          nextFiveFriends,
          sortedBirthdaysByMonth,
          isUserSharingList,
          isIdSearching,
          searchIdText,
          isAddingFriend,
          friendWasAdded,
          friendWasDeleted,
          isEditingFriend,
        }}
      >
        {children}
      </BirthdayContext.Provider>
    </BirthdayUpdateContext.Provider>
  );
}

// Create an array of month names
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Returns the state of if the user is adding a friend, and if the friend was added
 *
 * @returns { isAddingFriend, friendWasAdded, friendWasDeleted, isEditingFriend }
 */
export function useActionFriends() {
  const { isAddingFriend, friendWasAdded, friendWasDeleted, isEditingFriend } =
    useBirthdayProvider('useActionFriends');
  return {
    isAddingFriend,
    friendWasAdded,
    friendWasDeleted,
    isEditingFriend,
  };
}

/**
 * Returns the list of friends on your account, the spotlight friend, the next 5 closest friends, and the list of friends sorted by month
 *
 * @returns { friendsList, spotlightFriend, nextFiveFriends, sortedBirthdaysByMonth }
 */
export function useFriends() {
  const {
    friendsList,
    spotlightFriend,
    nextFiveFriends,
    sortedBirthdaysByMonth,
  } = useBirthdayProvider('useFriends');
  return {
    friendsList,
    spotlightFriend,
    nextFiveFriends,
    sortedBirthdaysByMonth,
  };
}

/**
 * Returns the state for the isSearching, the search value, the filtered list of friends by search, the isIdSearching state, and the searchIdText for looking up a friend's list
 *
 * @returns { isSearching, searchText, isIdSearching, searchIdText }
 */
export function useSearch() {
  const {
    isSearching,
    searchText,
    friendsFilteredBySearch,
    isIdSearching,
    searchIdText,
  } = useBirthdayProvider('useSearch');
  return {
    isSearching,
    searchText,
    friendsFilteredBySearch,
    isIdSearching,
    searchIdText,
  };
}

/**
 * Returns the user uid, if user is sharing list
 *
 * @returns { userUid, isUserSharingList }
 */
export function useUserInfo() {
  const { userUid, isUserSharingList } = useBirthdayProvider('useUserInfo');
  return { userUid, isUserSharingList };
}

/**
 * Updates the state of if the user is adding a friend, and if the friend was added
 *
 * @returns { setIsAddingFriend, setFriendWasAdded, setFriendWasDeleted, setIsEditingFriend }
 */
export function useSetAddingFriends() {
  const {
    setIsAddingFriend,
    setFriendWasAdded,
    setFriendWasDeleted,
    setIsEditingFriend,
  } = useSetBirthdayProvider('useSetAddingFriends');
  return {
    setIsAddingFriend,
    setFriendWasAdded,
    setFriendWasDeleted,
    setIsEditingFriend,
  };
}

/**
 * Updates the state of the friends list
 *
 * @returns { setFriendsList }
 */
export function useSetFriends() {
  const { setFriendsList } = useSetBirthdayProvider('useSetAddingFriends');
  return {
    setFriendsList,
  };
}

/**
 * Updates the searching state for the params, the searching value for the filtering, the id searching state, and the id search value for looking up a friend's list
 *
 * @returns { setIsSearching, setSearchText, setIsIdSearching, setSearchIdText }
 */
export function useSetSearch() {
  const { setIsSearching, setSearchText, setIsIdSearching, setSearchIdText } =
    useSetBirthdayProvider('useSetSearch');
  return { setIsSearching, setSearchText, setIsIdSearching, setSearchIdText };
}

/**
 * Updates the user uid, and if user is sharing list
 *
 * @returns { setUserUid, setIsUserSharingList }
 */
export function useSetUserInfo() {
  const { setUserUid, setIsUserSharingList } =
    useSetBirthdayProvider('useSetUserInfo');
  return { setUserUid, setIsUserSharingList };
}

/**
 * Private hook to return the Birthday context
 * @param {String} functionName - name of function calling this hook
 * @returns {{}}
 */
function useBirthdayProvider(functionName) {
  const data = useContext(BirthdayContext);
  if (!data)
    throw new Error(
      `${functionName} must be used within a component wrapped by BirthdayProvider.`
    );
  return data;
}

/**
 * Enables making changes to the BirthdayContext (using the BirthdayUpdateContext)
 * @param {String} functionName - just for using in error reporting
 * @returns {{}}
 */
function useSetBirthdayProvider(functionName) {
  const data = useContext(BirthdayUpdateContext);
  if (!data)
    throw new Error(
      `${functionName} must be used within a component wrapped by BirthdayProvider.`
    );
  return data;
}

// PRIVATE FUNCTIONS

/**
 * Formats the birthdate in the format "2020-05-15" to "May 15"
 * @param {String} birthdate - birth date in the format "2020-05-15"
 * @returns {String} formatted birth date in the format "month day (May 15)"
 */
function formatBirthdate(birthdate) {
  if (!birthdate) return;

  const [year, month, day] = birthdate.split('-');

  // Get the month name based on the month number (subtract 1 since months are zero-indexed)
  const monthName = monthNames[parseInt(month) - 1];

  // Return the formatted birthdate string
  return `${monthName} ${parseInt(day)}`;
}

/**
 * Returns the formatted name of the friend, in case friend has middle name or many names, and the first name
 * @param {String} fullName - full name of the friend
 * @returns {{String, String}} formatted full name and first name
 */
function formatFullName(fullName) {
  if (!fullName) return;

  const [firstName, lastName] = fullName?.split(' ');
  const formattedFullName = `${firstName} ${lastName}`;

  return {
    formattedFullName,
    firstName,
  };
}

/**
 * Gets all the birthdays for each friend sorted by month
 * @param {[Object]} friends - list of friends
 * @returns {[Object]} friends sorted by month
 */
function getBirthdaysByMonth(friends) {
  if (!friends) return [];

  const birthdaysGroupedByMonth = [];

  // Loop through each month to group the friends by month
  monthNames.forEach((month) => {
    const filteredFriendsByMonth = friends.filter((friend) => {
      const friendBirthdayMonth = Number(friend.birthdate.split('-')[1]);
      const friendBirthdayMonthName = monthNames[friendBirthdayMonth - 1];

      return friendBirthdayMonthName === month;
    });

    birthdaysGroupedByMonth.push({
      month: month,
      friends: filteredFriendsByMonth,
    });
  });

  return birthdaysGroupedByMonth;
}

/**
 * Returns the shortened birthdate in the format "Jan 15"
 * @param {String} birthdate - birth date in the format "January 15"
 * @returns {String} formatted birth date in the format "Jan 15"
 */
function getShortenedBirthdate(birthdate) {
  if (!birthdate) return;

  const fullBirthdate = formatBirthdate(birthdate);

  const [month, day] = fullBirthdate.split(' ');

  const shortMonthName = month.slice(0, 3);

  // // Return the formatted birthdate string
  return `${shortMonthName} ${parseInt(day)}`;
}

/**
 * Gets the friend with the closest birthday
 * @param {[Object]} birthdays - list of birth dates
 * @returns {Object} friend with the closest birthday
 */
function getSpotlightFriend(birthdate) {
  if (!birthdate) return {};

  return birthdate[0]?.friend || null;
}

/**
 * Gets the next 5 closest birthdays
 * @param {[Object]} birthdays - list of birth dates
 * @returns {[Object]} friends with the next 5 closest birthdays besides the spotlight friend
 */
function getNextFiveFriends(birthdate) {
  if (!birthdate) return [];

  return birthdate.slice(1, 6);
}

/**
 * Gets the friend with the closest birthday
 * @param {[Object]} friends - list of friends
 * @returns {Object} friend with the closest birthday
 */
function sortBirthdaysByClosest(friends) {
  if (!friends) return {};

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayObj = new Date(todayYear, todayMonth, todayDay);
  const currentYear = today.getFullYear();

  // Calculate next closest birthday for each friend
  const closestBirthdays = friends.map((friend) => {
    // Passing birth dates in the format "2020-05-15" and converting them to objects so the Date constructor converts them to local time and not UTC
    const [birthdateYear, birthdateMonth, birthdateDay] = friend?.birthdate
      ?.split('-')
      .map(Number);
    const birthdate = new Date(birthdateYear, birthdateMonth - 1, birthdateDay);

    const nextBirthdayThisYear = new Date(
      currentYear,
      birthdate.getMonth(),
      birthdate.getDate()
    );
    const nextBirthdayNextYear = new Date(
      currentYear + 1,
      birthdate.getMonth(),
      birthdate.getDate()
    );
    const nextClosestBirthday =
      todayObj > nextBirthdayThisYear
        ? nextBirthdayNextYear
        : nextBirthdayThisYear;

    return { friend, nextClosestBirthday };
  });

  // Sort closestBirthdays by nextClosestBirthday
  closestBirthdays.sort(
    (a, b) => a.nextClosestBirthday - b.nextClosestBirthday
  );

  // Return the friend with the closest birthday
  return closestBirthdays;
}
