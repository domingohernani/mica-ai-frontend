import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Video,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Share2,
  Mail,
  MoreVertical,
  ArrowLeft,
  Search,
  ChevronRight,
} from "lucide-react";

// Mock data structure
interface Candidate {
  id: string;
  name: string;
  role: string;
  totalScore: number;
  recommendation: "hire" | "no-hire" | "maybe";
  scoreCards: {
    communication: number;
    technical: number;
    problemSolving: number;
    cultureFit: number;
    leadership: number;
  };
  behavioralInsights: {
    strengths: string[];
    weaknesses: string[];
    redFlags: string[];
  };
  questions: Array<{
    id: string;
    question: string;
    answer: string;
    score: number;
    notes: string;
    videoUrl?: string;
    videoDuration?: string;
  }>;
  interviewDate: string;
  videoUrl?: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    role: "Senior Frontend Engineer",
    totalScore: 87,
    recommendation: "hire",
    scoreCards: {
      communication: 92,
      technical: 88,
      problemSolving: 85,
      cultureFit: 90,
      leadership: 80,
    },
    behavioralInsights: {
      strengths: [
        "Excellent communication skills with clear articulation of complex concepts",
        "Strong problem-solving approach with systematic thinking",
        "Demonstrated leadership experience in previous roles",
        "High cultural alignment with company values",
      ],
      weaknesses: [
        "Limited experience with backend technologies",
        "Could improve on handling ambiguous requirements",
        "Needs more exposure to large-scale system design",
      ],
      redFlags: [
        "Gap in employment history (6 months) - explained as sabbatical",
        "Left previous company after only 8 months - seeking better growth opportunities",
      ],
    },
    questions: [
      {
        id: "q1",
        question:
          "Describe a time when you had to debug a critical production issue.",
        answer:
          "In my previous role at TechCorp, we had a memory leak causing our application to crash during peak hours...",
        score: 9,
        notes:
          "Excellent systematic approach. Showed strong debugging methodology and communication with stakeholders.",
        videoUrl: "https://example.com/video1.mp4",
        videoDuration: "3:45",
      },
      {
        id: "q2",
        question: "How do you approach code reviews?",
        answer:
          "I believe code reviews are essential for maintaining code quality and knowledge sharing...",
        score: 8.5,
        notes:
          "Good understanding of collaborative development. Could elaborate more on handling disagreements.",
        videoUrl: "https://example.com/video2.mp4",
        videoDuration: "2:30",
      },
      {
        id: "q3",
        question:
          "Explain a technical decision you made that had significant impact.",
        answer:
          "When refactoring our component library, I proposed moving from CSS-in-JS to Tailwind...",
        score: 9,
        notes:
          "Strong technical judgment. Well-reasoned decision-making process with clear trade-off analysis.",
        videoUrl: "https://example.com/video3.mp4",
        videoDuration: "4:15",
      },
    ],
    interviewDate: "2024-02-10",
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "Backend Developer",
    totalScore: 92,
    recommendation: "hire",
    scoreCards: {
      communication: 85,
      technical: 95,
      problemSolving: 93,
      cultureFit: 88,
      leadership: 90,
    },
    behavioralInsights: {
      strengths: [
        "Exceptional technical depth in distributed systems",
        "Strong architectural thinking and system design skills",
        "Proven track record of mentoring junior developers",
        "Excellent problem-solving under pressure",
      ],
      weaknesses: [
        "Tends to over-engineer solutions occasionally",
        "Could improve presentation skills for non-technical stakeholders",
      ],
      redFlags: [],
    },
    questions: [
      {
        id: "q1",
        question: "How would you design a scalable API gateway?",
        answer:
          "I would start by considering the load patterns and latency requirements...",
        score: 9.5,
        notes:
          "Outstanding technical knowledge. Considered multiple trade-offs and edge cases.",
        videoUrl: "https://example.com/marcus-q1.mp4",
        videoDuration: "5:20",
      },
      {
        id: "q2",
        question: "Describe your experience with database optimization.",
        answer:
          "At my previous company, we had queries taking 30+ seconds to execute...",
        score: 9,
        notes:
          "Strong practical experience. Good understanding of indexing strategies and query optimization.",
        videoUrl: "https://example.com/marcus-q2.mp4",
        videoDuration: "4:10",
      },
    ],
    interviewDate: "2024-02-08",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Full Stack Developer",
    totalScore: 73,
    recommendation: "maybe",
    scoreCards: {
      communication: 78,
      technical: 75,
      problemSolving: 70,
      cultureFit: 80,
      leadership: 62,
    },
    behavioralInsights: {
      strengths: [
        "Good foundational knowledge across the stack",
        "Eager to learn and improve",
        "Positive attitude and team player",
      ],
      weaknesses: [
        "Limited experience with modern frontend frameworks",
        "Struggles with complex algorithmic problems",
        "Needs more experience with production systems",
        "Communication could be more concise",
      ],
      redFlags: ["Failed to answer basic React hooks question correctly"],
    },
    questions: [
      {
        id: "q1",
        question: "Explain the difference between REST and GraphQL.",
        answer: "REST is like a traditional API where you have endpoints...",
        score: 7,
        notes:
          "Basic understanding present but lacks depth. Could not explain advanced use cases.",
        videoUrl: "https://example.com/emily-q1.mp4",
        videoDuration: "2:45",
      },
      {
        id: "q2",
        question: "How do you handle state management in React?",
        answer: "I usually use useState and sometimes Redux...",
        score: 6.5,
        notes:
          "Surface-level knowledge. Struggled to explain when to use different state management solutions.",
        videoUrl: "https://example.com/emily-q2.mp4",
        videoDuration: "3:00",
      },
    ],
    interviewDate: "2024-02-09",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Senior Frontend Engineer",
    totalScore: 65,
    recommendation: "no-hire",
    scoreCards: {
      communication: 60,
      technical: 68,
      problemSolving: 65,
      cultureFit: 55,
      leadership: 70,
    },
    behavioralInsights: {
      strengths: [
        "Has experience with various technologies",
        "Confident in technical abilities",
      ],
      weaknesses: [
        "Poor communication and interpersonal skills",
        "Dismissive of questions and feedback",
        "Outdated knowledge of modern practices",
        "Lack of collaboration mindset",
      ],
      redFlags: [
        "Made dismissive comments about team processes",
        "Could not explain recent projects in detail",
        "Contradictory statements about experience level",
        "Negative attitude throughout interview",
      ],
    },
    questions: [
      {
        id: "q1",
        question: "How do you collaborate with designers?",
        answer:
          "I just implement what they give me. Usually they do not understand technical limitations...",
        score: 4,
        notes:
          "Concerning attitude. Shows lack of collaboration skills and empathy.",
        videoUrl: "https://example.com/david-q1.mp4",
        videoDuration: "1:50",
      },
      {
        id: "q2",
        question: "Describe a challenging bug you fixed.",
        answer:
          "There was this one bug... I cannot remember the details but it was complex...",
        score: 5,
        notes: "Vague and unconvincing. Could not provide concrete examples.",
        videoUrl: "https://example.com/david-q2.mp4",
        videoDuration: "2:15",
      },
    ],
    interviewDate: "2024-02-07",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    role: "UI/UX Designer",
    totalScore: 89,
    recommendation: "hire",
    scoreCards: {
      communication: 94,
      technical: 82,
      problemSolving: 88,
      cultureFit: 92,
      leadership: 89,
    },
    behavioralInsights: {
      strengths: [
        "Outstanding portfolio with diverse projects",
        "Excellent understanding of user-centered design",
        "Strong communication and presentation skills",
        "Good technical knowledge of frontend implementation",
      ],
      weaknesses: [
        "Limited experience with design systems at scale",
        "Could improve data-driven decision making",
      ],
      redFlags: [],
    },
    questions: [
      {
        id: "q1",
        question: "Walk us through your design process.",
        answer:
          "I start with user research and understanding the problem space...",
        score: 9,
        notes:
          "Comprehensive and well-structured approach. Shows user empathy and systematic thinking.",
        videoUrl: "https://example.com/lisa-q1.mp4",
        videoDuration: "4:30",
      },
      {
        id: "q2",
        question: "How do you handle disagreements with stakeholders?",
        answer:
          "I believe in advocating for the user while being open to business constraints...",
        score: 9.5,
        notes:
          "Excellent balance of assertiveness and collaboration. Mature approach to conflict resolution.",
        videoUrl: "https://example.com/lisa-q2.mp4",
        videoDuration: "3:20",
      },
    ],
    interviewDate: "2024-02-11",
  },
];

const HiringInterviewResultsPage = () => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [scoreFilter, setScoreFilter] = useState("All Scores");

  const candidate =
    mockCandidates.find((c) => c.id === selectedCandidateId) ||
    mockCandidates[0];

  // Get unique roles for filter
  const roles = [
    "All Roles",
    ...Array.from(new Set(mockCandidates.map((c) => c.role))),
  ];

  // Filter candidates based on search and filters
  const filteredCandidates = mockCandidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || c.role === roleFilter;
    const matchesScore =
      scoreFilter === "All Scores" ||
      (scoreFilter === "90+" && c.totalScore >= 90) ||
      (scoreFilter === "80-89" && c.totalScore >= 80 && c.totalScore < 90) ||
      (scoreFilter === "70-79" && c.totalScore >= 70 && c.totalScore < 80) ||
      (scoreFilter === "Below 70" && c.totalScore < 70);
    return matchesSearch && matchesRole && matchesScore;
  });

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "hire":
        return "bg-green-100 text-green-800 border-green-300";
      case "no-hire":
        return "bg-red-100 text-red-800 border-red-300";
      case "maybe":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case "hire":
        return <CheckCircle2 className="w-4 h-4" />;
      case "no-hire":
        return <XCircle className="w-4 h-4" />;
      case "maybe":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed interview breakdowns, scoring metrics, and behavioral
          insights for each candidate.
        </p>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Score Filter */}
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Scores">All Scores</SelectItem>
                <SelectItem value="90+">90+ (Excellent)</SelectItem>
                <SelectItem value="80-89">80-89 (Good)</SelectItem>
                <SelectItem value="70-79">70-79 (Fair)</SelectItem>
                <SelectItem value="Below 70">Below 70</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Candidate List */}
          {filteredCandidates.length > 0 && (
            <div className="mt-4">
              <p className="mb-3 text-sm text-muted-foreground">
                {filteredCandidates.length} candidate
                {filteredCandidates.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCandidateId(c.id)}
                    className={`text-left p-3 rounded-md border transition-colors ${
                      c.id === selectedCandidateId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{c.name}</p>
                        <p className="text-sm truncate text-muted-foreground">
                          {c.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="secondary"
                          className={getRecommendationColor(c.recommendation)}
                        >
                          {c.totalScore}
                        </Badge>
                        {c.id === selectedCandidateId && (
                          <ChevronRight className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCandidates.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No candidates found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">
              {candidate.name}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {candidate.role} • Interviewed on{" "}
            {new Date(candidate.interviewDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Email Candidate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold">{candidate.totalScore}</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Overall Score
                </p>
              </div>
              <div className="w-px h-16 bg-border" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Recommendation
                </p>
                <Badge
                  variant="secondary"
                  className={`${getRecommendationColor(candidate.recommendation)} text-sm`}
                >
                  {getRecommendationIcon(candidate.recommendation)}
                  {candidate.recommendation === "hire"
                    ? "Strong Hire"
                    : candidate.recommendation === "no-hire"
                      ? "No Hire"
                      : "Maybe"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Move to Next Round
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Follow-up
              </Button>
              <Button variant="outline">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left Column - Interview Details */}
        <div className="space-y-5 lg:col-span-2">
          {/* Score Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Scores</CardTitle>
              <CardDescription>
                Performance across key competencies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(candidate.scoreCards).map(([category, score]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span
                      className={`text-sm font-semibold ${getScoreColor(score)}`}
                    >
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Interview Q&A */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions & Responses</CardTitle>
              <CardDescription>
                Video responses with AI-generated transcript and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidate.questions.map((q) => (
                  <Collapsible
                    key={q.id}
                    open={expandedQuestions.has(q.id)}
                    onOpenChange={() => toggleQuestion(q.id)}
                  >
                    <Card className="border hover:bg-muted/50">
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="transition-colors cursor-pointer">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start flex-1 gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 bg-primary/10">
                                <Video className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1 text-left">
                                <CardTitle className="text-sm font-medium">
                                  {q.question}
                                </CardTitle>
                                {q.videoDuration && (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Duration: {q.videoDuration}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="secondary">{q.score}/10</Badge>
                              {expandedQuestions.has(q.id) ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-4">
                          {/* Video Player */}
                          {q.videoUrl && (
                            <div className="overflow-hidden border rounded-md">
                              <div className="flex items-center justify-center rounded-md aspect-video bg-muted">
                                <div className="text-center text-muted-foreground">
                                  <Video className="w-12 h-12 mx-auto mb-2" />
                                  <p className="text-sm">Video Recording</p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {q.videoDuration}
                                  </p>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                  >
                                    Play Video
                                  </Button>
                                </div>
                              </div>
                              {/* Replace the placeholder above with actual video player when integrating */}
                              {/* <video 
                                controls 
                                className="w-full"
                                src={q.videoUrl}
                              >
                                Your browser does not support the video tag.
                              </video> */}
                            </div>
                          )}

                          {/* Transcript */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-muted-foreground" />
                              <p className="text-xs font-medium text-muted-foreground">
                                AI-Generated Transcript
                              </p>
                            </div>
                            <p className="text-sm leading-relaxed">
                              {q.answer}
                            </p>
                          </div>

                          {/* AI Analysis */}
                          <div className="p-3 border rounded-md bg-muted/50">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <p className="text-xs font-medium">AI Analysis</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {q.notes}
                            </p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-5">
          {/* Behavioral Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>
                Behavioral analysis and observations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Strengths */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                    <TrendingUp className="w-3 h-3 text-green-700" />
                  </div>
                  <h3 className="text-sm font-semibold">Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {candidate.behavioralInsights.strengths.map(
                    (strength, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="mt-1.5 block h-1 w-1 rounded-full bg-green-600 shrink-0" />
                        <span className="text-muted-foreground">
                          {strength}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded-full">
                    <TrendingDown className="w-3 h-3 text-yellow-700" />
                  </div>
                  <h3 className="text-sm font-semibold">
                    Areas for Development
                  </h3>
                </div>
                <ul className="space-y-2">
                  {candidate.behavioralInsights.weaknesses.map(
                    (weakness, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="mt-1.5 block h-1 w-1 rounded-full bg-yellow-600 shrink-0" />
                        <span className="text-muted-foreground">
                          {weakness}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>

              {/* Red Flags */}
              {candidate.behavioralInsights.redFlags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                      <AlertTriangle className="w-3 h-3 text-red-700" />
                    </div>
                    <h3 className="text-sm font-semibold">Red Flags</h3>
                  </div>
                  <ul className="space-y-2">
                    {candidate.behavioralInsights.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="mt-1.5 block h-1 w-1 rounded-full bg-red-600 shrink-0" />
                        <span className="text-muted-foreground">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Questions Asked
                </span>
                <span className="font-semibold">
                  {candidate.questions.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg Response Score
                </span>
                <span className="font-semibold">
                  {(
                    candidate.questions.reduce((acc, q) => acc + q.score, 0) /
                    candidate.questions.length
                  ).toFixed(1)}
                  /10
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-semibold">45 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Interview Type
                </span>
                <span className="font-semibold">Technical</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HiringInterviewResultsPage;
