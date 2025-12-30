import { User } from "../user/user.model";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

export const AuthService = {
  async register(name: string, email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      const err: any = new Error("Email already exists");
      err.statusCode = 400;
      err.code = "EMAIL_ALREADY_EXISTS";
      throw err;
    }

    const user = await User.create({ name, email, password });

    const accessToken = signAccessToken({ userId: user._id.toString() });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    return { user, accessToken, refreshToken };

  },

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      const err: any = new Error("Invalid credentials");
      err.statusCode = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const accessToken = signAccessToken({ userId: user._id.toString() });
    const refreshToken = signRefreshToken({ userId: user._id.toString() });

    return { user, accessToken, refreshToken };

  },
};
