import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Image, Star, Award, Rocket, CheckCircle, Wand2, ChevronLeft, ChevronRight, ArrowRight, Loader2, Calendar, Filter, Sparkles, BookOpen, Trophy, Target, Gift, Flame, Compass, Users, Palette } from "lucide-react";
import { api } from "@/lib/api";
import { parseImageData } from "@/lib/utils";
import { achievementStorage, type UserAchievement, type UserStats } from "@/lib/achievement-storage";
import type { ImageRecord } from "@/types/api";
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const inspirationArtworks = [{
  id: 1,
  title: "Innocence Under Siege",
  artist: "Waleed Ajmal",
  grade: "Grade IS2A",
  imageUrl: "https://i.ibb.co/Fk1fHsXF/0-0.jpg"
}, {
  id: 2,
  title: "Duty and Destruction",
  artist: "Shaheer Afzal",
  grade: "Grade IS2A",
  imageUrl: "https://i.ibb.co/m5JPMRGm/0-3-3.jpg"
}, {
  id: 3,
  title: "Honor in the Arena",
  artist: "Mansoor Ahmed Toor",
  grade: "Grade IS2A",
  imageUrl: "https://i.ibb.co/vv1LQqZw/0-1.jpg"
}];
const features = [{
  icon: <Image className="w-6 h-6 text-primary" />,
  title: "Showcase Your Art",
  description: "Share your creative work with the school community"
}, {
  icon: <Star className="w-6 h-6 text-primary" />,
  title: "Get Recognition",
  description: "Have your artwork featured in our curated gallery"
}, {
  icon: <Award className="w-6 h-6 text-primary" />,
  title: "Win Awards",
  description: "Outstanding artworks receive special recognition"
}, {
  icon: <Rocket className="w-6 h-6 text-primary" />,
  title: "Inspire Others",
  description: "Your art can inspire fellow students to create"
}];
const LoadingScreen = () => <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-white text-lg">Loading Art Gallery...</p>
    </div>
  </div>;
const CompareStylesView = ({
  aiArtworks,
  handDrawnArtworks
}: {
  aiArtworks: ImageRecord[];
  handDrawnArtworks: ImageRecord[];
}) => {
  const [selectedAiIndex, setSelectedAiIndex] = useState(0);
  const [selectedHandDrawnIndex, setSelectedHandDrawnIndex] = useState(0);
  const handleNextAi = () => {
    if (selectedAiIndex < aiArtworks.length - 1) {
      setSelectedAiIndex(selectedAiIndex + 1);
    }
  };
  const handlePrevAi = () => {
    if (selectedAiIndex > 0) {
      setSelectedAiIndex(selectedAiIndex - 1);
    }
  };
  const handleNextHandDrawn = () => {
    if (selectedHandDrawnIndex < handDrawnArtworks.length - 1) {
      setSelectedHandDrawnIndex(selectedHandDrawnIndex + 1);
    }
  };
  const handlePrevHandDrawn = () => {
    if (selectedHandDrawnIndex > 0) {
      setSelectedHandDrawnIndex(selectedHandDrawnIndex - 1);
    }
  };
  if (aiArtworks.length === 0 || handDrawnArtworks.length === 0) {
    return <div className="text-center text-gray-400 py-8">
        <p>Not enough submissions to compare. We need at least one AI and one hand-drawn artwork.</p>
      </div>;
  }
  const aiArtwork = aiArtworks[selectedAiIndex];
  const handDrawnArtwork = handDrawnArtworks[selectedHandDrawnIndex];
  const aiDetails = parseImageData(aiArtwork.datefield);
  const handDrawnDetails = parseImageData(handDrawnArtwork.datefield);
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* AI Artwork */}
      <div className="relative">
        <h3 className="text-xl font-semibold text-white mb-4">AI Generated</h3>
        <div className="aspect-[4/3] overflow-hidden rounded-xl relative">
          <img src={api.getImageById(aiArtwork.id)} alt={aiDetails.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-lg font-semibold text-white">{aiDetails.title}</h4>
              <p className="text-gray-300">{aiDetails.studentName} - {aiDetails.grade}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="ghost" size="icon" onClick={handlePrevAi} disabled={selectedAiIndex === 0} className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-400">
            {selectedAiIndex + 1} / {aiArtworks.length}
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextAi} disabled={selectedAiIndex === aiArtworks.length - 1} className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hand Drawn Artwork */}
      <div className="relative">
        <h3 className="text-xl font-semibold text-white mb-4">Hand Drawn</h3>
        <div className="aspect-[4/3] overflow-hidden rounded-xl relative">
          <img src={api.getImageById(handDrawnArtwork.id)} alt={handDrawnDetails.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-lg font-semibold text-white">{handDrawnDetails.title}</h4>
              <p className="text-gray-300">{handDrawnDetails.studentName} - {handDrawnDetails.grade}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button variant="ghost" size="icon" onClick={handlePrevHandDrawn} disabled={selectedHandDrawnIndex === 0} className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-400">
            {selectedHandDrawnIndex + 1} / {handDrawnArtworks.length}
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextHandDrawn} disabled={selectedHandDrawnIndex === handDrawnArtworks.length - 1} className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>;
};
const ArtworkGrid = ({
  submissions,
  title
}: {
  submissions: ImageRecord[];
  title: string;
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps'
  });
  const displayedSubmissions = showAll ? submissions : submissions.slice(0, 6);
  const handleImageSelect = (submission: ImageRecord) => {
    const index = submissions.findIndex(s => s.id === submission.id);
    setSelectedIndex(index);
    setSelectedImage(submission);
  };
  const handleNext = () => {
    if (selectedIndex < submissions.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(submissions[selectedIndex + 1]);
    }
  };
  const handlePrevious = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(submissions[selectedIndex - 1]);
    }
  };
  return <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {submissions.length > 6 && <Button variant="ghost" className="text-primary hover:text-primary/90" onClick={() => setShowAll(!showAll)}>
            {showAll ? 'Show Less' : 'View All'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayedSubmissions.map(submission => {
          const details = parseImageData(submission.datefield);
          return <motion.div key={submission.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} className="group relative cursor-pointer flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 first:pl-0" onClick={() => handleImageSelect(submission)}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img src={api.getImageById(submission.id)} alt={details.title} className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <p className="text-sm text-primary">{details.grade}</p>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">{details.title}</h3>
                      <p className="text-gray-300">{details.studentName}</p>
                      {details.type === "ai" && <div className="mt-2 text-sm text-gray-400">
                          <p>AI: {details.aiGenerator}</p>
                          <p className="truncate">Prompt: {details.aiPrompt}</p>
                        </div>}
                    </div>
                  </div>
                </div>
              </motion.div>;
        })}
        </div>
      </div>

      {/* Navigation Dots */}
      {!showAll && submissions.length > 3 && <div className="flex justify-center gap-2 mt-6">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={() => {
        if (emblaApi) emblaApi.scrollPrev();
      }}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={() => {
        if (emblaApi) emblaApi.scrollNext();
      }}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>}

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-black/90">
          {selectedImage && <div className="relative">
              <img src={api.getImageById(selectedImage.id)} alt={parseImageData(selectedImage.datefield).title} className="w-full h-full object-contain max-h-[80vh]" />
              
              {/* Navigation Buttons */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50" onClick={e => {
              e.stopPropagation();
              handlePrevious();
            }} disabled={selectedIndex === 0}>
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50" onClick={e => {
              e.stopPropagation();
              handleNext();
            }} disabled={selectedIndex === submissions.length - 1}>
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {parseImageData(selectedImage.datefield).title}
                </h3>
                <p className="text-gray-300">
                  {parseImageData(selectedImage.datefield).studentName} - {parseImageData(selectedImage.datefield).grade}
                </p>
                {parseImageData(selectedImage.datefield).type === "ai" && <div className="mt-2 text-sm text-gray-400">
                    <p>AI: {parseImageData(selectedImage.datefield).aiGenerator}</p>
                    <p>Prompt: {parseImageData(selectedImage.datefield).aiPrompt}</p>
                  </div>}
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
};
const currentChallenge = {
  title: "Reimagine a Historical Event",
  description: "Create artwork that reimagines a significant historical event with a creative twist. Consider alternative outcomes, modern perspectives, or artistic reinterpretation.",
  expiryDate: "2025-05-01",
  sampleImages: [{
    id: 1,
    title: "Moon Landing Reimagined",
    artist: "Zainab Khan",
    grade: "Grade IS2B",
    imageUrl: "https://i.ibb.co/m5JPMRGm/0-3-3.jpg"
  }]
};
const featuredPrompt = {
  title: "Dreamscapes: Reality Reimagined",
  description: "Create an artwork that blends elements of reality with surreal, dreamlike qualities. Consider using unexpected combinations, impossible physics, or fantastical elements in familiar settings.",
  tips: ["Start with a familiar scene, then add elements that couldn't exist in reality", "Play with scale - make small things enormous or large things tiny", "Experiment with impossible physics or dreamlike transitions between elements", "Consider unusual color palettes that evoke emotion or atmosphere"],
  exampleImageUrl: "https://i.ibb.co/vv1LQqZw/0-1.jpg",
  expiryDate: "2025-04-18"
};
const learnAiArtResources = {
  tutorials: [{
    title: "Creative Bloq's AI Art Tutorials",
    description: "A comprehensive guide covering tools like Midjourney, DALL·E 3, Stable Diffusion, and Adobe Firefly.",
    link: "https://www.creativebloq.com/features/ai-art-tutorials"
  }, {
    title: "AI Art Tutorials Website",
    description: "Offers a collection of tutorials, styles, techniques, and tips suitable for both novices and advanced users.",
    link: "https://ai-art-tutorials.com/"
  }, {
    title: "Adobe Firefly Guide",
    description: "Learn how to generate AI art using Adobe's tools, with step-by-step instructions on crafting prompts and refining images.",
    link: "https://www.adobe.com/products/firefly/discover/how-to-make-ai-art.html"
  }],
  videoTutorials: [{
    title: "Making AI Art: Absolute Beginner's Tutorial",
    description: "A YouTube tutorial that walks you through the basics of creating AI art.",
    link: "https://www.youtube.com/watch?v=hlWJHTlk1ME"
  }, {
    title: "Full Beginner's Guide to AI Art with MidJourney",
    description: "An in-depth video tutorial focusing on creating art using MidJourney.",
    link: "https://www.youtube.com/watch?v=NRrC0ZaZO_4"
  }],
  tools: [{
    title: "Midjourney",
    description: "An AI program that generates images from textual descriptions.",
    link: "https://en.wikipedia.org/wiki/Midjourney"
  }, {
    title: "DALL·E",
    description: "Developed by OpenAI, it creates images from text prompts.",
    link: "https://en.wikipedia.org/wiki/DALL-E"
  }, {
    title: "Stable Diffusion",
    description: "An open-source model for generating images from text.",
    link: "https://en.wikipedia.org/wiki/Stable_Diffusion"
  }, {
    title: "Artbreeder",
    description: "Allows users to blend images to create new artworks.",
    link: "https://en.wikipedia.org/wiki/Artbreeder"
  }],
  gifs: ["https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnNzd25oMW01dzh1OXNvY2l5NWVpeDI4MjB6MGF6YTlzejRnZTFsZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nTbbt4dylR5LqEWvXD/giphy.gif", "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjJ6MGRrZTFsa2psZnExYXpvd2UwbHdxZmp3NGRxNHI3OTljcGgyOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M9OaZInwdnErACOzpr/giphy.gif", "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYThkN3R5aDQ3b3l2czAxaWwyd2Y4cGliazkzZnRpcXlqdGdsdzkwYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L0fmbqu9Tv388MRuxL/giphy.gif", "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGFnaWZicnhnYmt0cm9lajY0cWZrOHd2amF0Y3QwMzY1emwyem9kMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KUT1blBDudxezXFKEy/giphy.gif"]
};
const achievements = [{
  id: 1,
  name: "First AI Artwork",
  description: "Create and submit your first AI-generated artwork",
  icon: <Wand2 className="w-5 h-5" />,
  points: 50,
  unlocked: true
}, {
  id: 2,
  name: "Theme Master",
  description: "Submit artworks for 3 different weekly themes",
  icon: <Palette className="w-5 h-5" />,
  points: 100,
  unlocked: false,
  progress: 1,
  total: 3
}, {
  id: 3,
  name: "Creative Explorer",
  description: "Try 5 different AI art generators",
  icon: <Compass className="w-5 h-5" />,
  points: 150,
  unlocked: false,
  progress: 2,
  total: 5
}, {
  id: 4,
  name: "Community Star",
  description: "Have 3 of your artworks featured in the gallery",
  icon: <Star className="w-5 h-5" />,
  points: 200,
  unlocked: false,
  progress: 1,
  total: 3
}, {
  id: 5,
  name: "Artistic Influencer",
  description: "Inspire 5 other students with your artwork",
  icon: <Users className="w-5 h-5" />,
  points: 250,
  unlocked: false
}];
const challenges = [{
  id: 1,
  name: "Prompt Engineering",
  description: "Create an artwork using advanced prompt techniques",
  icon: <Target className="w-5 h-5" />,
  difficulty: "Medium",
  reward: 75,
  expiresIn: 5,
  completed: false
}, {
  id: 2,
  name: "Style Fusion",
  description: "Combine two distinct art styles in one AI creation",
  icon: <Flame className="w-5 h-5" />,
  difficulty: "Hard",
  reward: 100,
  expiresIn: 3,
  completed: false
}, {
  id: 3,
  name: "Weekly Theme Challenge",
  description: "Submit an artwork for this week's featured prompt",
  icon: <Gift className="w-5 h-5" />,
  difficulty: "Easy",
  reward: 50,
  expiresIn: 7,
  completed: true
}];
const Index = () => {
  const [aiSubmissions, setAiSubmissions] = useState<ImageRecord[]>([]);
  const [handDrawnSubmissions, setHandDrawnSubmissions] = useState<ImageRecord[]>([]);
  const [competitionWinners, setCompetitionWinners] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "ai" | "handdrawn" | "compare">("all");
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats>(achievementStorage.getStats());
  const navigate = useNavigate();
  const progressPercentage = Math.min(100, Math.floor(userStats.points / 500 * 100));
  useEffect(() => {
    document.title = "LGS JTI ART SUBMISSIONS";
    setUserAchievements(achievementStorage.updateAchievements());
    setUserStats(achievementStorage.getStats());
  }, []);
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        const data = await api.getImages('true');
        console.log('Received approved submissions:', data);
        const sortedSubmissions = data.reduce((acc: {
          ai: ImageRecord[];
          handDrawn: ImageRecord[];
          winners: ImageRecord[];
        }, submission: ImageRecord) => {
          try {
            const details = parseImageData(submission.datefield);
            if (details.type === "ai") {
              acc.ai.push(submission);
            } else {
              acc.handDrawn.push(submission);
            }
            if (details.fromCheckDashboard) {
              acc.winners.push(submission);
            }
          } catch (error) {
            console.error('Error parsing submission data:', error, submission);
          }
          return acc;
        }, {
          ai: [],
          handDrawn: [],
          winners: []
        });
        console.log('Sorted submissions:', sortedSubmissions);
        setAiSubmissions(sortedSubmissions.ai);
        setHandDrawnSubmissions(sortedSubmissions.handDrawn);
        setCompetitionWinners(sortedSubmissions.winners);
      } catch (error) {
        console.error('Failed to load submissions:', error);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadSubmissions();
  }, []);
  const handleTypeSelection = (type: "ai" | "handdrawn") => {
    setShowTypeDialog(false);
    navigate(`/upload?type=${type}`);
  };
  if (loading) {
    return <LoadingScreen />;
  }
  const challenges = [{
    id: 1,
    name: "Prompt Engineering",
    description: "Create an artwork using advanced prompt techniques",
    icon: <Target className="w-5 h-5" />,
    difficulty: "Medium",
    reward: 75,
    expiresIn: 5,
    completed: userStats.aiArtworksUploaded > 0
  }, {
    id: 2,
    name: "Style Fusion",
    description: "Combine two distinct art styles in one AI creation",
    icon: <Flame className="w-5 h-5" />,
    difficulty: "Hard",
    reward: 100,
    expiresIn: 3,
    completed: userStats.aiGeneratorsUsed.length >= 2
  }, {
    id: 3,
    name: "Weekly Theme Challenge",
    description: "Submit an artwork for this week's featured prompt",
    icon: <Gift className="w-5 h-5" />,
    difficulty: "Easy",
    reward: 50,
    expiresIn: 7,
    completed: userStats.weeklyThemesParticipated.length > 0
  }];
  return <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-10" />
      
      <motion.header initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="relative z-10 px-6 py-16 md:py-24 text-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Student Art Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover and celebrate the artistic talent of our students through their creative expressions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => setShowTypeDialog(true)}>
              <Plus className="mr-2" />
              Submit Your Artwork
            </Button>
            <a href="https://www.writecream.com/ai-image-generator-free-no-sign-up/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Wand2 className="mr-2" />
                Try AI Art Generator
              </Button>
            </a>
          </div>
        </motion.div>
      </motion.header>

      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Select Artwork Type</DialogTitle>
          <DialogDescription>
            Please specify the type of artwork you're submitting
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleTypeSelection("ai")} variant="outline" className="w-full">
              AI Generated Art
            </Button>
            <Button onClick={() => handleTypeSelection("handdrawn")} variant="outline" className="w-full">
              Hand Drawn Art
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 0.1
    }} className="relative z-10 px-6 py-16 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-white">Featured Prompt of the Week</h2>
          </div>
          
          <Card className="bg-black/30 border-primary/20 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="md:col-span-2 p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-2xl text-white">{featuredPrompt.title}</CardTitle>
                  <div className="text-primary text-sm flex items-center mt-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ends in {Math.ceil((new Date(featuredPrompt.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                  </div>
                </CardHeader>
                
                <CardContent className="p-0 pb-6">
                  <p className="text-gray-300 mb-6">{featuredPrompt.description}</p>
                  
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Creative Tips:</h4>
                    <ul className="space-y-2">
                      {featuredPrompt.tips.map((tip, index) => <li key={index} className="flex items-start gap-2 text-gray-300">
                          <Star className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>)}
                    </ul>
                  </div>
                </CardContent>
                
                <CardFooter className="p-0 pt-2">
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowTypeDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Your Interpretation
                  </Button>
                </CardFooter>
              </div>
              
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
                <img src={featuredPrompt.exampleImageUrl} alt={featuredPrompt.title} className="w-full h-full object-cover" />
              </div>
            </div>
          </Card>
        </div>
      </motion.section>

      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 0.2
    }} className="relative z-10 px-6 py-16 bg-gradient-to-r from-blue-900/30 to-indigo-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-white">Achievements</h2>
          </div>
          
          <div className="mb-8">
            <div className="bg-black/30 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-white">Student Progress</h3>
                <Badge variant="achievement" className="px-3 py-1">{userStats.points} Points</Badge>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-yellow-300 to-amber-500 h-2.5 rounded-full" style={{
                width: `${progressPercentage}%`
              }}></div>
              </div>
            </div>
            
            <Tabs defaultValue="achievements" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="achievements" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAchievements.map(achievement => <Card key={achievement.id} className={`bg-black/30 border ${achievement.unlocked ? 'border-primary' : 'border-gray-700'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-primary/20' : 'bg-gray-800'}`}>
                              {achievement.id === 1 ? <Wand2 className="w-5 h-5" /> : achievement.id === 2 ? <Palette className="w-5 h-5" /> : achievement.id === 3 ? <Compass className="w-5 h-5" /> : achievement.id === 4 ? <Star className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                            </div>
                            {achievement.name}
                          </CardTitle>
                          {achievement.unlocked && <Badge variant="achievement" className="ml-2">
                              +{achievement.id === 1 ? 50 : achievement.id * 50}
                            </Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">
                          {achievement.id === 1 ? "Create and submit your first AI-generated artwork" : achievement.id === 2 ? "Submit artworks for 3 different weekly themes" : achievement.id === 3 ? "Try 5 different AI art generators" : achievement.id === 4 ? "Have 3 of your artworks featured in the gallery" : "Inspire 5 other students with your artwork"}
                        </p>
                        {!achievement.unlocked && achievement.progress !== undefined && achievement.total !== undefined && <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{
                          width: `${achievement.progress / achievement.total * 100}%`
                        }} />
                            </div>
                          </div>}
                      </CardContent>
                    </Card>)}
                </div>
              </TabsContent>
              
              <TabsContent value="challenges" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenges.map(challenge => <Card key={challenge.id} className={`bg-black/30 ${challenge.completed ? 'border-green-500' : 'border-gray-700'}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-white flex items-center gap-2">
                            <div className={`p-2 rounded-full ${challenge.completed ? 'bg-green-500/20' : 'bg-gray-800'}`}>
                              {challenge.icon}
                            </div>
                            {challenge.name}
                          </CardTitle>
                          <Badge className={challenge.difficulty === "Easy" ? "bg-green-600" : challenge.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300">{challenge.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">{challenge.expiresIn} days left</span>
                          </div>
                          <Badge variant={challenge.completed ? "achievement" : "secondary"} className="ml-2">
                            {challenge.completed ? "Completed" : `+${challenge.reward} pts`}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <BookOpen className="mr-2 h-4 w-4" />
              View All Achievements
            </Button>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 0.3
    }} className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-white">Learn How AI Art is Made</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-black/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tutorials</CardTitle>
                <CardDescription>Read guides to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learnAiArtResources.tutorials.slice(0, 3).map((resource, index) => <div key={index} className="group">
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-white/5 p-3 rounded-lg transition-colors">
                      <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors">{resource.title}</h4>
                      <p className="text-sm text-gray-400">{resource.description}</p>
                    </a>
                  </div>)}
              </CardContent>
              <CardFooter>
                <a href="https://ai-art-tutorials.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  View all tutorials →
                </a>
              </CardFooter>
            </Card>
            
            <Card className="bg-black/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Videos</CardTitle>
                <CardDescription>Watch step-by-step guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learnAiArtResources.videoTutorials.map((video, index) => <div key={index} className="group">
                    <a href={video.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-white/5 p-3 rounded-lg transition-colors">
                      <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors">{video.title}</h4>
                      <p className="text-sm text-gray-400">{video.description}</p>
                    </a>
                  </div>)}
              </CardContent>
              <CardFooter>
                <a href="https://www.youtube.com/results?search_query=ai+art+tutorial" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  Watch more videos →
                </a>
              </CardFooter>
            </Card>
            
            <Card className="bg-black/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Tools</CardTitle>
                <CardDescription>Explore AI art generators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learnAiArtResources.tools.slice(0, 4).map((tool, index) => <div key={index} className="group">
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-white/5 p-3 rounded-lg transition-colors">
                      <h4 className="text-white font-medium mb-1 group-hover:text-primary transition-colors">{tool.title}</h4>
                      <p className="text-sm text-gray-400">{tool.description}</p>
                    </a>
                  </div>)}
              </CardContent>
              <CardFooter>
                <a href="https://www.writecream.com/ai-image-generator-free-no-sign-up/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  Try a free generator →
                </a>
              </CardFooter>
            </Card>
            
            <Card className="bg-black/30 border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-white">Inspiration</CardTitle>
                <CardDescription>Get inspired by examples</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {learnAiArtResources.gifs.slice(0, 4).map((gif, index) => <a key={index} href={gif} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity">
                      <img src={gif} alt={`AI art inspiration ${index + 1}`} className="w-full h-full object-cover" />
                    </a>)}
                </div>
              </CardContent>
              <CardFooter>
                <a href="https://lexica.art/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                  Explore more inspiration →
                </a>
              </CardFooter>
            </Card>
          </div>
        </div>
      </motion.section>
      
      <motion.section initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.8,
      delay: 0.4
    }} className="relative z-10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-white">Artwork Gallery</h2>
            
            <div className="flex items-center gap-3">
              <Filter className="text-gray-400" />
              <ToggleGroup type="single" defaultValue="all" value={filter} onValueChange={value => value && setFilter(value as any)}>
                <ToggleGroupItem value="all">All</ToggleGroupItem>
                <ToggleGroupItem value="ai">AI Generated</ToggleGroupItem>
                <ToggleGroupItem value="handdrawn">Hand Drawn</ToggleGroupItem>
                <ToggleGroupItem value="compare">Compare</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
          
          {filter === "compare" ? <CompareStylesView aiArtworks={aiSubmissions} handDrawnArtworks={handDrawnSubmissions} /> : filter === "ai" ? <ArtworkGrid submissions={aiSubmissions} title="AI Generated Artwork" /> : filter === "handdrawn" ? <ArtworkGrid submissions={handDrawnSubmissions} title="Hand Drawn Artwork" /> : <>
              {competitionWinners.length > 0 && <div className="mb-24">
                  <ArtworkGrid submissions={competitionWinners} title="Competition Winners" />
                </div>}
              {aiSubmissions.length > 0 && <div className="mb-24">
                  <ArtworkGrid submissions={aiSubmissions} title="AI Generated Artwork" />
                </div>}
              {handDrawnSubmissions.length > 0 && <div>
                  <ArtworkGrid submissions={handDrawnSubmissions} title="Hand Drawn Artwork" />
                </div>}
            </>}
        </div>
      </motion.section>
    </div>;
};
export default Index;