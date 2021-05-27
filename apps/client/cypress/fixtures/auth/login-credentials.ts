export type UserCredentials = {
  username: string;
  email: string;
  password: string;
};
export const users: { [user: string]: UserCredentials } = {
  user0: {
    username: 'test_user0',
    password: 'Apassword0',
    email: 'test_user0@gmail.com',
  },
  user1: {
    username: 'test_user1',
    password: 'Apassword0',
    email: 'test_user1@gmail.com',
  },
  user2: {
    username: 'test_user2',
    password: 'Apassword0',
    email: 'test_user2@gmail.com',
  },
};
