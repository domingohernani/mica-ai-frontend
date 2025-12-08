import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const CallbackPage = () => {
  const { isLoading, user } = useAuth0();

  useEffect(() => {
    // Auth0Provider handles redirect automatically.
    // When loading finishes, you redirect wherever you want.
    // if (!isLoading) window.location.replace("/");

    if (!isLoading) {
      console.log(isLoading);
      console.log(user);
    }
  }, [isLoading, user]);

  return <div>Hello</div>;
};

export default CallbackPage;
