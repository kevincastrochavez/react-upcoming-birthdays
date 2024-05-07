/**
 * Gets the number of days until the friend's birthday
 * @param {Object} birthdate - friend's birthday
 * @returns {{Object, Boolean}} - number of days until the friend's birthday and whether the friend's birthday is today
 */
function daysUntilBirthday(birthdate) {
  if (!birthdate) return {};

  // Split the birthdate into year, month, and day components
  const [year, month, day] = birthdate?.split('-').map(Number);

  // Get the current date
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayObj = new Date(todayYear, todayMonth, todayDay);

  // Create a Date object for the birthdate
  const birthdayDateThisYear = new Date(todayYear, month - 1, day);
  const birthdayDateNextYear = new Date(todayYear + 1, month - 1, day);

  // Calculate the difference in milliseconds between today and the next birthday
  let difference;
  let daysToBirthday;
  let isBirthdayToday;

  if (todayObj > birthdayDateThisYear) {
    difference = birthdayDateNextYear.getTime() - todayObj.getTime();
    daysToBirthday = Math.ceil(difference / (1000 * 60 * 60 * 24));
    isBirthdayToday = daysToBirthday === 0;
  } else {
    difference = birthdayDateThisYear.getTime() - todayObj.getTime();
    daysToBirthday = Math.ceil(difference / (1000 * 60 * 60 * 24));
    isBirthdayToday = daysToBirthday === 0;
  }

  return {
    daysToBirthday,
    isBirthdayToday,
  };
}

/**
 * Gets the years the friend is turning this year or next year
 * @param {Object} birthdate - friend's birthday in the format "2020-05-15"
 * @returns {Number} - years the friend is turning
 */
function getNextBirthdayAge(birthdate) {
  // Parse the birthdate into a Date object
  const birthday = new Date(birthdate);
  const today = new Date();

  // Get the current year and the year of the birthdate
  const thisYear = today.getFullYear();
  const birthYear = birthday.getFullYear();

  // Calculate the next birthday year
  let nextBirthdayYear = thisYear;
  if (
    today.getMonth() < birthday.getMonth() ||
    (today.getMonth() === birthday.getMonth() &&
      today.getDate() <= birthday.getDate())
  ) {
    // If today's date is before the birthday this year, the next birthday is this year
    nextBirthdayYear = thisYear;
  } else {
    // Otherwise, the next birthday is next year
    nextBirthdayYear = thisYear + 1;
  }

  // Calculate the age at the next birthday
  const nextBirthdayAge = nextBirthdayYear - birthYear;

  return nextBirthdayAge;
}

/**
 * Gets the user ID in localStorage, if any
 * @param {String} key - The key used to retrieve the existing uid from localStorage, if any
 * @return {String} - User ID
 */
function getUserUid(key) {
  return localStorage.getItem(key);
}

/**
 * Removes the user ID in localStorage
 * @param {String} key - The key used to retrieve the existing uid from localStorage, if any
 * @return {void} - This function does not return a value.
 */
function removeUserUid(key) {
  return localStorage.removeItem(key);
}

/**
 * Sets the user ID in localStorage
 * @param {String} key - The key used to retrieve the existing uid from localStorage, if any
 * @param {String} udi - User ID
 * @return {void} - This function does not return a value.
 */
function saveUserUid(key, udi) {
  return localStorage.setItem(key, udi);
}

export {
  daysUntilBirthday,
  getUserUid,
  removeUserUid,
  saveUserUid,
  getNextBirthdayAge,
};
