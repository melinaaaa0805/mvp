/// <reference types="react-scripts" />
/// <reference types="jest" />

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './pages/Login';

// On mock le hook useAuth pour ne pas dépendre du backend.
jest.mock('./context/auth/AuthContext', () => {
  return {
    useAuth: jest.fn(),
  };
});

const { useAuth } = jest.requireMock('./context/auth/AuthContext') as {
  useAuth: jest.Mock;
};

describe('Login page (demo)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    (window.alert as unknown as { mockRestore?: () => void })?.mockRestore?.();
  });

  function renderLogin() {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  }

  const type = async (element: HTMLElement, text: string) => {
    await userEvent.type(element, text);
  };

  it('affiche le formulaire de connexion', () => {
    useAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      loading: false,
    });

    renderLogin();

    expect(screen.getByRole('heading', { name: /connexion/i })).toBeVisible();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mot de passe/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /se connecter/i })
    ).toBeEnabled();
  });

  it('refuse de soumettre si champs vides', async () => {
    useAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      loading: false,
    });

    renderLogin();

    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(window.alert).toHaveBeenCalledWith('Veuillez remplir tous les champs');
  });

  it('appelle auth.login et navigue vers /dashboard en cas de succès', async () => {
    const loginMock = jest.fn().mockResolvedValue({ success: true });
    useAuth.mockReturnValue({
      login: loginMock,
      logout: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      loading: false,
    });

    renderLogin();

    await type(screen.getByPlaceholderText(/email/i), 'demo@test.com');
    await type(screen.getByPlaceholderText(/mot de passe/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('demo@test.com', 'password');
    });

    await waitFor(() => {
      expect(window.alert).not.toHaveBeenCalled();
    });
  });

  it("affiche une alerte si l'API renvoie une erreur", async () => {
    const loginMock = jest
      .fn()
      .mockResolvedValue({ success: false, error: 'Identifiants invalides' });

    useAuth.mockReturnValue({
      login: loginMock,
      logout: jest.fn(),
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      loading: false,
    });

    renderLogin();

    await type(screen.getByPlaceholderText(/email/i), 'bad@test.com');
    await type(screen.getByPlaceholderText(/mot de passe/i), 'bad');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Identifiants invalides');
    });
  });
});
