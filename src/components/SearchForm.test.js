import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import SearchForm from './SearchForm';

jest.mock('axios');

describe('SearchForm', () => {
  // Existing tests
  it('renders input fields and search button', () => {
    render(<SearchForm setOrigin={() => {}} setDestination={() => {}} setRoute={() => {}} />);
    
    expect(screen.getByPlaceholderText('Điểm xuất phát')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Điểm đến')).toBeInTheDocument();
    expect(screen.getByText('Tìm đường')).toBeInTheDocument();
  });

  it('updates input values on change', () => {
    render(<SearchForm setOrigin={() => {}} setDestination={() => {}} setRoute={() => {}} />);
    
    const originInput = screen.getByPlaceholderText('Điểm xuất phát');
    const destinationInput = screen.getByPlaceholderText('Điểm đến');

    fireEvent.change(originInput, { target: { value: 'Hà Nội' } });
    fireEvent.change(destinationInput, { target: { value: 'Hồ Chí Minh' } });

    expect(originInput.value).toBe('Hà Nội');
    expect(destinationInput.value).toBe('Hồ Chí Minh');
  });
  it('calls setOrigin and setDestination when form is submitted', async () => {
    const mockSetOrigin = jest.fn();
    const mockSetDestination = jest.fn();
    const mockSetRoute = jest.fn();

    axios.get.mockResolvedValueOnce({
      data: [{ lat: '21.0285', lon: '105.8542', display_name: 'Hà Nội, Việt Nam' }]
    }).mockResolvedValueOnce({
      data: [{ lat: '10.8231', lon: '106.6297', display_name: 'Hồ Chí Minh, Việt Nam' }]
    }).mockResolvedValueOnce({
      data: { routes: [{ geometry: { coordinates: [[105.8542, 21.0285], [106.6297, 10.8231]] } }] }
    });

    render(<SearchForm setOrigin={mockSetOrigin} setDestination={mockSetDestination} setRoute={mockSetRoute} />);
    
    const originInput = screen.getByPlaceholderText('Điểm xuất phát');
    const destinationInput = screen.getByPlaceholderText('Điểm đến');
    const searchButton = screen.getByText('Tìm đường');

    fireEvent.change(originInput, { target: { value: 'Hà Nội' } });
    fireEvent.change(destinationInput, { target: { value: 'Hồ Chí Minh' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockSetOrigin).toHaveBeenCalledWith(expect.objectContaining({
        lat: '21.0285',
        lon: '105.8542',
        display_name: 'Hà Nội, Việt Nam'
      }));
    });

    await waitFor(() => {
      expect(mockSetDestination).toHaveBeenCalledWith(expect.objectContaining({
        lat: '10.8231',
        lon: '106.6297',
        display_name: 'Hồ Chí Minh, Việt Nam'
      }));
    });

    await waitFor(() => {
      expect(mockSetRoute).toHaveBeenCalledWith([[105.8542, 21.0285], [106.6297, 10.8231]]);
    });
  });

  it('handles API error gracefully', async () => {
    console.error = jest.fn();
    axios.get.mockRejectedValue(new Error('API Error'));
  
    render(<SearchForm setOrigin={() => {}} setDestination={() => {}} setRoute={() => {}} />);
    
    const originInput = screen.getByPlaceholderText('Điểm xuất phát');
    const destinationInput = screen.getByPlaceholderText('Điểm đến');
    fireEvent.change(originInput, { target: { value: 'Hà Nội' } });
    fireEvent.change(destinationInput, { target: { value: 'Hồ Chí Minh' } });
  
    const searchButton = screen.getByText('Tìm đường');
    fireEvent.click(searchButton);
  
    await waitFor(() => {
      expect(screen.getByText('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.')).toBeInTheDocument();
    });
  
    expect(console.error).toHaveBeenCalledWith('Error searching for locations:', expect.any(Error));
  });

  it('handles empty input submission', async () => {
    const mockSetOrigin = jest.fn();
    const mockSetDestination = jest.fn();
    const mockSetRoute = jest.fn();

    render(<SearchForm setOrigin={mockSetOrigin} setDestination={mockSetDestination} setRoute={mockSetRoute} />);
    
    const searchButton = screen.getByText('Tìm đường');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Vui lòng nhập điểm xuất phát và điểm đến')).toBeInTheDocument();
    });

    expect(mockSetOrigin).not.toHaveBeenCalled();
    expect(mockSetDestination).not.toHaveBeenCalled();
    expect(mockSetRoute).not.toHaveBeenCalled();
  });

  it('handles invalid location input', async () => {
    const mockSetOrigin = jest.fn();
    const mockSetDestination = jest.fn();
    const mockSetRoute = jest.fn();

    axios.get.mockResolvedValue({ data: [] }); // Simulating no results found

    render(<SearchForm setOrigin={mockSetOrigin} setDestination={mockSetDestination} setRoute={mockSetRoute} />);
    
    const originInput = screen.getByPlaceholderText('Điểm xuất phát');
    const destinationInput = screen.getByPlaceholderText('Điểm đến');
    fireEvent.change(originInput, { target: { value: 'Invalid Location' } });
    fireEvent.change(destinationInput, { target: { value: 'Another Invalid Location' } });

    const searchButton = screen.getByText('Tìm đường');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Không tìm thấy địa điểm. Vui lòng thử lại.')).toBeInTheDocument();
    });

    expect(mockSetOrigin).not.toHaveBeenCalled();
    expect(mockSetDestination).not.toHaveBeenCalled();
    expect(mockSetRoute).not.toHaveBeenCalled();
  });
});