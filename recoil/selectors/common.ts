import { selector } from 'recoil';

import { contextSet, contextState } from '@recoil/atoms/common';

export const selectContext = selector({
  key: 'selectContext',
  get: ({ get }) => {
    const contextSets = get(contextSet);
    const currentContext = get(contextState);

    return contextSets.find((context) => context.purpose === currentContext);
  },
});
