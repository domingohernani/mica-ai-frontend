import { Spinner } from "@/components/ui/spinner";
import { useStore } from "@/stores/use-store";
import type { User } from "@/types/user.type";
import { api } from "@/utils/axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useEffectEvent } from "react";
import { useNavigate } from "react-router-dom";
import EmailSentIllustation from "../assets/illustrations/email-sent-illustration";
import { FieldDescription } from "@/components/ui/field";
import CelebrationIllustration from "@/assets/illustrations/celebration-illustration";
import MissingIllustration from "@/assets/illustrations/missing-illustration";

const CallbackPage = () => {
  const { isLoading, user, getAccessTokenSilently } = useAuth0();
  const token = useStore((store) => store.token);
  const navigate = useNavigate();

  // Register user
  const onRegisterUser = useEffectEvent(async () => {
    if (!isLoading && user?.email_verified) {
      // Ensure user properties are valid
      if (
        !user.sub ||
        !user.given_name ||
        !user.family_name ||
        !user.email ||
        !user.email_verified ||
        !user.picture
      )
        return;

      try {
        // Create user payload; for registration
        const newUser: User = {
          sub: user.sub,
          firstName: user.given_name,
          lastName: user.family_name,
          email: user.email,
          isVerified: user.email_verified,
          profileUrl: user.picture,
        };

        // Create user account
        const { data: userData } = await api.post("/users", newUser);

        // Checking user's organization
        if (userData.isVerified) {
          const { data: organizationData } = await api.get(
            `organizations/user/${userData._id}`,
          );
          // If the user has no organization, navigate to onboarding
          if (!organizationData.length) {
            navigate("/onboard");
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  // Triggers when user goes to other tab to check the link
  // sent by Auth0 for user verification
  const onVisibilityChange = useEffectEvent(async () => {
    const isBack = document.visibilityState === "visible";
    if (isBack && !user?.email_verified) {
      await getAccessTokenSilently({ cacheMode: "off" });
    }
  });

  useEffect(() => {
    if (token) {
      onRegisterUser();
    }
  }, [isLoading, user, token]);

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [user]);

  return (
    <main>
      {isLoading ? (
        <section className="grid min-h-screen place-items-center">
          <Spinner className="size-6" />
        </section>
      ) : (
        <section>
          {user ? (
            <div>
              {user?.email_verified ? (
                <section className="flex flex-row-reverse justify-center w-10/12 h-screen gap-3 py-10 mx-auto max-w-400rem">
                  <section className="justify-end hidden rotate-y-180 lg:flex max-w-160">
                    <div>
                      <CelebrationIllustration />
                    </div>
                  </section>
                  <section className="flex flex-col justify-center flex-1 gap-2 max-w-160">
                    <h1 className="text-xl font-bold">Email Verified</h1>
                    <FieldDescription>
                      Your email has been <strong>successfully verified</strong>
                      . You may now return to the homepage.
                    </FieldDescription>

                    <a href="/" className="text-sm font-medium underline">
                      Go back to home
                    </a>
                  </section>
                </section>
              ) : (
                <section className="flex flex-row-reverse justify-center w-10/12 h-screen gap-3 py-10 mx-auto max-w-400rem">
                  <section className="justify-end hidden rotate-y-180 md:flex max-w-160">
                    <div>
                      <EmailSentIllustation />
                    </div>
                  </section>
                  <section className="flex flex-col justify-center flex-1 gap-2 max-w-160">
                    <h1 className="text-xl font-bold">Verify Your Email</h1>
                    <FieldDescription>
                      A verification link has been{" "}
                      <strong>sent to your email</strong>. You must confirm your
                      email before you can create an organization. After
                      <strong> clicking the link</strong>, return to this page
                      to continue.
                    </FieldDescription>
                  </section>
                </section>
              )}
            </div>
          ) : (
            <section className="flex flex-row-reverse justify-center w-10/12 h-screen gap-3 py-10 mx-auto max-w-400rem">
              <section className="justify-end hidden rotate-y-180 lg:flex max-w-160">
                <div>
                  <MissingIllustration />
                </div>
              </section>
              <section className="flex flex-col justify-center flex-1 gap-2 max-w-160">
                <h1 className="text-xl font-bold">Not Authenticated</h1>
                <FieldDescription>
                  You are not logged in. Please log in to continue and access
                  your account.
                </FieldDescription>

                <a href="/login" className="text-sm font-medium underline">
                  Go to Login
                </a>
              </section>
            </section>
          )}
        </section>
      )}
    </main>
  );
};

export default CallbackPage;
