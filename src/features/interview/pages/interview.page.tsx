import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import axios from "axios";
import useError from "@/hooks/useError";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Mic,
  MicOff,
  AlertCircle,
  Video,
  Volume2,
  CircleDot,
  User,
  Briefcase,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PageHeader from "@/components/layout/page-header";
import MicaAi from "@/assets/logos/mica-ai-logo";

interface Question {
  _id: string;
  text: string;
  signedUrl: string;
}

// Mock data for applicant
const mockApplicant = {
  name: "John Doe",
  email: "john.doe@email.com",
  position: "Senior Frontend Developer",
  appliedDate: "Jan 15, 2024",
};

// Mock data for job description
const mockJobDescription = {
  title: "Senior Frontend Developer",
  department: "Engineering",
  location: "Remote",
  type: "Full-time",
};

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
          },
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
        },
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
    <section className="mx-auto max-w-7xl">
      {isAuthenticated ? (
        <>
          <section className="my-5">
            <MicaAi size={50} />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            {/* Video Section */}
            <div className="space-y-4 lg:col-span-1">
              {/* Video Card */}
              <Card className="p-4 overflow-hidden">
                <div className="relative aspect-3/4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ transform: "scaleX(-1)" }}
                    className="rounded-md"
                  />

                  {/* Applicant Information */}
                  <div className="py-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-primary/10">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-sm font-medium tracking-wide text-muted-foreground">
                          Applicant
                        </h3>
                        <p className="font-semibold truncate">
                          {mockApplicant.name}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="ml-2 font-medium truncate">
                          {mockApplicant.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Position:</span>
                        <span className="ml-2 font-medium truncate">
                          {mockApplicant.position}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Applied:</span>
                        <span className="font-medium">
                          {mockApplicant.appliedDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="py-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-primary/10">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1 text-sm font-medium tracking-wide text-muted-foreground">
                          Job Details
                        </h3>
                        <p className="font-semibold truncate">
                          {mockJobDescription.title}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Department:
                        </span>
                        <span className="font-medium">
                          {mockJobDescription.department}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">
                          {mockJobDescription.location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">
                          {mockJobDescription.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isRecording && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="gap-1.5">
                        <span className="flex w-2 h-2">
                          <span className="absolute inline-flex w-full h-full bg-white rounded-full opacity-75 animate-ping"></span>
                          <span className="relative inline-flex w-2 h-2 bg-white rounded-full"></span>
                        </span>
                        Recording
                      </Badge>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Question and Controls */}
            <div className="lg:col-span-2">
              {isReady ? (
                <>
                  {isUploading ? (
                    <Card className="p-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                        <p className="mb-1 text-lg font-medium">
                          Processing your response...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          This may take a moment
                        </p>
                      </div>
                    </Card>
                  ) : (
                    <>
                      {/* Question Card */}
                      <Card className="p-6">
                        <div className="mb-4">
                          <h2 className="mb-2 text-sm font-medium tracking-wide text-muted-foreground">
                            Interview Question
                          </h2>
                          <p className="text-2xl font-semibold leading-relaxed">
                            {question?.text}
                          </p>
                        </div>

                        {/* Audio Player */}
                        <div className="p-4 border rounded-lg bg-muted/50">
                          <audio controls autoPlay className="w-full">
                            <source
                              src={question?.signedUrl}
                              type="audio/mpeg"
                            />
                            <source
                              src={question?.signedUrl}
                              type="audio/ogg"
                            />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      </Card>

                      {/* Recording Controls */}
                      <Card className="p-5 mt-5">
                        <h3 className="text-lg font-semibold">
                          Your Response
                        </h3>
                        <div className="flex gap-3">
                          <Button
                            variant={"outline"}
                            onClick={handleStartRecordButton}
                            size="lg"
                            className="flex-1 gap-2"
                          >
                            <Mic className="w-5 h-5" />
                            Start Recording
                          </Button>
                          <Button
                            variant={"destructive"}
                            onClick={handleStopRecordButton}
                            size="lg"
                            className="flex-1 gap-2"
                          >
                            <MicOff className="w-5 h-5" />
                            Stop Recording
                          </Button>
                        </div>
                      </Card>

                      {/* Error Display */}
                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Card className="p-5">
                  <h2 className="text-2xl font-semibold">Ready to Begin?</h2>
                  <p className="text-muted-foreground">
                    Please ensure you're in a quiet environment before starting.
                  </p>

                  <div className="p-5 space-y-3 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Video className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Camera and microphone access
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Make sure your devices are working properly
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Volume2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Quiet environment</p>
                        <p className="text-sm text-muted-foreground">
                          Find a location with minimal background noise
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <CircleDot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Stable internet connection
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ensure you have reliable connectivity
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Mic className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          Recording starts automatically
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Recording will begin immediately after each question
                          plays
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant={"outline"}
                    onClick={() => setIsReady(true)}
                    size="lg"
                    className="w-full"
                  >
                    I'm Ready
                  </Button>
                </Card>
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h1 className="mb-2 text-2xl font-semibold">
              Authentication Required
            </h1>
            <p className="mb-6 text-muted-foreground">
              Please log in to access your interview session.
            </p>
            <Button asChild className="w-full">
              <a href="/login" className="underline">
                Go to log-in page
              </a>
            </Button>
          </Card>
        </div>
      )}
    </section>
  );
};

export default InterviewPage;
