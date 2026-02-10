import { Button } from "@/components/ui/button";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import axios from "axios";
import useError from "@/hooks/useError";
import { useAuth0 } from "@auth0/auth0-react";

interface Question {
  _id: string;
  text: string;
  signedUrl: string;
}

const InterviewPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
            scope: "openid profile email offline_access",
          },
        });
        // Now you can send it to your backend
        const { data } = await axios.post("http://localhost:3000/api/auth", {
          token,
        });
        console.log(data.token);
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    };

    console.log(isAuthenticated);

    if (isAuthenticated) fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // For Recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastChunkRef = useRef<boolean>(false);
  const chunkNumberRef = useRef(0);

  // State values
  const [question, setQuestion] = useState<Question>();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { error, setError } = useError();

  const handleStopRecordButton = () => {
    lastChunkRef.current = true;
    setIsUploading(true);
    mediaRecorderRef.current?.stop();
  };

  const handleStartRecordButton = async () => {
    if (!question?._id || !streamRef.current) return;

    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm; codecs=vp8",
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size === 0) return;
      setIsRecording(true);
      const isLastChunk = lastChunkRef.current;
      const formData = new FormData();
      formData.append("chunk", event.data);
      formData.append("chunkNumber", chunkNumberRef.current.toString());
      formData.append("isLastChunk", String(isLastChunk));

      try {
        const { data } = await axios.post(
          `http://localhost:3000/api/interviews/6989fcbfc80f4653dd8fb102/questions/${question?._id}/chunk`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const newQestion: Question = {
          _id: data._id,
          signedUrl:
            "isDone" in data ? data.finalTtsSignedUrl : data.aiTtsSignedUrl,
          text: "isDone" in data ? data.finalMessage : data.aiQuestion,
        };
        if (isLastChunk) setQuestion(newQestion);
        chunkNumberRef.current++;
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        if (isLastChunk) {
          setIsUploading(false);
          setIsRecording(false);
          lastChunkRef.current = false;
        }
      }
    };
    mediaRecorder.start(1000);
  };

  const initMediaRecorder = useEffectEvent(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError(error);
    }
  });

  const fetchCurrentQuestion = useEffectEvent(async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env["VITE_AUTH0_AUDIENCE"],
          scope: "openid profile email offline_access",
        },
      });
      const { data } = await axios.get(
        "http://localhost:3000/api/interviews/6989fcbfc80f4653dd8fb102/questions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Convert to Question interface
      const question: Question = {
        _id: data._id,
        signedUrl:
          "isDone" in data ? data.finalTtsSignedUrl : data.aiTtsSignedUrl,
        text: "isDone" in data ? data.finalMessage : data.aiQuestion,
      };
      console.log(question);
      setQuestion(question);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  });

  useEffect(() => {
    // Init recording
    initMediaRecorder();
  }, []);

  useEffect(() => {
    // Fetch the current unanswered question
    if (isAuthenticated) fetchCurrentQuestion();
  }, [isAuthenticated]);

  return (
    <section>
      {isAuthenticated ? (
        <>
          <section>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "300px", background: "#000" }}
            />
          </section>

          <section>
            {isReady ? (
              <section>
                {isRecording && <p>Recording...</p>}

                {isUploading ? (
                  "Uploading..."
                ) : (
                  <section>
                    <audio controls autoPlay>
                      <source src={question?.signedUrl} type="audio/mpeg" />
                      <source src={question?.signedUrl} type="audio/ogg" />
                      Your browser does not support the audio element.
                    </audio>

                    <Button
                      variant={"outline"}
                      onClick={handleStartRecordButton}
                    >
                      Record
                    </Button>
                    <Button
                      variant={"destructive"}
                      onClick={handleStopRecordButton}
                    >
                      Stop
                    </Button>

                    <h1>{question?.text}</h1>

                    <p>{error}</p>
                  </section>
                )}
              </section>
            ) : (
              <section>
                Are you ready?
                <Button variant={"outline"} onClick={() => setIsReady(true)}>
                  I'm Ready
                </Button>
              </section>
            )}
          </section>
        </>
      ) : (
        <section>
          Unauthenticated
          <p>
            <a href="/login" className="underline">
              Go to log-in page
            </a>
          </p>
        </section>
      )}
    </section>
  );
};

export default InterviewPage;
