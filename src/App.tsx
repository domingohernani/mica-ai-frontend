import { useAuth0 } from "@auth0/auth0-react";
import { useStore } from "@/stores/use-store";
import { useEffect, useEffectEvent } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { api } from "./utils/axios";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } =
    useAuth0();

  // Tokens
  const setToken = useStore((store) => store.setToken);
  const token = useStore((store) => store.token);

  // For User
  const setUser = useStore((store) => store.setUser);
  const userStore = useStore((store) => store.user);

  // For organizations
  const setOrganizations = useStore((store) => store.setOrganizations);
  const setCurrentOrganizationId = useStore(
    (store) => store.setCurrentOrganizationId,
  );

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
        // TODO: remove in production
        console.log(token);

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

  const fetchOrganization = useEffectEvent(async () => {
    // Ensure the user (global state/zustand) exist
    if (!userStore) return;

    try {
      const { data } = await api.get(`/organizations/user/${userStore.id}`);
      setOrganizations(data);
      setCurrentOrganizationId(data[0].id);
    } catch (error) {
      console.error(error);
    }
  });

  // Fetching users' organization
  useEffect(() => {
    if (!userStore) return;

    fetchOrganization();
  }, [userStore]);

  return (
    <>
      <Toaster position="top-center" />
      <Outlet />
    </>
  );
}

export default App;
