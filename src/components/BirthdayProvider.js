import React, { createContext, useContext, useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';

import fakeData from '../data/fakeData';

const BirthdayContext = createContext({});
const BirthdayUpdateContext = createContext({});

/**
 *  Provides whole application with information about the user
 *
 * @param {[React.ReactNode]|React.ReactNode} children - React children
 * @returns {JSX.Element}
 */
export default function BirthdayProvider({ children }) {
  const [userUid, setUserUid] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useDebouncedState('', 300);
  const friendsList = fakeData;

  // Format birthdate and attach it to each friend
  const birthdatesList = friendsList?.map((friend) => friend?.birthdate);
  const birthdatesListConverted = birthdatesList?.map((birthdate) =>
    formatBirthdate(birthdate)
  );
  birthdatesListConverted?.map(
    (birthdate, index) => (friendsList[index].birthdateFormatted = birthdate)
  );

  const friendsFilteredBySearch = friendsList?.filter((friend) =>
    friend.fullName?.toLowerCase().includes(searchText)
  );

  const sortedBirthdays = sortBirthdaysByClosest(friendsList);
  const spotlightFriend = getSpotlightFriend(sortedBirthdays);
  const nextFiveFriends = getNextFiveFriends(sortedBirthdays);

  return (
    <BirthdayUpdateContext.Provider
      value={{
        setUserUid,
        setIsSearching,
        setSearchText,
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
        }}
      >
        {children}
      </BirthdayContext.Provider>
    </BirthdayUpdateContext.Provider>
  );
}

/**
 * Returns the list of friends on your account, the spotlight friend, and the next 5 closest friends
 *
 * @returns { friendsList, spotlightFriend, nextFiveFriends }
 */
export function useFriends() {
  const { friendsList, spotlightFriend, nextFiveFriends } =
    useBirthdayProvider('useFriends');
  return { friendsList, spotlightFriend, nextFiveFriends };
}

/**
 * Returns the state for the isSearching, the search value, and the filtered list of friends by search
 *
 * @returns { isSearching, searchText }
 */
export function useSearch() {
  const { isSearching, searchText, friendsFilteredBySearch } =
    useBirthdayProvider('useSearch');
  return { isSearching, searchText, friendsFilteredBySearch };
}

/**
 * Returns the user uid
 *
 * @returns { userUid }
 */
export function useUserUid() {
  const { userUid } = useBirthdayProvider('useUserUid');
  return { userUid };
}

/**
 * Updates the searching state for the params, the searching value for the filtering
 *
 * @returns { setIsSearching, setSearchText }
 */
export function useSetSearch() {
  const { setIsSearching, setSearchText } =
    useSetBirthdayProvider('useSetSearch');
  return { setIsSearching, setSearchText };
}

/**
 * Updates the user uid
 *
 * @returns { setUserUid }
 */
export function useSetUserUid() {
  const { setUserUid } = useSetBirthdayProvider('useSetUserUid');
  return { setUserUid };
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

// PRIVATE FUNCTIONS

/**
 * Enables making changes to the BirthdayContext (using the BirthdayUpdateContext)
 * @param {String} birthdate - birth date in the format "2020-05-15"
 * @returns {String} formatted birth date in the format "month day (May 15)"
 */
function formatBirthdate(birthdate) {
  if (!birthdate) return;

  const [year, month, day] = birthdate.split('-');

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

  // Get the month name based on the month number (subtract 1 since months are zero-indexed)
  const monthName = monthNames[parseInt(month) - 1];
  const shortMonthName = monthName.slice(0, 3);

  // Return the formatted birthdate string
  return `${shortMonthName} ${parseInt(day)}`;
}

/**
 * Gets the next 5 closest birthdays
 * @param {[Object]} birthdays - list of birth dates
 * @returns {[Object]} friends with the next 5 closest birthdays besides the spotlight friend
 */
function getSpotlightFriend(birthdate) {
  if (!birthdate) return;

  return birthdate[0];
}

/**
 * Gets the friend with the closest birthday
 * @param {[Object]} birthdays - list of birth dates
 * @returns {Object} friend with the closest birthday
 */
function getNextFiveFriends(birthdate) {
  if (!birthdate) return;

  return birthdate.slice(1, 6);
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

/**
 * Gets the friend with the closest birthday
 * @param {[Object]} friends - list of friends
 * @returns {Object} friend with the closest birthday
 */
function sortBirthdaysByClosest(friends) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayObj = new Date(todayYear, todayMonth, todayDay);
  const currentYear = today.getFullYear();

  // Calculate next closest birthday for each friend
  const closestBirthdays = friends.map((friend) => {
    // Passing birth dates in the format "2020-05-15" and converting them to objects so the Date constructor converts them to local time and not UTC
    const birthdateArray = friend.birthdate.split('-');
    const birthdateYear = Number(birthdateArray[0]);
    const birthdateMonth = Number(birthdateArray[1]);
    const birthdateDay = Number(birthdateArray[2]);
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
