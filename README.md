# 자파리

# 프로젝트 소개

배포 URL: <a href="https://자파리.온라인.한국">자파리.온라인.한국</a>

![image](https://user-images.githubusercontent.com/86656921/205483722-9b8ecd8e-9823-4abc-a622-9b4d870c4413.png)

       * 자파리(Japari)는 ‘소꿉놀이’, ‘장난’, ‘장난하다’ 등의 의미를 갖고 있는 제주도 말입니다.

### 친구들과 함께 화상 / 음성 대화를 하면서 다양한 웹게임을 즐기세요!

- 디스코드나 zoom 같은 서드 파티 프로그램을 따로 설치할 필요 없이 한 화면에서 화상 / 음성 대화를 하면서 게임을 즐길 수 있습니다.
- 로비에서 원하는 게임 혹은 원하는 제목의 게임방을 찾아 들어갈 수 있습니다.
- 친구들과 프라이빗한 방을 만들어 게임을 즐길 수도 있습니다.
- 추후, 친구 추가 / 게임 초대 기능을 추가하여 친구들과의 게임 시작을 더 쉽게 만들 예정입니다.

# 팀원 소개

|**J003 강수홍**|**J065 김형준**|**J146 이승재**|**J203 최성호**|
|---|---|---|---|
|<img src="https://user-images.githubusercontent.com/86656921/205483807-8d946c15-c385-4e13-b45a-a89c62eee576.png" width="200" height="200"/>|<img src="https://user-images.githubusercontent.com/86656921/205483833-c6740164-cd6d-4a79-b291-530d30340cd2.png" width="200" height="200"/>|<img src="https://user-images.githubusercontent.com/86656921/205483841-b9bdb32d-bf75-4e3d-8c4b-36e43083b363.png" width="200" height="200"/>|<img src="https://user-images.githubusercontent.com/86656921/205483852-66d14892-aa70-4b17-b4bb-88af56efa232.png" width="200" height="200"/>|
|[**GitHub**](https://github.com/tnghd5761)|[**GitHub**](https://github.com/kimhyeongjun95)|[**GitHub**](https://github.com/seungjae94)|[**GitHub**](https://github.com/c99-coder)|
|`회기의 마술사`|`울산 분위기 메이커`|`김포 개발왕`|`신촌 배포왕`|

# 기술 스택

![image](https://user-images.githubusercontent.com/86656921/205483868-d9844547-dbce-48ae-9820-f8e2d3acc7e4.png)

[기술 스택 선정 이유 - 자세히보기](https://github.com/boostcampwm-2022/web36-Japari/wiki/%EA%B8%B0%EC%88%A0-%EC%84%A0%EC%A0%95-%EC%9D%B4%EC%9C%A0)

# 기능 소개

## 랜딩 페이지

![Untitled](https://user-images.githubusercontent.com/87958906/208001203-00571034-27ff-4c77-911e-b345ef0be2ba.png)

- 사용자들은 하단의 구글 또는 깃헙 로그인 버튼을 통해 소셜 로그인을 진행할 수 있습니다.
- 화면을 클릭하면 자동으로 배경음악이 실행됩니다.

## 로비

![Untitled1](https://user-images.githubusercontent.com/87958906/208001213-3a1223dc-d6ec-4876-a9c7-e60666afc87e.png)
![Untitled2](https://user-images.githubusercontent.com/87958906/208001217-6cf162e4-4127-481d-8d98-e0e3d47dd895.png)

- 사용자들은 왼쪽의 유저 목록에서 현재 접속중인 유저의 목록을 확인할 수 있습니다.
- 사용자들은 방 만들기 버튼을 눌러 방을 만들거나 목록에 있는 방 레코드를 눌러 방에 입장할 수 있습니다.
- 하단의 채팅창을 이용해 로비에 있는 사용자들과 채팅을 할 수 있습니다.

## 대기실

![Untitled3](https://user-images.githubusercontent.com/87958906/208001231-7f53b9ef-9d0a-4eb6-92bf-65ba7f51ee39.png)

- 방에 입장하면 방에 있는 다른 사용자들과 화상 / 음성 대화가 가능합니다.
- 상단 우측에 있는 마이크, 카메라 버튼을 눌러 자신의 마이크와 카메라를 온오프 할 수 있습니다.
- 상대방의 마이크, 카메라 ON / OFF 여부를 표시합니다.
- 참여자 누구나 게임 시작을 눌러 게임을 시작할 수 있습니다.
- 방 나가기 버튼을 통해 나갈 수 있습니다.

## 인게임 - 라운드 시작 전

![Untitled4](https://user-images.githubusercontent.com/87958906/208001244-7f947d06-bd3d-438a-80f9-9b589ea22961.png)

- 라운드 시작 전, 약 10초 간의 대기 시간이 주어집니다.
- 위에 타이머와 현재 몇 라운드인지 표시가 됩니다.
- 각각 사람마다 닉네임 밑에 현재 점수를 확인할 수 있습니다.
- 방 나가기 버튼을 통해 나갈 수 있습니다.

## 인게임 - 상대방이 그릴 때

![Untitled5](https://user-images.githubusercontent.com/87958906/208001253-e9911f1b-c108-42db-966b-fee85d45eb8d.png)

- 상대방이 2분 동안 그림을 그립니다.
- 채팅으로 상대방이 무엇을 그렸는지 맞추면 점수를 획득하고 채팅이 다른 사람들에게 보이지 않습니다.
- 캔버스를 조작할 수 없습니다.

## 인게임 - 정답 공개

![Untitled6](https://user-images.githubusercontent.com/87958906/208001260-b382eb9f-5c2a-4745-b47a-5bb168f889d1.png)

- 시간이 다 되거나 출제자를 제외한 모든 사람들이 정답을 맞추면 정답을 10초간 공개 합니다.

## 인게임 - 그림 그리기(문제 출제)

![Untitled7](https://user-images.githubusercontent.com/87958906/208001280-ca904244-2039-40ed-897a-9fab261072f7.png)

- 자신의 차례가 되면 10초간 먼저 제시어가 주어지고, 이후 2분 간 그림을 그릴 수 있는 시간이 주어집니다.
- 제시어는 캔버스 상단에 계속 위치합니다.
- 팔레트에서 펜, 지우개, 펜 굵기, 색깔을 고를 수 있습니다.
- 시간이 모두 지나거나 방 인원들이 모두 정답을 맞추면 시간이 종료됩니다.
