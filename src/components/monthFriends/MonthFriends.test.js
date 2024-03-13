import React from 'react';
import { render } from '@testing-library/react';
import MonthFriends from './MonthFriends';

describe('MonthFriends', () => {
  test('renders with correct props', () => {
    // Mocked monthObj data
    const monthObj = {
      month: 'January',
      friends: [
        {
          imageUrl: 'https://example.com/image1.jpg',
          formattedFullName: 'Kevin Castro',
          birthdateFormatted: 'Jan 23',
        },
        {
          imageUrl: 'https://example.com/image2.jpg',
          formattedFullName: 'Citlalli Gonzalez',
          birthdateFormatted: 'Jan 31',
        },
      ],
    };

    const { getByText } = render(<MonthFriends monthObj={monthObj} />);

    const monthHeading = getByText(/January/i);
    expect(monthHeading).toBeInTheDocument();

    const friendOneName = getByText(/Kevin Castro/i);
    expect(friendOneName).toBeInTheDocument();

    const friendTwoName = getByText(/Citlalli Gonzalez/i);
    expect(friendTwoName).toBeInTheDocument();
  });
});
