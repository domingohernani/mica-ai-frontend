import MicaAi from "@/assets/logos/mica-ai-logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import InterviewPage from "@/features/interview/pages/interview-page";

const MainLayout = () => {
  return (
    <main className="grid grid-cols-4 grid-rows-3 gap-4 bg-red-300">
      <section className="col-span-4 col-start-1 bg-blue-300">
        <MicaAi size={50} />
        <ModeToggle />
      </section>
      <section className="row-span-2 col-start-1 row-start-2 bg-green-300">2</section>
      <section className="col-span-3 row-span-2 col-start-2 row-start-2 bg-yellow-50">
        2
      </section>

      {/* <InterviewPage /> */}
    </main>
  );
};

export default MainLayout;
