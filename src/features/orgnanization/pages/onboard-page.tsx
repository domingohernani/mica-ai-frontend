import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import OnboardIllustration from "../assets/illustrations/onboard-illustration";
import { api } from "@/utils/axios";
import { useNavigate } from "react-router-dom";

const OnboardPage = () => {
  const navigate = useNavigate();
  const [organization, setOrganization] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      // Create organization
      const { data } = await api.post("/organizations", {
        name: organization.trim(),
      });

      if (data) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      {loading ? (
        <section className="grid min-h-screen place-items-center">
          <Spinner className="size-6" />
        </section>
      ) : (
        <section className="flex justify-center w-10/12 h-screen gap-3 py-10 mx-auto max-w-400rem">
          <section className="flex-1 hidden md:block max-w-160">
            <OnboardIllustration />
          </section>
          <section className="flex flex-col justify-center flex-1 max-w-160">
            <form onSubmit={handleOnSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex flex-col items-center gap-2 font-medium">
                    <div className="flex items-center justify-center rounded-md size-8"></div>
                  </div>
                  <h1 className="text-xl font-bold">
                    Create Your Organization
                  </h1>
                  <FieldDescription>
                    Set up your organization so you can start managing your team
                    and running smart interviews.
                  </FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="organization">
                    Organization Name
                  </FieldLabel>
                  <Input
                    id="organization"
                    type="text"
                    required
                    placeholder="eg., Mica AI"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={loading}>
                    Create
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </section>
        </section>
      )}
    </main>
  );
};

export default OnboardPage;
