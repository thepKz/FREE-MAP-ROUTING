import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/Map', () => () => <div data-testid="map-component" />);
jest.mock('./components/RouteInfo', () => () => <div data-testid="route-info-component" />);
jest.mock('./components/SearchForm', () => () => <div data-testid="search-form-component" />);

describe('App component', () => {
  test('renders App component correctly', () => {
    render(<App />);
    
    expect(screen.getByText('App tính toán đường đi (No API) v1.0')).toBeInTheDocument();
    expect(screen.getByTestId('search-form-component')).toBeInTheDocument();
    expect(screen.getByTestId('route-info-component')).toBeInTheDocument();
    expect(screen.getByTestId('map-component')).toBeInTheDocument();
  });
});