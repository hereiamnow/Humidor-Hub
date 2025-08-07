import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CigarJournalScreen from './CigarJournalScreen';

// Mock the child components
jest.mock('./JournalEntryCard', () => {
    return function MockJournalEntryCard({ entry }) {
        return <div data-testid="journal-entry-card">{entry.cigarName}</div>;
    };
});

jest.mock('./GridJournalEntryCard', () => {
    return function MockGridJournalEntryCard({ entry }) {
        return <div data-testid="grid-journal-entry-card">{entry.cigarName}</div>;
    };
});

jest.mock('../UI/PageHeader', () => {
    return function MockPageHeader({ title }) {
        return <div data-testid="page-header">{title}</div>;
    };
});

describe('CigarJournalScreen - Add Journal Entry Navigation', () => {
    const mockNavigate = jest.fn();
    const mockDb = {};
    const mockAppId = 'test-app';
    const mockUserId = 'test-user';
    const mockJournalEntries = [
        {
            id: '1',
            cigarName: 'Test Cigar',
            cigarBrand: 'Test Brand',
            dateSmoked: '2025-01-01',
            experienceRating: 4
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Add Journal Entry button', () => {
        render(
            <CigarJournalScreen
                navigate={mockNavigate}
                journalEntries={mockJournalEntries}
                db={mockDb}
                appId={mockAppId}
                userId={mockUserId}
            />
        );

        const addButton = screen.getByLabelText('Add Journal Entry');
        expect(addButton).toBeInTheDocument();
    });

    it('calls navigate with AddEditJournalEntry when Add Journal Entry button is clicked', () => {
        render(
            <CigarJournalScreen
                navigate={mockNavigate}
                journalEntries={mockJournalEntries}
                db={mockDb}
                appId={mockAppId}
                userId={mockUserId}
            />
        );

        const addButton = screen.getByLabelText('Add Journal Entry');
        fireEvent.click(addButton);

        expect(mockNavigate).toHaveBeenCalledWith('AddEditJournalEntry');
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('calls navigate without parameters for new entry', () => {
        render(
            <CigarJournalScreen
                navigate={mockNavigate}
                journalEntries={mockJournalEntries}
                db={mockDb}
                appId={mockAppId}
                userId={mockUserId}
            />
        );

        const addButton = screen.getByLabelText('Add Journal Entry');
        fireEvent.click(addButton);

        // Verify that navigate is called with only the route name, no parameters
        expect(mockNavigate).toHaveBeenCalledWith('AddEditJournalEntry');
        expect(mockNavigate.mock.calls[0]).toHaveLength(1);
    });
});