import { fireEvent, render, screen } from '@testing-library/react';
import ServiceForm from './ServiceForm';

describe('ServiceForm component', () => {
  test('renders form fields correctly', () => {
    render(<ServiceForm />);
    
    expect(screen.getByPlaceholderText('Họ và tên')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Tôi đồng ý với các điều khoản và điều kiện')).toBeInTheDocument();
    expect(screen.getByText('Đặt dịch vụ')).toBeInTheDocument();
  });

  test('updates input values on change', () => {
    render(<ServiceForm />);
    
    const nameInput = screen.getByPlaceholderText('Họ và tên');
    const emailInput = screen.getByPlaceholderText('Email');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
  });

  test('submits form with correct data', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<ServiceForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Họ và tên'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByLabelText('Tôi đồng ý với các điều khoản và điều kiện'));
    fireEvent.click(screen.getByText('Đặt dịch vụ'));
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john@example.com',
      agreed: true
    }));
    
    consoleSpy.mockRestore();
  });
});