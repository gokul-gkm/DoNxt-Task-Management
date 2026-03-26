import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  user: any;
  userId: string | null;
  userName: string | null;
  email: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (data: { userId: string; userName: string; email: string; token: string }) => void;
  logout: () => void;
}

const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      userId: null,
      userName: null,
      email: null,
      accessToken: null,
      isAuthenticated: false,

      login: ({ userId, userName, email, token }) => {
        set({
          userId,
          userName,
          email,
          accessToken: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          userId: null,
          userName: null,
          email: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",

      onRehydrateStorage: () => (state) => {
        if (!state) return;

        if (state.accessToken && !state.userId) {
          const decoded = decodeToken(state.accessToken);

          if (decoded && (decoded.id || decoded.userId)) {
            const userId = decoded.id || decoded.userId;

            console.log("[AuthStore] Recovered userId:", userId);

            return {
              ...state,
              userId,
            };
          }
        }
      },
    }
  )
);