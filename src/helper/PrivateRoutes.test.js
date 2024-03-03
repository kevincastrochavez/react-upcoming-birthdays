import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import PrivateRoutes from './PrivateRoutes';
import { useUserUid } from './components/BirthdayProvider';

jest.mock('./components/BirthdayProvider');

describe('Private Routes', () => {
  test('Renders Outlet if user is authenticated', () => {
    useUserUid.mockReturnValue({ userUid: 'exampleUserId' });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route
              index
              path='/dashboard'
              element={<div>Dashboard Page</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument();
  });

  test('Redirects to login page if user is not authenticated', () => {
    useUserUid.mockReturnValue({ userUid: null });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path='/dashboard' element={<PrivateRoutes />} />
          <Route path='/login' element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });
});
