import dayjs from 'dayjs';

import { SentenceDetailInfo } from '@components/sentence/Sentence';

export const descendingSort = (sentences: SentenceDetailInfo[]) => {
  return sentences.sort((a, b) => b.createdAt - a.createdAt);
};

export const writtenDate = (date: number) =>
  dayjs(date).format('YYYY년 MM월 DD일 A hh:mm');
