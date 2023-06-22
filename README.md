# Me-moonjang

> 영어문장을 단어장처럼 문장집으로 만들어 공부하는 앱을 구현하였습니다.

<br>

## 🚀 [배포링크](https://me-moonjang.vercel.app/)

<br>
<p>
<img src ="https://private-user-images.githubusercontent.com/79234473/247837535-0bdda074-3d15-4d8b-94cb-5be58492149d.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJrZXkxIiwiZXhwIjoxNjg3NDE0MTI1LCJuYmYiOjE2ODc0MTM4MjUsInBhdGgiOiIvNzkyMzQ0NzMvMjQ3ODM3NTM1LTBiZGRhMDc0LTNkMTUtNGQ4Yi05NGNiLTViZTU4NDkyMTQ5ZC5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMwNjIyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMDYyMlQwNjAzNDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1jNzQ3ZDBhN2IwMjUyY2M5MTdmMjY1YjgxYWJiNzFjNjBmNzIzM2NiY2U3N2Y0ZTc2YjEyOTU2NjFiMjVmZDk2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.zfhsZB9V0ZgR6fguCxvoDwPaABI9BvirhBFeB_91zSk" width="360" height="600"/>
 &nbsp; &nbsp; &nbsp;
<img src ="https://private-user-images.githubusercontent.com/79234473/247836193-50776fe1-6e4b-4e63-ab35-921713ca837c.gif?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJrZXkxIiwiZXhwIjoxNjg3NDEzOTYxLCJuYmYiOjE2ODc0MTM2NjEsInBhdGgiOiIvNzkyMzQ0NzMvMjQ3ODM2MTkzLTUwNzc2ZmUxLTZlNGItNGU2My1hYjM1LTkyMTcxM2NhODM3Yy5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMwNjIyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMDYyMlQwNjAxMDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yOGNiNmE0NDBlOTdmY2RhNmQ4YjFjMWVlMDE0N2QwYzE5NTlhODJmZThlYzliYTE0MTM2MmUwMGNiZGQ2OGE2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.AIJ8iyW93arp4Rv-N9dVE5RqXHACFOTY62kdkjAeVp8" width="360" height="600"/>
</p>

<br>

- [빠른 시작](#빠른-시작)
- [기능 개발 범위](#기능-개발-범위)
- [페이지 및 상세 기능](#페이지-및-상세-기능)
- [기술 스택](#기술-스택)

<br>

# 빠른 시작

```
git clone https://github.com/Gryffindor0ne/me-moonjang.git
yarn install
yarn dev
```

<br>

# 기능 개발 범위

> `문장집`(문장집 목록), `문장`(문장 등록페이지), `퀴즈`(퀴즈 페이지), `내 정보`(프로필 페이지) 총 4가지의 메뉴로 구성되어 있습니다.

<br>

1. 소셜 로그인 & 이메일 로그인

2. 문장집 등록, 이름변경, 삭제 기능 구현

3. 문장 등록, 이동, 삭제 기능 구현

4. 문장집별 문장 모아보기

5. 문장의 상세 내용 조회(영문장, 해설, 추가 설명)

   - 문장 학습을 위해 클릭시 해당 문장만 표시, 재클릭시 모든 내용 표시

6. 문장집별 퀴즈

   - OX 퀴즈 형태로 랜덤하게 출제

<br>

# 페이지 및 상세 기능

### 문장집 메인페이지 ('/')

- Me Moonjang 앱의 메인페이지입니다.

- 유저가 등록한 모든 문장집 리스트가 보여집니다.

- 우측 상단의 버튼을 클릭하면 새 문장집을 등록할 모달창이 띄워지며 새 문장집 이름을 입력하고 등록하면 새로운 문장집이 생성됩니다.

- 원하는 문장집을 클릭하면 해당 문장집의 상세페이지로 이동합니다.

### 문장집별 문장 페이지 ('/[문장집 아이디]')

- 선택한 문장집에 등록되어 있는 모든 문장을 볼 수 있습니다.

- 우측 상단의 2개의 버튼이 존재합니다.

  - `+` 버튼은 새로운 문장을 등록할 때 사용됩니다. 해당 버튼 클릭시 문장 등록페이지로 이동합니다.

  - `...` 버튼은 문장의 문장집 변경 및 문장 삭제 메뉴로 구성된 모달창을 띄웁니다. 원하는 메뉴를 고르면 문장 선택 창이 활성화 됩니다.

    - 문장집 변경의 경우 1개 이상의 문장 선택 후 변경 버튼을 누르면 문장집 선택 창이 띄워지고 이동할 문장집을 선택하면 문장집 변경을 재차 확인하는 창이 띄워집니다. 확인버튼을 누르면 문장의 문장집 변경이 완료됩니다.

    - 문장 삭제의 경우 1개 이상의 문장 선택 후 삭제 버튼을 누르면 삭제 확인 창이 띄워지고 확인버튼을 누르면 바로 삭제됩니다.

- 보고 싶은 문장을 클릭하면 해당 문장의 상세페이지로 이동합니다.

### 문장 상세페이지 ('/[문장집 아이디] /[해당 문장 아이디]')

- 선택된 문장의 상세내용을 볼 수 있습니다.

- 해당 문장의 내용, 해석이 표시됩니다. 추가적으로 등록된 설명이 있을 때는 설명까지 표시됩니다.

- 해당 문장을 클릭하면 문장만 보여지고, 재클릭시 해당 문장의 전체 내용이 보여지도록 구현하였습니다.

### 문장 등록 페이지 ('/newsentence')

- 하단 네비게이션 바의 `문장` 메뉴를 클릭하면 문장 등록페이지로 이동합니다.

- 문장 등록페이지에서 현재 존재하는 유저의 모든 문장집 중 하나를 선택하여 새로운 문장을 등록할 수 있습니다.

- 문장 등록은 문장집 선택, 문장, 해석, 설명(옵션)을 입력하고 문장 등록버튼을 클릭하여 등록합니다.

- 문장이 등록되면 해당 문장을 등록한 문장집으로 이동합니다.

### 퀴즈 페이지 ('/quiz')

- 하단 네비게이션 바의 `퀴즈` 메뉴를 클릭하면 퀴즈페이지로 이동합니다.

- 현재 등록된 모든 문장집이 나타납니다.

- 문장집을 선택하면 해당 문장집에 등록된 모든 문장이 랜덤하게 퀴즈로 출제됩니다.

- 퀴즈는 OX 퀴즈 형태로 구성되어 있습니다. O 또는 X 둘 중 하나를 선택하면 다음 문제로 넘어갑니다.

- 모든 문제가 끝나면 정답수에 맞게 점수가 표시됩니다.

### 프로필 페이지 ('/profile')

- 하단 네비게이션 바의 `내 정보` 메뉴를 클릭하면 프로필페이지로 이동합니다.

- 프로필페이지에서는 유저의 로그인방식, 이메일, 유저 이름 그리고 로그아웃, 회원탈퇴 버튼이 보여집니다.

  - 로그인방식은 일반 이메일로그인은 `MEMOONJANG`, 카카오 로그인은 `KAKAO`, 구글 로그인은 `GOOGLE`로 표시됩니다.

- 로그아웃은 로그아웃 메뉴 우측의 버튼을 통해 가능합니다. 해당 버튼 클릭시 로그아웃을 확인하는 창이 뜨며 확인버튼 클릭시 로그아웃됩니다.

- 회원탈퇴는 회원탈퇴 텍스트를 누르면 확인하는 창이 띄워지고 확인버튼 클릭시 회원탈퇴가 이루어집니다.

<br>

# 기술 스택

<p align='center'>
   <img src="https://img.shields.io/badge/TypeScript-^4.8.4-darkblue?logo=TypeScript"/>
    <img src="https://img.shields.io/badge/NextJS-^13.0.2-black?logo=Next.js"/>
    <img src="https://img.shields.io/badge/React-^18.2.0-blue?logo=React"/>
    <img src="https://img.shields.io/badge/Node.js-v16.15.0-green?logo=Node.js"/>
    <img src="https://img.shields.io/badge/React Query-%5E4.20.4-red?logo=React Query"/>
    <img src="https://img.shields.io/badge/Tailwind CSS-^5.3.5-skyblue?logo=Tailwind CSS"/>
   
</p>
