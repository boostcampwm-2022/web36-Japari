export const dummyRooms = [
  { gameRoomId: "1", title: "캐마 초보만", gameId: 1, currentPeople: 1, maximumPeople: 4, isPrivate: true },
  { gameRoomId: "2", title: "캐마 고수만", gameId: 1, currentPeople: 2, maximumPeople: 6, isPrivate: false },
  { gameRoomId: "3", title: "배틀십 ㄱㄱ", gameId: 2, currentPeople: 5, maximumPeople: 8, isPrivate: true },
  { gameRoomId: "4", title: "자파리 갓겜", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: false },
  { gameRoomId: "5", title: "즐겁게 한 판", gameId: 2, currentPeople: 1, maximumPeople: 8, isPrivate: true },
  { gameRoomId: "6", title: "재밌게 한 판", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: false },
  { gameRoomId: "7", title: "신나게 한 판", gameId: 1, currentPeople: 1, maximumPeople: 8, isPrivate: true },
  { gameRoomId: "8", title: "비번 1234", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: true },
  { gameRoomId: "9", title: "신나게 한 판", gameId: 1, currentPeople: 1, maximumPeople: 8, isPrivate: true },
  { gameRoomId: "10", title: "비번 1234", gameId: 1, currentPeople: 2, maximumPeople: 8, isPrivate: true },
];

export const dummyUser = {
  userId: 1,
  email: "japari@gmail.com",
  nickname: "아임더베스트게이머",
  score: 2000,
  profileImage: "",
  rank: 230,
};

const dummyUser1 = {
  userId: 1,
  email: "japari@gmail.com",
  nickname: "japari",
  score: 2000,
  profileImage: "",
  connected: true,
};

const dummyUser2 = {
  userId: 1,
  email: "first@gmail.com",
  nickname: "first",
  score: 3000,
  profileImage: "",
  connected: false,
};

export const dummyUserMap = {
  users: Array(13).fill(dummyUser1),
  friends: [dummyUser1, dummyUser2],
  rank: Array(10).fill(dummyUser2),
};
