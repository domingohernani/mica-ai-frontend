import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Input } from "./components/ui/input";

function App() {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  interface Interaction {
    originalQuestion: string;
    aiQuestion: string;
    answer: string;
  }
  const [conversation, setConversation] = useState<Interaction[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  const questions = [
    "Can you tell me a bit about yourself and your background?",
    "What's a project or accomplishment you're most proud of?",
    "How do you usually approach solving problems or challenges?",
    "Can you describe a time you worked as part of a team?",
    "What are your goals for the next few years?",
  ];

  useEffect(() => {
    const generateQuestion = async (): Promise<void | null> => {
      try {
        console.log("Fetch!");

        setLoading(true);
        const systemPrompt = `
        You are Mica, an AI interviewer conducting a professional job interview.

        1. Start with a polite and friendly greeting that helps the applicant feel comfortable.
        2. Introduce yourself briefly as the interviewer and explain that you'll be asking a few questions to learn more about their background and experience.
        3. Then, naturally transition into the first interview question below—avoid filler like “Okay, let’s start” or “Let’s begin.”
        4. Keep your tone warm, professional, and conversational, like a human interviewer.
        5. Don’t give any feedback or opinions yet, since this is just the start of the interview.

        First Question: ${questions[currentQIndex]}
        `;

        const { data } = await axios.post("http://localhost:3000/api/llm", {
          model: "gemma3:4b",
          prompt: systemPrompt,
          stream: false,
        });
        const question = questions[currentQIndex];
        if (!question) return null;

        const interaction: Interaction = {
          originalQuestion: question,
          aiQuestion: data.response,
          answer: "",
        };
        setConversation(() => [interaction]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    generateQuestion();
  }, []);

  const handleResponse = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const currentConvoIndex =
        conversation.length > 0 ? conversation.length - 1 : 0;

      if (!conversation[currentConvoIndex]) return;
      if (!questions[currentQIndex]) return;

      const newConvo = conversation.map(
        (interaction: Interaction, index: number) =>
          currentConvoIndex === index
            ? { ...interaction, answer: answer }
            : interaction
      );
      setConversation(newConvo);
      setCurrentQIndex((prev: number) => prev + 1);

      const systemPrompt = `
      You are Mica, an AI interviewer continuing a professional job interview.

      1. Read the applicant’s current answer carefully.
      2. Provide a short, friendly acknowledgment that shows you understood their response.
      3. Include a brief comment that recognizes the applicant’s thought, experience, or perspective.
      4. Then, smoothly ask the next interview question provided below.
      5. Keep your tone professional, polite, and conversational—like a real interviewer continuing an ongoing discussion.
      6. Do not restart the interview or use filler phrases like “Okay, let’s begin,” “Alright, let’s continue,” or “Let’s do this.” Simply respond naturally as part of the flow.
      7. Keep it concise and relevant to their answer.

      Current Question: ${conversation[currentConvoIndex].originalQuestion}
      Candidate’s Answer: ${answer}
      Next Question: ${questions[currentConvoIndex + 1]}
      `;

      setLoading(true);
      const { data } = await axios.post("http://localhost:3000/api/llm", {
        model: "gemma3:4b",
        prompt: systemPrompt,
        stream: false,
      });

      const interaction: Interaction = {
        originalQuestion: questions[currentQIndex],
        aiQuestion: data.response,
        answer: "",
      };
      setConversation((prev) => [...prev, interaction]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <ModeToggle />
      {/* <div>
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant={"outline"} onClick={handleBtnClick}>
          Send
        </Button>
      </div> */}

      <section>
        <p>Current Index: {currentQIndex}</p>
      </section>

      {loading ? (
        "Loading..."
      ) : (
        <section>
          {conversation.map((interaction) => {
            return (
              <div>
                <div>
                  <strong> Mica:</strong> <span>{interaction.aiQuestion}</span>
                </div>
                <div>
                  <strong> You:</strong> <span>{interaction.answer || ""}</span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <form onSubmit={handleResponse}>
        <Input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <Button variant={"outline"} type="submit">
          Send
        </Button>
      </form>
    </section>
  );
}

export default App;
