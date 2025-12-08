import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useEffectEvent } from "react";

const LoginPage = () => {
  const { loginWithRedirect, isLoading, logout, isAuthenticated } = useAuth0();

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const token = await getAccessTokenSilently({
  //         authorizationParams: {
  //           audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
  //         },
  //       });
  //       console.log("Token:", token);
  //       // Now you can send it to your backend
  //       const { data } = await axios.post("http://localhost:3000/api/auth", {
  //         token,
  //       });
  //       console.log(data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  //   if (isAuthenticated) fetchToken();
  // }, [isAuthenticated, getAccessTokenSilently]);

  // const onLoginEvent = useEffectEvent(() => {
  //   loginWithRedirect();
  // });

  // useEffect(() => {
  //   if (!isLoading) return;

  //   if (isAuthenticated) {
  //     window.location.href = "auth/callback";
  //   }

  //   if (!isAuthenticated) loginWithRedirect();
  // }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return; // wait until Auth0 finishes loading

    if (!isAuthenticated) {
      loginWithRedirect(); // triggers the redirect login
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  return (
    <main className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      Hello
      <button onClick={async () => await logout()} className="bg-red-300">
        Logout test
      </button>
    </main>
  );
};

export default LoginPage;
