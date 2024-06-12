import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../models/user.models.js';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

// Ensure environment variables are loaded
import dotenv from 'dotenv';
dotenv.config();


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email' });
            }

            const isMatch = await user.comparePassword(password);
            console.log('Password:', password, 'User Password:', user.password, 'Match:', isMatch);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, user);
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }
));

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET ,
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        }
        else { return done(null, false);}
    } catch (err) {
        return done(err, false);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
