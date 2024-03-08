import React from 'react';
import { render } from '@testing-library/react';

import MonthFriend from './MonthFriend';

describe('MonthFriend component', () => {
  test('renders correctly with provided props', () => {
    const imageUrl = 'https://example.com/image.jpg';
    const fullName = 'Kevin Castro';
    const birthdateFormatted = 'May 15';

    const { getByText } = render(
      <MonthFriend
        imageUrl={imageUrl}
        fullName={fullName}
        birthdateFormatted={birthdateFormatted}
      />
    );

    const nameElement = getByText('Kevin Castro');
    const birthdateElement = getByText('May 15');

    // expect(imageElement).toBeInTheDocument();
    expect(nameElement).toBeInTheDocument();
    expect(birthdateElement).toBeInTheDocument();
    // TODO: Add testid for images later
    // expect(imageElement).toHaveAttribute(
    //   'src',
    //   'https://example.com/image.jpg'
    // );
  });
});
