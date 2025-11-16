import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Input } from "./components/ui/input";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generateQuestion = async (): Promise<void | null> => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:3000/api/interview/6918c0d857b8a755b90f9025/question"
        );

        if (data.isDone) {
          setQuestion(data.finalMessage);
        } else {
          setQuestion(data.aiQuestion);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    generateQuestion();
  }, []);

  // const handleResponse = async (e: FormEvent): Promise<void> => {
  //   e.preventDefault();

  //   try {
  //     const currentConvoIndex =
  //       conversation.length > 0 ? conversation.length - 1 : 0;

  //     if (!conversation[currentConvoIndex]) return;
  //     if (!questions[currentQIndex]) return;

  //     const newConvo = conversation.map(
  //       (interaction: Interaction, index: number) =>
  //         currentConvoIndex === index
  //           ? { ...interaction, answer: answer }
  //           : interaction
  //     );
  //     setConversation(newConvo);
  //     setCurrentQIndex((prev: number) => prev + 1);

  //     const systemPrompt = `
  //     You are Mica, an AI interviewer continuing a professional job interview.

  //     1. Read the applicant’s current answer carefully.
  //     2. Provide a short, friendly acknowledgment that shows you understood their response.
  //     3. Include a brief comment that recognizes the applicant’s thought, experience, or perspective.
  //     4. Then, smoothly ask the next interview question provided below.
  //     5. Keep your tone professional, polite, and conversational—like a real interviewer continuing an ongoing discussion.
  //     6. Do not restart the interview or use filler phrases like “Okay, let’s begin,” “Alright, let’s continue,” or “Let’s do this.” Simply respond naturally as part of the flow.
  //     7. Keep it concise and relevant to their answer.

  //     Current Question: ${conversation[currentConvoIndex].originalQuestion}
  //     Candidate’s Answer: ${answer}
  //     Next Question: ${questions[currentConvoIndex + 1]}
  //     `;

  //     setLoading(true);
  //     const { data } = await axios.post("http://localhost:3000/api/llm", {
  //       model: "gemma3:4b",
  //       prompt: systemPrompt,
  //       stream: false,
  //     });

  //     const interaction: Interaction = {
  //       originalQuestion: questions[currentQIndex],
  //       aiQuestion: data.response,
  //       answer: "",
  //     };
  //     setConversation((prev) => [...prev, interaction]);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

      {/* <section>
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
      </form> */}

      <section>{loading ? "Loading..." : question}</section>
    </section>
  );
}

export default App;
