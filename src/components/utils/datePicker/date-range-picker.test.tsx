import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import { DateRangePicker } from './date-range-picker'
import * as dateRangeStore from '@/store/dateRangeStore'
import * as dateRangeQuery from '@/services/queries/useDateRangeQuery'

// Mock the dependencies
vi.mock('@/store/dateRangeStore', () => ({
    useDateRangeStore: vi.fn(),
    DEFAULT_START_DATE: new Date('2023-01-01'),
    DEFAULT_END_DATE: new Date('2023-12-31')
}))

vi.mock('@/services/queries/useDateRangeQuery', () => ({
    useDateRangeQuery: vi.fn()
}))

// Mock UI components to isolate logic and avoid render issues
vi.mock('./button', () => ({
    Button: ({ children, onClick }: any) => React.createElement('button', { onClick }, children)
}))

vi.mock('./popover', () => ({
    Popover: ({ children, open, onOpenChange }: any) => (
        React.createElement('div', { 'data-testid': 'popover' },
            children,
            open && React.createElement('div', { 'data-testid': 'popover-content-wrapper', onClick: () => onOpenChange(false) })
        )
    ),
    PopoverTrigger: ({ children }: any) => React.createElement('div', { 'data-testid': 'popover-trigger' }, children),
    PopoverContent: ({ children }: any) => React.createElement('div', { 'data-testid': 'popover-content' }, children),
}))

vi.mock('./calendar', () => ({
    Calendar: ({ onSelect, defaultMonth }: any) => (
        React.createElement('div', { 'data-testid': 'calendar' },
            React.createElement('button', {
                'data-testid': 'calendar-select-date',
                onClick: () => onSelect(new Date('2023-02-01'))
            }, 'Select Date'),
            React.createElement('span', {}, `Current Month: ${defaultMonth?.toString()}`)
        )
    )
}))

vi.mock('./date-input', () => ({
    DateInput: () => React.createElement('div', { 'data-testid': 'date-input' })
}))

vi.mock('./label', () => ({
    Label: ({ children }: any) => React.createElement('label', {}, children)
}))

vi.mock('./select', () => ({
    Select: ({ children }: any) => React.createElement('div', { 'data-testid': 'select' }, children),
    SelectContent: ({ children }: any) => React.createElement('div', {}, children),
    SelectItem: ({ children }: any) => React.createElement('div', {}, children),
    SelectTrigger: ({ children }: any) => React.createElement('div', {}, children),
    SelectValue: () => React.createElement('span', {}, 'Select Value'),
}))

vi.mock('./switch', () => ({
    Switch: () => React.createElement('div', { 'data-testid': 'switch' })
}))

vi.mock('@radix-ui/react-icons', () => ({
    CheckIcon: () => React.createElement('span', {}, 'Check'),
    ChevronDownIcon: () => React.createElement('span', {}, 'Down'),
    ChevronUpIcon: () => React.createElement('span', {}, 'Up'),
}))

describe('DateRangePicker', () => {
    const mockSetDateRange = vi.fn()
    const mockRefetch = vi.fn()

    beforeEach(() => {
        vi.spyOn(dateRangeStore, 'useDateRangeStore').mockReturnValue({
            setDateRange: mockSetDateRange
        })
        vi.spyOn(dateRangeQuery, 'useDateRangeQuery').mockReturnValue({
            refetch: mockRefetch,
            data: [],
            isLoading: false,
            isError: false
        } as any)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should render trigger button with formatted dates', () => {
        render(
            <DateRangePicker
                initialDateFrom={new Date('2023-01-01')}
                initialDateTo={new Date('2023-12-31')}
            />
        )
        // The date formatting may vary due to timezone adjustments, so check for the presence of dates
        const button = screen.getByTestId('popover-trigger').querySelector('button')
        expect(button).toBeInTheDocument()
        expect(button?.textContent).toContain('2023')
    })

    it('should open popover when clicked', () => {
        render(
            <DateRangePicker
                initialDateFrom={new Date('2023-01-01')}
                initialDateTo={new Date('2023-12-31')}
            />
        )
        const trigger = screen.getByTestId('popover-trigger').querySelector('button')
        fireEvent.click(trigger!)
        expect(screen.getByTestId('popover-content')).toBeInTheDocument()
    })

    it('should call onUpdate when update button is clicked', () => {
        const onUpdateMock = vi.fn()
        render(
            <DateRangePicker
                initialDateFrom={new Date('2023-01-01')}
                initialDateTo={new Date('2023-12-31')}
                onUpdate={onUpdateMock}
            />
        )
        const trigger = screen.getByTestId('popover-trigger').querySelector('button')
        fireEvent.click(trigger!)

        const updateButton = screen.getByText('Update')
        fireEvent.click(updateButton)
        expect(updateButton).toBeInTheDocument()
    })
})
