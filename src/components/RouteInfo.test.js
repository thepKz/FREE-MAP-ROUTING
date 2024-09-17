import { render, screen } from '@testing-library/react';
import RouteInfo from './RouteInfo';

describe('RouteInfo component', () => {
  test('renders nothing when route is not provided', () => {
    const { container } = render(<RouteInfo />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders route information when route is provided', () => {
    const route = [[0, 0], [1, 1]];
    render(<RouteInfo route={route} />);
    
    expect(screen.getByText('Thông tin tuyến đường:')).toBeInTheDocument();
    expect(screen.getByText(/Khoảng cách:/)).toBeInTheDocument();
    expect(screen.getByText(/Thời gian ước tính:/)).toBeInTheDocument();
  });
});