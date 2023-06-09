import { Dispatch, SetStateAction } from 'react';

export type UserInfo = {
  id: string;
  email: string;
  username: string;
  authType: string;
};

export type GroupInfo = {
  _id: string;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
  sentences: SentenceDetailInfo[];
};

export type SentenceInfo = {
  groupName: string;
  sentence: string;
  interpretation: string;
  explanation: string;
};

export type SentenceDetailInfo = {
  id: string;
  sentence: string;
  interpretation: string;
  explanation: string;
  createdAt: number;
  updatedAt: number;
  learningState?: boolean;
};

export type ConfirmModalProps = {
  handler: () => void;
};

export type GroupEditModalProps = {
  id: string;
  setIsSelectGroupId: Dispatch<SetStateAction<string>>;
};

export type GroupNameModalProps = {
  selectGroupId: string;
  setIsSelectGroupId: Dispatch<SetStateAction<string>>;
};

export type GroupSelectModalProps = {
  selectSentence: SentenceDetailInfo[];
  selectSentenceIds: string[];
};

export type SentenceEditModalProps = {};
