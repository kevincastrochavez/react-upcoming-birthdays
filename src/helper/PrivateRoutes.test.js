import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';
import { useUserUid } from './../components/BirthdayProvider';

jest.mock('./../components/BirthdayProvider');

describe('Private Routes', () => {
  test('Renders Dashboard Page if user is authenticated', () => {
    useUserUid.mockReturnValue({ userUid: 'exampleUserId' });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route index path='/' element={<div>Dashboard Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument();
  });

  test('Renders All Friends Page if user is authenticated', () => {
    useUserUid.mockReturnValue({ userUid: 'exampleUserId' });

    render(
      <MemoryRouter initialEntries={['/allFriends']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              index
              path='/allFriends'
              element={<div>All Friends Page</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/All Friends Page/i)).toBeInTheDocument();
  });

  test('Redirects to login page if user is not authenticated', () => {
    useUserUid.mockReturnValue({ userUid: null });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<PrivateRoutes />} />
          <Route path='/login' element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
