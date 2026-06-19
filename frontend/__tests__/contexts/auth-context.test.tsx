// react
import { act, renderHook } from "@testing-library/react";

// contexts
import { AuthProvider, useAuth } from "@/contexts/auth-context";

// types
import type { AuthUser } from "@/contexts/auth-context";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const mockUser: AuthUser = {
  userId: "user-123",
  name: "Samuel Brito",
  email: "samuel@example.com",
  isPremium: false,
};

describe("auth-context", () => {
  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  describe("dispatch LOGIN", () => {
    it("define state.user com os dados corretos após LOGIN", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.dispatch({ type: "LOGIN", payload: mockUser });
      });

      expect(result.current.state.user).toEqual(mockUser);
    });

    it("sobrescreve usuário existente ao fazer novo LOGIN", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.dispatch({ type: "LOGIN", payload: mockUser });
      });

      const newUser: AuthUser = { ...mockUser, userId: "user-456", name: "Outro User" };

      act(() => {
        result.current.dispatch({ type: "LOGIN", payload: newUser });
      });

      expect(result.current.state.user).toEqual(newUser);
    });
  });

  describe("dispatch LOGOUT", () => {
    it("define state.user como null após LOGOUT", () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.dispatch({ type: "LOGIN", payload: mockUser });
      });

      act(() => {
        result.current.dispatch({ type: "LOGOUT" });
      });

      expect(result.current.state.user).toBeNull();
    });
  });

  describe("useAuth fora do provider", () => {
    it("lança erro quando usado fora do AuthProvider", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => renderHook(() => useAuth())).toThrow(
        "useAuth must be used within AuthProvider."
      );

      consoleSpy.mockRestore();
    });
  });
});
