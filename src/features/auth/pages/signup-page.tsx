import SignupForm from "@/features/auth/components/signup-form";

const SignupPage = () => {
  return (
    <main className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </main>
  );
};

export default SignupPage;
