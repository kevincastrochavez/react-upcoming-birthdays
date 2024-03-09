/**
 * Gets the number of days until the friend's birthday
 * @param {Object} birthdate - friend's birthday
 * @returns {{Object, Boolean}} - number of days until the friend's birthday and whether the friend's birthday is today
 */
function daysUntilBirthday(birthdate) {
  // Split the birthdate into year, month, and day components
  const [year, month, day] = birthdate?.split('-').map(Number);

  // Get the current date
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayObj = new Date(todayYear, todayMonth, todayDay);

  // Create a Date object for the birthdate
  const birthdayDate = new Date(todayYear, month - 1, day);

  // Calculate the difference in milliseconds between today and the next birthday
  const difference = birthdayDate.getTime() - todayObj.getTime();
  // Convert milliseconds to days
  const daysToBirthday = Math.ceil(difference / (1000 * 60 * 60 * 24));
  const isBirthdayToday = daysToBirthday === 0;

  return {
    daysToBirthday,
    isBirthdayToday,
  };
}

export { daysUntilBirthday };
