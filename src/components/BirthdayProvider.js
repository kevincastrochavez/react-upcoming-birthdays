import React, { createContext, useContext, useState } from 'react';

const BirthdayContext = createContext({});
const BirthdayUpdateContext = createContext({});

/**
 *  Provides whole application with information about the user
 *
 * @param {[React.ReactNode]|React.ReactNode} children - React children
 * @returns {JSX.Element}
 */
export default function BirthdayProvider({ children }) {
  const [userUid, setUserUid] = useState('');

  return (
    <BirthdayUpdateContext.Provider
      value={{
        setUserUid,
      }}
    >
      <BirthdayContext.Provider value={{ userUid }}>
        {children}
      </BirthdayContext.Provider>
    </BirthdayUpdateContext.Provider>
  );
}

/**
 * Returns the array of right persons that are attached to the left person in the alignment
 *
 * @returns { attachedPerson }
 */
export function useUserUid() {
  const { userUid } = useBirthdayProvider('useUserUid');
  return { userUid };
}

/**
 * Returns the array of right persons that are attached to the left person in the alignment
 *
 * @returns { attachedPerson }
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
 * @param {string} functionName - just for using in error reporting
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
