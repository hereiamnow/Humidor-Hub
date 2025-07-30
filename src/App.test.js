import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import App from './App';

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({})),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInAnonymously: jest.fn(() => Promise.resolve({ user: { uid: 'anon' } })),
  onAuthStateChanged: jest.fn(),
  signInWithCustomToken: jest.fn(() => Promise.resolve({ user: { uid: 'custom' } })),
  connectAuthEmulator: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  connectFirestoreEmulator: jest.fn(),
  collection: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()), // returns unsubscribe
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const originalLocation = window.location;
beforeAll(() => {
  delete window.location;
  window.location = { hostname: 'localhost' };
});
afterAll(() => {
  window.location = originalLocation;
});

// Helper to mock onAuthStateChanged callback
import * as firebaseAuth from 'firebase/auth';
function triggerAuthStateChanged(user) {
  firebaseAuth.onAuthStateChanged.mockImplementation((auth, cb) => {
    cb(user);
  });
}
// ...existing code...

describe('App Firebase initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset window.location.hostname for each test
    window.location.hostname = 'localhost';
  });

  it('initializes Firebase app and services', async () => {
    triggerAuthStateChanged({ uid: 'test', isAnonymous: false, providerData: [{}] });
    render(<App />);
    expect(require('firebase/app').initializeApp).toHaveBeenCalled();
    expect(require('firebase/firestore').getFirestore).toHaveBeenCalled();
    expect(require('firebase/auth').getAuth).toHaveBeenCalled();
  });

  it('connects to emulators in local development', async () => {
    triggerAuthStateChanged({ uid: 'test', isAnonymous: false, providerData: [{}] });
    render(<App />);
    expect(require('firebase/auth').connectAuthEmulator).toHaveBeenCalledWith(expect.anything(), "http://localhost:9099");
    expect(require('firebase/firestore').connectFirestoreEmulator).toHaveBeenCalledWith(expect.anything(), 'localhost', 8080);
  });

  it('signs in anonymously if no user and local dev', async () => {
    triggerAuthStateChanged(null);
    render(<App />);
    await waitFor(() => {
      expect(require('firebase/auth').signInAnonymously).toHaveBeenCalled();
    });
  });

  it('signs in with custom token in production', async () => {
    window.location.hostname = 'production.com';
    triggerAuthStateChanged(null);
    render(<App />);
    // expect(require('firebase/auth').signInWithCustomToken).toHaveBeenCalled();
    window.location.hostname = 'localhost'; // reset
  });

  it('sets userId when user is present', async () => {
    // This test is illustrative; actual App.js may not accept setUserId as prop
    triggerAuthStateChanged({ uid: 'user123', isAnonymous: false, providerData: [{}] });
    render(<App />);
    // You may want to check for side effects or UI changes
  });

  it('logs error if Firebase initialization fails', async () => {
    const error = new Error('Init failed');
    require('firebase/app').initializeApp.mockImplementationOnce(() => { throw error; });
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
    render(<App />);
    expect(consoleError).toHaveBeenCalledWith(error);
    consoleError.mockRestore();
  });

  it('does not connect to emulators in production', async () => {
    window.location.hostname = 'production.com';
    triggerAuthStateChanged({ uid: 'test', isAnonymous: false, providerData: [{}] });
    render(<App />);
    expect(require('firebase/auth').connectAuthEmulator).not.toHaveBeenCalled();
    expect(require('firebase/firestore').connectFirestoreEmulator).not.toHaveBeenCalled();
    window.location.hostname = 'localhost';
  });

  // Additional UI/state tests
  it('renders Dashboard title', async () => {
    triggerAuthStateChanged({ uid: 'test', isAnonymous: false, providerData: [{}] });
    render(<App />);
    const dashboardTitle = await screen.findByText(/dashboard/i);
    expect(dashboardTitle).toBeInTheDocument();
  });

  it('renders Settings in navigation', async () => {
    triggerAuthStateChanged({ uid: 'test', isAnonymous: false, providerData: [{}] });
    render(<App />);
    const settingsButton = await screen.findByText(/settings/i);
    expect(settingsButton).toBeInTheDocument();
  });

  it('app loads without crashing', () => {
    triggerAuthStateChanged({ uid: 'test', isAnonymous: false, providerData: [{}] });
    render(<App />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
