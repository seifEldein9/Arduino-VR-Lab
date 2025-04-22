import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';  
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails?.[0]?.value });
        if (existingUser) {
          return done(null, existingUser);  
        }
        const newUser = new User({
    
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          profilePic: profile.photos?.[0]?.value || null,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.error('Error during Google login:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during user deserialization:', error);
    done(error, null);
  }
});
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();  
    res.status(200).json({
      message: 'تم جلب المستخدمين بنجاح',
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      message: 'حدث خطأ أثناء جلب المستخدمين',
    });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.post('/google/callback', async (req, res) => {
  const { token } = req.body; 

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const payload = ticket.getPayload(); 

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id },
      'YOUR_SECRET_KEY', 
      { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: 'تم تسجيل الدخول بنجاح!',
      user,
      token: jwtToken,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'حدث خطأ أثناء تسجيل الدخول عبر جوجل' });
  }
});
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
       res.redirect('/profile');  
    }
  );
export default router;
