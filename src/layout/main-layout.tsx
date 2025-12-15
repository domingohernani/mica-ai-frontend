import MicaAi from "@/assets/logos/mica-ai-logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import InterviewPage from "@/features/interview/pages/interview-page";

const MainLayout = () => {
  return (
    <main>
      <section>
        <MicaAi size={50} />
      </section>
      <ModeToggle />
      <InterviewPage />
    </main>
  );
};

export default MainLayout;
