import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback as GoogleVerifyCallback } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

console.log('========================================');
console.log('INICIALIZANDO PASSPORT');
console.log('========================================');

// Google Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async (
    accessToken: string, 
    refreshToken: string, 
    profile: GoogleProfile, 
    done: GoogleVerifyCallback
  ) => {
    try {
      console.log('Google profile recebido:', profile.emails?.[0]?.value);
      
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('Email não encontrado'));
      }

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
        user = await prisma.user.create({
          data: {
            name: profile.displayName || email.split('@')[0],
            email,
            password: hashedPassword,
            role: 'USER'
          }
        });
        console.log('Novo usuário criado:', email);
      }

      return done(null, user);
    } catch (error) {
      console.error('Erro no GoogleStrategy:', error);
      return done(error as Error);
    }
  }
));

// GitHub Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
    scope: ['user:email']
  },
  async (
    accessToken: string, 
    refreshToken: string, 
    profile: GitHubProfile, 
    done: (error: any, user?: any) => void
  ) => {
    try {
      console.log('GitHub profile recebido:', profile.emails?.[0]?.value || profile.username);
      
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        const hashedPassword = await bcrypt.hash(Math.random().toString(36), 10);
        user = await prisma.user.create({
          data: {
            name: profile.displayName || profile.username || email.split('@')[0],
            email,
            password: hashedPassword,
            role: 'USER'
          }
        });
        console.log('Novo usuário criado:', email);
      }

      return done(null, user);
    } catch (error) {
      console.error('Erro no GitHubStrategy:', error);
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

console.log('✅ Passport inicializado com sucesso!');
console.log('========================================');

export default passport;
