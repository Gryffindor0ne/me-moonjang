import { rest } from 'msw';

export const handlers = [
  rest.post('/auth/signup', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ message: 'User created' }));
  }),
];
