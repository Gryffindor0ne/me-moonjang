import { render } from '@testing-library/react';

// @ts-ignore
const Providers = ({ children }) => {
  return children;
};

// @ts-ignore
const customRender = (ui, options = {}) => {
  return render(ui, { wrapper: Providers, ...options });
};

export * from '@testing-library/react';

export { customRender as render };
