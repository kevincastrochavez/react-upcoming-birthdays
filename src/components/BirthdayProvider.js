import React, { createContext, useContext, useState } from 'react';

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
  const friendsList = fakeData;

  // Format birthdate and attach it to each friend
  const birthdatesList = friendsList.map((friend) => friend?.birthdate);
  const birthdatesListConverted = birthdatesList.map((birthdate) =>
    formatBirthdate(birthdate)
  );
  birthdatesListConverted.map(
    (birthdate, index) => (friendsList[index].birthdateFormatted = birthdate)
  );

  return (
    <BirthdayUpdateContext.Provider
      value={{
        setUserUid,
        setIsSearching,
      }}
    >
      <BirthdayContext.Provider value={{ userUid, friendsList, isSearching }}>
        {children}
      </BirthdayContext.Provider>
    </BirthdayUpdateContext.Provider>
  );
}

/**
 * Returns the list of friends on your account
 *
 * @returns { friendsList }
 */
export function useFriends() {
  const { friendsList } = useBirthdayProvider('useFriends');
  return { friendsList };
}

/**
 * Returns the state for the isSearching
 *
 * @returns { isSearching }
 */
export function useIsSearching() {
  const { isSearching } = useBirthdayProvider('useIsSearching');
  return { isSearching };
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
 * Updates the searching state for the params
 *
 * @returns { setIsSearching }
 */
export function useSetIsSearching() {
  const { setIsSearching } = useSetBirthdayProvider('useSetIsSearching');
  return { setIsSearching };
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

// Private Functions

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
