import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
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
  collection: jest.fn((db, ...path) => ({ path: path.join('/') })),
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
    return jest.fn(); // return unsubscribe
  });
}

// Helper to mock onSnapshot
import * as firestore from 'firebase/firestore';
function triggerOnSnapshot(collectionPath, data) {
  firestore.onSnapshot.mockImplementation((ref, cb) => {
    if (ref.path.endsWith(collectionPath)) {
      const snapshot = {
        docs: data.map(item => ({
          id: item.id,
          data: () => ({ ...item }),
        })),
      };
      cb(snapshot);
    }
    return jest.fn(); // return unsubscribe
  });
}

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
    window.initialAuthToken = 'test-token';
    triggerAuthStateChanged(null);
    render(<App />);
    await waitFor(() => {
      expect(require('firebase/auth').signInWithCustomToken).toHaveBeenCalledWith(expect.anything(), 'test-token');
    });
    delete window.initialAuthToken;
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

describe('App Data Fetching and State', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.hostname = 'localhost';
    localStorageMock.clear();
  });

  it('shows loading indicator initially', () => {
    triggerAuthStateChanged(null); // No user yet, so it should be loading
    render(<App />);
    expect(screen.getByText(/Loading Your Collection/i)).toBeInTheDocument();
  });

  it('fetches data when user is authenticated', async () => {
    triggerAuthStateChanged({ uid: 'test-user', isAnonymous: false, providerData: [{}] });
    render(<App />);
    await waitFor(() => {
      expect(firestore.onSnapshot).toHaveBeenCalledWith(expect.objectContaining({ path: 'artifacts/undefined/users/test-user/humidors' }), expect.any(Function), expect.any(Function));
      expect(firestore.onSnapshot).toHaveBeenCalledWith(expect.objectContaining({ path: 'artifacts/undefined/users/test-user/cigars' }), expect.any(Function), expect.any(Function));
      expect(firestore.onSnapshot).toHaveBeenCalledWith(expect.objectContaining({ path: 'artifacts/undefined/users/test-user/journalEntries' }), expect.any(Function), expect.any(Function));
    });
  });
});

describe('App Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    triggerAuthStateChanged({ uid: 'test-user', isAnonymous: false, providerData: [{}] });
    // Mock some data to prevent "not found" errors
    triggerOnSnapshot('cigars', [{ id: 'c1', name: 'Test Cigar' }]);
    triggerOnSnapshot('humidors', [{ id: 'h1', name: 'Test Humidor' }]);
  });

  it('navigates to HumidorsScreen when humidor icon is clicked', async () => {
    render(<App />);
    // Wait for dashboard to load
    await screen.findByText(/dashboard/i);

    // Find the navigation button for humidors (assuming it has text 'My Humidors')
    const humidorNavButton = screen.getByRole('button', { name: /my humidors/i });
    fireEvent.click(humidorNavButton);

    // Check if the HumidorsScreen is rendered
    await waitFor(() => {
      expect(screen.getByText(/Test Humidor/i)).toBeInTheDocument();
    });
  });
});

describe('App Theme Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    triggerAuthStateChanged({ uid: 'test-user', isAnonymous: false, providerData: [{}] });
  });

  it('loads default theme if localStorage is empty', async () => {
    render(<App />);
    await screen.findByText(/dashboard/i);
    // Assuming default theme has a specific text color or class
    // This is an indirect check. A better check would be to see if localStorage is set.
    expect(localStorageMock.setItem).toHaveBeenCalledWith('humidor-hub-theme', expect.stringContaining('Humidor Hub'));
  });

  it('loads theme from localStorage if present', async () => {
    const customTheme = { name: 'Midnight', bg: 'bg-gray-900', text: 'text-gray-100' };
    localStorageMock.setItem('humidor-hub-theme', JSON.stringify(customTheme));
    render(<App />);
    await screen.findByText(/dashboard/i);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('humidor-hub-theme');
    // Check that it doesn't try to set the default theme again
    expect(localStorageMock.setItem).not.toHaveBeenCalledWith('humidor-hub-theme', expect.stringContaining('Humidor Hub'));
  });
});
