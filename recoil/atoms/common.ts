import { atom } from 'recoil';

export const contextState = atom({
  key: 'contextState',
  default: '',
});

export const contextSet = atom({
  key: 'contextSet',
  default: [
    {
      purpose: 'createGroup',
      title: '문장집 추가',
      description: '새로운 문장집 이름을 입력하세요.',
    },
    {
      purpose: 'updateGroup',
      title: '문장집 이름변경',
      description: '변경할 문장집 이름을 입력하세요.',
    },
    {
      purpose: 'logout',
      title: '로그아웃',
      description: '로그아웃하시겠습니까?',
    },
    {
      purpose: 'deleteAccount',
      title: '회원탈퇴',
      description: '정말 회원을 탈퇴하겠습니까? 모든 데이터가 삭제됩니다.',
    },
    {
      purpose: 'deleteSentence',
      title: '문장삭제',
      description: '선택한 문장을 삭제하시겠습니까?',
    },
    {
      purpose: 'changeGroup',
      title: '문장집 변경',
      description: '선택한 문장의 문장집을 변경하시겠습니까?',
    },
    {
      purpose: 'updateGroup',
      title: '문장집 수정',
      description: '선택한 문장집의 이름을 변경하시겠습니까?',
    },
    {
      purpose: 'deleteGroup',
      title: '문장집 삭제',
      description:
        '선택한 문장집을 삭제하시겠습니까? 문장집 내 모든 문장이 삭제됩니다.',
    },
  ],
});
