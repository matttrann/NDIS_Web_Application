import { QuestionnaireForm } from "@/app/(protected)/dashboard/questionnaire/questionnaire-form";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { toast } from 'sonner';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('QuestionnaireForm', () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {    
    jest.clearAllMocks();
  });

  it('renders the all questions', () => {
    render(<QuestionnaireForm userId="test-user" />);
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();//Q1
    expect(screen.getByText('Rate your energy today:')).toBeInTheDocument();//Q2
    expect(screen.getByText("What's been the hardest part of your day/week?")).toBeInTheDocument();//Q3
    expect(screen.getByText('What tasks or activities do you need help with most?')).toBeInTheDocument();//Q4
    expect(screen.getByText('How comfortable do you feel interacting with others?')).toBeInTheDocument();//Q5
    expect(screen.getByText('What usually makes you feel upset or overwhelmed?')).toBeInTheDocument();//Q6
    expect(screen.getByText("What helps you feel calm when you're stressed?")).toBeInTheDocument();//Q7
    expect(screen.getByText("What's one thing you'd like to get better at?")).toBeInTheDocument();//Q8
    expect(screen.getByText('What are you really good at or proud of?')).toBeInTheDocument();//Q9
    expect(screen.getByText('How do you prefer to communicate?')).toBeInTheDocument();//Q10
    expect(screen.getByText('How do you learn best?')).toBeInTheDocument();//Q11
    expect(screen.getByText('Do any of these bother you?')).toBeInTheDocument();//Q12
    expect(screen.getByText('What do you love doing or learning about?')).toBeInTheDocument();//Q13
    expect(screen.getByText('Who should the main character in your story be?')).toBeInTheDocument();//Q14
    expect(screen.getByText('What kind of story do you want?')).toBeInTheDocument();//Q15
    expect(screen.getByText('Who helps you most often?')).toBeInTheDocument();//Q16
    expect(screen.getByText("What's one thing you'd like to try doing on your own?")).toBeInTheDocument();//Q17
  });

  it('displays an error if next is clicked without answering the question', () => {
    render(<QuestionnaireForm userId="test-user" />);
    fireEvent.click(screen.getByText('Next'));
    expect(toast.error).toHaveBeenCalledWith('Please answer this question before proceeding.');
  });

  it('navigates to the next question on button click', async () => {
    render(<QuestionnaireForm userId="test-user" />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '😊 Happy' } });
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Rate your energy today:')).toBeInTheDocument();
  });

  it('navigates to the previous question on button click', async () => {
    render(<QuestionnaireForm userId="test-user" />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '😊 Happy' } });
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Previous'));
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
  });

  it('submits the form and shows success toast', async () => {
    render(<QuestionnaireForm userId="test-user" />);
    // Fill out the form enough for validation to pass
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '😊 Happy' } });//Q1
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test challenge' } });//Q2
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByLabelText('Self-care'));//Q3
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByLabelText('Loud noises'));//Q4
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Deep breathing' } });//Q5
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Making friends' } });//Q6
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Good at drawing' } });//Q7
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Talking'));//Q8
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Watching videos'));//Q9
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByLabelText('Bright lights'));//Q10
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Drawing' } });//Q11
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Someone like me'));//Q12
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Funny'));//Q13
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Family'));//Q14
    fireEvent.click(screen.getByText('Next'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Go to the store' } });

    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        'Your questionnaire has been submitted successfully!',
        {
          id: expect.any(String),
          duration: 5000,
        }
      );
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });
});