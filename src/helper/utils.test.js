import { daysUntilBirthday } from './utils.js'; // Importing the function to be tested

describe('daysUntilBirthday', () => {
  test('returns correct number of days until birthday when birthday is in the future', () => {
    const futureBirthdate = '1997-03-23';

    const result = daysUntilBirthday(futureBirthdate);

    expect(result.daysToBirthday).toBe(14);
    expect(result.isBirthdayToday).toBe(false);
  });

  test('returns 0 days until birthday when birthday is today', () => {
    const today = new Date(); // Mock today's date
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    const birthdate = `${todayYear}-${todayMonth + 1}-${todayDay}`;

    const result = daysUntilBirthday(birthdate);

    expect(result.daysToBirthday).toBe(0);
    expect(result.isBirthdayToday).toBe(true);
  });

  test('returns correct number of days until birthday when birthday is in the past', () => {
    const birthdate = '1997-03-07';

    const result = daysUntilBirthday(birthdate);

    expect(result.daysToBirthday).toBe(-4);
    expect(result.isBirthdayToday).toBe(false);
  });
});
