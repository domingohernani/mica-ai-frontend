import { Button } from "@/components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
} from "react";
import axios from "axios";
import { Input } from "./components/ui/input";
import { useReactMediaRecorder } from "react-media-recorder";
import useError from "./hooks/useError";

interface Question {
  _id: string;
  text: string;
  signedUrl: string;
}

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={500} height={500} autoPlay controls />;
};

function App() {
  const [question, setQuestion] = useState<Question>();

  // Condition states
  const [ready, setReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, setError } = useError();

  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream } =
    useReactMediaRecorder({
      video: {
        width: 1280,
        height: 720,
        frameRate: 24,
      },
      audio: true,
      blobPropertyBag: { type: "video/webm; codecs=vp8" },
    });

  const handleReadyBtn = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setReady(true);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  // Side effect runs if the stop button is clicked
  const onAnswer = useEffectEvent(async () => {
    // Return if the blob url is false
    if (!mediaBlobUrl) return;

    console.log("onAnswer was called");

    // blob url -> blob -> actual file (mp4)
    const fetchedMedia = await fetch(mediaBlobUrl);
    const blob: Blob = await fetchedMedia.blob();
    const blobMp4 = new File([blob], "video", { type: "video/mp4" });

    const mediaData = new FormData();
    mediaData.append("video", blobMp4);

    try {
      setLoading(true);
      const { data } = await axios.patch(
        `http://localhost:3000/api/interviews/692327f99b924533a2077848/questions/${question?._id}`,
        mediaData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Convert to Question interface
      const newQestion: Question = {
        _id: data._id,
        signedUrl:
          "isDone" in data ? data.finalTtsSignedUrl : data.aiTtsSignedUrl,
        text: "isDone" in data ? data.finalMessage : data.aiQuestion,
      };
      setQuestion(newQestion);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (status === "stopped") onAnswer();
  }, [status]);

  useEffect(() => {
    // Fetch the current unanswered question
    const fetchCurrentQuestion = async (): Promise<void | null> => {
      console.log("hello");

      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:3000/api/interviews/692327f99b924533a2077848/questions"
        );
        // Convert to Question interface
        const question: Question = {
          _id: data._id,
          signedUrl:
            "isDone" in data ? data.finalTtsSignedUrl : data.aiTtsSignedUrl,
          text: "isDone" in data ? data.finalMessage : data.aiQuestion,
        };
        setQuestion(question);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
        setLoading(false);
      }
    };
    fetchCurrentQuestion();
  }, [setError]);

  return (
    <section>
      <ModeToggle />

      <p>{error}</p>

      {ready ? (
        <>
          {loading ? (
            <h1>Mica is preparing her notes...</h1>
          ) : (
            <section>
              <section>
                <audio controls autoPlay>
                  <source src={question?.signedUrl} type="audio/mpeg" />
                  <source src={question?.signedUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>

                <p>{status}</p>
                <h1>{question?.text}</h1>
              </section>

              <Button variant={"outline"} onClick={startRecording}>
                Record
              </Button>
              <Button variant={"destructive"} onClick={stopRecording}>
                Stop
              </Button>

              <h1>Url: {mediaBlobUrl}</h1>

              <Button
                variant={"outline"}
                // onClick={() => handleDisplayBtn(mediaBlobUrl)}
              >
                Display Data
              </Button>

              {status === "recording" && (
                <VideoPreview stream={previewStream} />
              )}

              {status === "stopped" && (
                <video src={mediaBlobUrl} controls autoPlay loop></video>
              )}
            </section>
          )}
        </>
      ) : (
        <>
          <h1>Are you ready?</h1>
          <Button variant="outline" onClick={handleReadyBtn}>
            Ready
          </Button>
        </>
      )}

      {/* <div>
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
       
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

      {/* <section>{loading ? "Loading..." : interview?.aiQuestion}</section>

      {interview?.aiTtsSignedUrl && ready && (
        <audio controls autoPlay>
          <source src={interview?.aiTtsSignedUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )} */}
    </section>
  );
}

export default App;
