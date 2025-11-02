import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import AddExerciseModal from './AddExerciseModal.jsx';
import { muscleGroups } from '../../data/muscleGroupDatabase.js';


describe("AddExerciseModal", () => {

    const mockOnClose = vi.fn();
    const mockOnAddExercise = vi.fn();
    const mockExercises = [
        { name: 'Bankdrücken', muscleGroup: 'Brust' },
        { name: 'Liegestütze', muscleGroup: 'Brust' },
        { name: 'Kreuzheben', muscleGroup: 'Rücken' },
        { name: 'Klimmzüge', muscleGroup: 'Rücken' },
        { name: 'Kniebeugen', muscleGroup: 'Beine' },
      ];
    
    beforeEach(() => {
        vi.clearAllMocks();
      });

    const renderModal = (props = {}) => {
        const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onAddExercise: mockOnAddExercise,
        availableMuscleGroups: muscleGroups,
        availableExercises: mockExercises,
        ...props
        };
        return render(<AddExerciseModal {...defaultProps} />);
    };

    // ----------------------------- render tests ------------------------------------------------
    test('renders modal when isOpen is true and displays muscle groups', () => {
       renderModal()

       expect(screen.getByText('Muskelgruppe wählen')).toBeInTheDocument();
       expect(screen.getByText('Brust')).toBeInTheDocument();
       expect(screen.getByText('Rücken')).toBeInTheDocument();
    
    });
    
    test('does not render when isOpen is false', () => {
       renderModal({ isOpen: false })

       expect(screen.queryByText('Muskelgruppe wählen')).not.toBeInTheDocument();
    });
    

    // ----------------------------- muscle group tests ------------------------------------------------
    test('displays all muscle groups', () => {
        renderModal()

        const buttons = screen.getAllByTestId('muscle-button');
        console.log(buttons);

        expect(buttons.length).toBe(muscleGroups.length);

        muscleGroups.forEach(group => {
            expect(screen.getByText(group.name)).toBeInTheDocument();
        });
    });
    
    test('switches to exercise list when muscle group is selected', () => {
        renderModal()

        const button = screen.getByText('Brust');
        fireEvent.click(button);

        expect(screen.getByText('Übungen für Brust')).toBeInTheDocument();
        expect(screen.getByText('Bankdrücken')).toBeInTheDocument();

    });
    

    //  ----------------------------- exercise selection ------------------------------------------------

    
    test('adds exercise and closes modal when exercise is selected and correct exercise data is passed', () => {
        renderModal()

        const button = screen.getByText('Brust');
        fireEvent.click(button);
        const exerciseButton = screen.getByText('Bankdrücken');
        fireEvent.click(exerciseButton);

        expect(mockOnAddExercise).toHaveBeenCalledWith({ name: 'Bankdrücken', muscleGroup: 'Brust' });
        expect(mockOnClose).toHaveBeenCalled();
    });
    

    // --------------------------------------navigation ------------------------------------------------
    test('goes back to muscle grid when back button is clicked', () => {
        renderModal()

        const button = screen.getByText('Brust');
        fireEvent.click(button);
        const backButton = screen.getByText('← Zurück zu Muskelgruppen');

        fireEvent.click(backButton);
        expect(screen.getByText('Muskelgruppe wählen')).toBeInTheDocument();
        
    });
    


    test('closes modal when close button is clicked', () => {
        renderModal();
    
        fireEvent.click(screen.getByLabelText('Modal schließen'));
        
        expect(mockOnClose).toHaveBeenCalled();
    
    });
    
    
    test('resets all state when modal is closed', () => {
       const {rerender} = renderModal();

        const button = screen.getByText('Brust');

        fireEvent.click(button);
        fireEvent.click(screen.getByLabelText('Modal schließen'));
        
        cleanup();
        // Re-render to check state reset
        renderModal();
        expect(screen.getByText('Muskelgruppe wählen')).toBeInTheDocument();
      
    });

    // ----------------------------- error handling ------------------------------------------------
    test('shows no exercises when no exercises are found', () => {
        renderModal({ availableExercises: [] });
    
        fireEvent.click(screen.getByText('Brust'));
        
        expect(screen.getByText('Übungen für Brust')).toBeInTheDocument();
        expect(screen.queryByText('Bankdrücken')).not.toBeInTheDocument();
    });
    
    test('shows no muscles when no muscle groups are found', () => {
        renderModal({ availableMuscleGroups: [] });

        expect(screen.queryByText('Muskelgruppe wählen')).toBeInTheDocument();
        expect(screen.queryByText('Brust')).not.toBeInTheDocument();
    });
    

});