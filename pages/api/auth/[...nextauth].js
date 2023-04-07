import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import axios from 'axios';

import { dbConnect } from '@lib/db';

import { generateAccessToken, verifyToken } from '@lib/jwt';

const refreshAccessToken = async (token) => {
  try {
    const response = await axios.post(`${process.env.NEXTAUTH_URL}/api/auth`, {
      user: token.user,
    });

    const { accessToken } = response.data;

    return {
      ...token,
      accessToken,
    };
  } catch (error) {
    return {
      ...token,
      accessToken: undefined,
      error: 'RefreshAccessTokenError',
    };
  }
};

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'memoonjang',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = credentials;
          const user = await axios.post(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              email,
              password,
            }
          );

          if (user.status === 200) {
            return user.data;
          }
          return null;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'credentials' && user) {
        return true;
      }
      if (account.provider === 'kakao') {
        try {
          await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            email: user.email,
          });

          return true;
        } catch (error) {
          if (error.response?.status === 404) {
            const result = await axios.post(
              `${process.env.NEXTAUTH_URL}/api/auth/signup`,
              {
                email: user.email,
                username: user.name,
                password: user.id,
                authType: 'kakao',
              }
            );

            if (result.status == 201) {
              await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                email: user.email,
              });
            }

            return true;
          } else {
            throw error;
          }
        }
      }
      if (account.provider === 'google') {
        try {
          await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            email: user.email,
          });
          return true;
        } catch (error) {
          if (error.response?.status === 404) {
            const result = await axios.post(
              `${process.env.NEXTAUTH_URL}/api/auth/signup`,
              {
                email: user.email,
                username: user.name,
                password: user.id,
                authType: 'google',
              }
            );

            if (result.status == 201) {
              await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
                email: user.email,
              });
            }

            return true;
          } else {
            throw error;
          }
        }
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account.provider === 'kakao' || 'google') {
          const client = await dbConnect();
          const db = client.db();
          const usersCollection = db.collection('users');
          const userInfo = await usersCollection.findOne({
            email: user.email,
          });

          const userId = userInfo._id.toString();

          const accessToken = generateAccessToken({
            username: user.username,
            email: user.email,
          });

          client.close();

          token.user = {
            id: userId,
            email: userInfo.email,
            username: userInfo.username,
            authType: userInfo.authType,
          };
          token.accessToken = accessToken;
        } else {
          token.user = {
            id: user.id,
            email: user.email,
            username: user.username,
            authType: userInfo.authType,
          };
          token.accessToken = user.accessToken;
        }
      }

      try {
        verifyToken(token.accessToken);
        return token;
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return await refreshAccessToken(token);
        }
        throw new Error(error.message);
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accesesToken = token.accessToken;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
