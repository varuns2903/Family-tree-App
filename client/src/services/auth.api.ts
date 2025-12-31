import { api } from "./api";
import type { User } from "../types/user.types";

interface RawAuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const AuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<RawAuthResponse>("/auth/login", {
      email,
      password,
    });

    return {
      user: {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post<RawAuthResponse>("/auth/register", {
      name,
      email,
      password,
    });

    return {
      user: {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
      },
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },
};
