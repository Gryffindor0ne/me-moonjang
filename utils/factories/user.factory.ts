import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';

export const UserFactory = Factory.define('User').attrs({
  email: () => faker.internet.email(),
  password: () => `!${faker.random.alphaNumeric(10)}`,
  username: () => faker.internet.userName(),
  authType: () =>
    faker.helpers.arrayElement(['me-moonjang', 'kakao', 'google']),
});

export default UserFactory;
