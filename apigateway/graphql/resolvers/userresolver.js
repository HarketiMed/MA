const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      return await User.findById(id);
    },
    getAllUsers: async () => {
      return await User.find();
    },
  },
  Mutation: {
    registerUser: async (_, { input }) => {
      const { username, email, password } = input;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      const result = await user.save();
      
      const token = jwt.sign(
        { userId: result.id, email: result.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token,
        user: result,
      };
    },
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist');
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect');
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        token,
        user,
      };
    },
  },
};

module.exports = resolvers;