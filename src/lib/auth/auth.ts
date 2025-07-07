import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { admin, magicLink } from 'better-auth/plugins';

import { config } from '../boiler-config';
import { sendEmail } from '../emails';
import prisma from '../prisma';

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    admin(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: `${config.name} - Connexion`,
          template: 'magic-link',
          props: {
            url,
          },
        });
      },
    }),
  ],
  hooks: {
    after: createAuthMiddleware(async ctx => {
      if (ctx.path.startsWith('/magic-link')) {
        if (ctx.context.newSession?.user.id && !ctx.context.newSession?.user.name) {
          await prisma.user.update({
            where: {
              id: ctx.context.newSession?.user.id,
            },
            data: {
              name: `user-${ctx.context.newSession?.user.id.slice(0, 10)}`,
            },
          });
        }
      }
    }),
  },
});

export default auth;
