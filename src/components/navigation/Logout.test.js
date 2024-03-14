import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Logout from './Logout';
import { useUserInfo } from '../BirthdayProvider';

// Mock useUserInfo hook
jest.mock('../BirthdayProvider', () => ({
  useUserInfo: jest.fn(),
}));

describe('Logout', () => {
  test('renders logout button when user is logged in', () => {
    // Mock userUid to simulate logged-in state
    useUserInfo.mockReturnValue({ userUid: 'exampleUserId' });

    const { getByText, getByAltText } = render(<Logout />);

    const logoutText = getByText('Logout');
    const logoutAltText = getByAltText('Happy B logo');

    expect(logoutText).toBeInTheDocument();
    expect(logoutAltText).toBeInTheDocument();
  });

  test('does not render logout button when user is logged out', () => {
    // Mock userUid to simulate logged-out state
    useUserInfo.mockReturnValue({ userUid: null });

    const { queryByText, queryByAltText } = render(<Logout />);

    const logoutText = queryByText('Logout');
    const logoutAltText = queryByAltText('Happy B logo');

    expect(logoutText).not.toBeInTheDocument();
    expect(logoutAltText).not.toBeInTheDocument();
  });

  test('calls onClick handler when logout button is clicked', () => {
    // Mock userUid to simulate logged-in state
    useUserInfo.mockReturnValue({ userUid: 'exampleUserId' });

    const onClick = jest.fn();
    const { getByText } = render(<Logout onClick={onClick} />);

    const logoutText = getByText('Logout');

    fireEvent.click(logoutText);

    expect(onClick).toHaveBeenCalled();
  });
});
