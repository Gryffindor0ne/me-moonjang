import { act } from 'react-dom/test-utils';
import { render, waitFor, screen } from '@utils/test-utils';

import AuthPage from '@pages/auth/login';

describe('LoginPage', () => {
  describe('로그인 페이지', () => {
    beforeEach(async () => {
      await act(() => {
        render(<AuthPage />, {});
      });
    });

    it('회원가입하기 버튼이 있음', async () => {
      await waitFor(() => {
        expect(screen.getByTestId('register-btn')).toBeInTheDocument();
      });
    });
  });
});
