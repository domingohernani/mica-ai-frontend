import { useAuth0 } from "@auth0/auth0-react";
import { useStore } from "@/stores/use-store";
import { useEffect, useEffectEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { api } from "./utils/axios";

function App() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } =
    useAuth0();
  const setToken = useStore((store) => store.setToken);
  const token = useStore((store) => store.token);
  const setUser = useStore((store) => store.setUser);

  // When the page load, get the access token from the auth0.
  // Then use zustand to store the token
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!isAuthenticated) return;

      try {
        // Get the access token
        const token: string = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
          },
        });
        // Set the token globally available
        setToken(token);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccessToken();
  }, [isAuthenticated, getAccessTokenSilently, setToken]);

  // Fetch user
  const fetchUser = useEffectEvent(async () => {
    // Ensure the user exist
    if (!user) return;

    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    // Run only when load finishes and when the token is ready
    if (isLoading || !token) return;

    // If not yet logged in, navigate to login page
    if (!isAuthenticated) navigate("/login", { replace: true });

    fetchUser();
  }, [isLoading, isAuthenticated, navigate, token]);

  return <Outlet />;
}

export default App;
