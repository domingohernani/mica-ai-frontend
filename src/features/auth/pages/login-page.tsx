import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const LoginPage = () => {
  const { loginWithRedirect, isLoading, logout, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isLoading) return; // wait until Auth0 finishes loading

    if (!isAuthenticated) {
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: import.meta.env["VITE_AUTH0_REDIRECT_URI"],
          audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
          scope: "openid profile email offline_access",
        },
      }); // triggers the redirect login
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return (
    <main className="flex flex-col items-center justify-center gap-6 p-6 bg-background min-h-svh md:p-10">
      Hello
      <button onClick={async () => await logout()} className="bg-red-300">
        Logout test
      </button>
    </main>
  );
};

export default LoginPage;
