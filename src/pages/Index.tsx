import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Image, Star, Award, Rocket, CheckCircle, Wand2, ChevronLeft, ChevronRight, ArrowRight, Loader2, Calendar, Filter } from "lucide-react";
import { api } from "@/lib/api";
import { parseImageData } from "@/lib/utils";
import type { ImageRecord } from "@/types/api";
import useEmblaCarousel from 'embla-carousel-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

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

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-white text-lg">Loading Art Gallery...</p>
    </div>
  </div>
);

const CompareStylesView = ({ aiArtworks, handDrawnArtworks }: { aiArtworks: ImageRecord[], handDrawnArtworks: ImageRecord[] }) => {
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
    return (
      <div className="text-center text-gray-400 py-8">
        <p>Not enough submissions to compare. We need at least one AI and one hand-drawn artwork.</p>
      </div>
    );
  }

  const aiArtwork = aiArtworks[selectedAiIndex];
  const handDrawnArtwork = handDrawnArtworks[selectedHandDrawnIndex];
  const aiDetails = parseImageData(aiArtwork.datefield);
  const handDrawnDetails = parseImageData(handDrawnArtwork.datefield);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* AI Artwork */}
      <div className="relative">
        <h3 className="text-xl font-semibold text-white mb-4">AI Generated</h3>
        <div className="aspect-[4/3] overflow-hidden rounded-xl relative">
          <img
            src={api.getImageById(aiArtwork.id)}
            alt={aiDetails.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-lg font-semibold text-white">{aiDetails.title}</h4>
              <p className="text-gray-300">{aiDetails.studentName} - {aiDetails.grade}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevAi}
            disabled={selectedAiIndex === 0}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-400">
            {selectedAiIndex + 1} / {aiArtworks.length}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextAi}
            disabled={selectedAiIndex === aiArtworks.length - 1}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hand Drawn Artwork */}
      <div className="relative">
        <h3 className="text-xl font-semibold text-white mb-4">Hand Drawn</h3>
        <div className="aspect-[4/3] overflow-hidden rounded-xl relative">
          <img
            src={api.getImageById(handDrawnArtwork.id)}
            alt={handDrawnDetails.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-lg font-semibold text-white">{handDrawnDetails.title}</h4>
              <p className="text-gray-300">{handDrawnDetails.studentName} - {handDrawnDetails.grade}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevHandDrawn}
            disabled={selectedHandDrawnIndex === 0}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm text-gray-400">
            {selectedHandDrawnIndex + 1} / {handDrawnArtworks.length}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextHandDrawn}
            disabled={selectedHandDrawnIndex === handDrawnArtworks.length - 1}
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ArtworkGrid = ({ submissions, title }: { submissions: ImageRecord[], title: string }) => {
  const [selectedImage, setSelectedImage] = useState<ImageRecord | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showAll, setShowAll] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        {submissions.length > 6 && (
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary/90"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {displayedSubmissions.map((submission) => {
            const details = parseImageData(submission.datefield);
            return (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative cursor-pointer flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 first:pl-0"
                onClick={() => handleImageSelect(submission)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src={api.getImageById(submission.id)}
                    alt={details.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <p className="text-sm text-primary">{details.grade}</p>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1">{details.title}</h3>
                      <p className="text-gray-300">{details.studentName}</p>
                      {details.type === "ai" && (
                        <div className="mt-2 text-sm text-gray-400">
                          <p>AI: {details.aiGenerator}</p>
                          <p className="truncate">Prompt: {details.aiPrompt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      {!showAll && submissions.length > 3 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={() => {
              if (emblaApi) emblaApi.scrollPrev();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={() => {
              if (emblaApi) emblaApi.scrollNext();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-black/90">
          {selectedImage && (
            <div className="relative">
              <img
                src={api.getImageById(selectedImage.id)}
                alt={parseImageData(selectedImage.datefield).title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
              
              {/* Navigation Buttons */}
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  disabled={selectedIndex === submissions.length - 1}
                >
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
                {parseImageData(selectedImage.datefield).type === "ai" && (
                  <div className="mt-2 text-sm text-gray-400">
                    <p>AI: {parseImageData(selectedImage.datefield).aiGenerator}</p>
                    <p>Prompt: {parseImageData(selectedImage.datefield).aiPrompt}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const currentChallenge = {
  title: "Reimagine a Historical Event",
  description: "Create artwork that reimagines a significant historical event with a creative twist. Consider alternative outcomes, modern perspectives, or artistic reinterpretation.",
  expiryDate: "2025-05-01",
  sampleImages: [
    {
      id: 1,
      title: "Moon Landing Reimagined",
      artist: "Zainab Khan",
      grade: "Grade IS2B",
      imageUrl: "https://i.ibb.co/m5JPMRGm/0-3-3.jpg"
    }
  ]
};

const Index = () => {
  const [aiSubmissions, setAiSubmissions] = useState<ImageRecord[]>([]);
  const [handDrawnSubmissions, setHandDrawnSubmissions] = useState<ImageRecord[]>([]);
  const [competitionWinners, setCompetitionWinners] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [filter, setFilter] = useState<"all" | "ai" | "handdrawn" | "compare">("all");
  const navigate = useNavigate();

  const calculateDaysRemaining = () => {
    const today = new Date();
    const expiryDate = new Date(currentChallenge.expiryDate);
    const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    document.title = "LGS JTI ART SUBMISSIONS";
  }, []);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        const data = await api.getImages('true');
        console.log('Received approved submissions:', data);
        
        const sortedSubmissions = data.reduce((acc: { ai: ImageRecord[], handDrawn: ImageRecord[], winners: ImageRecord[] }, submission: ImageRecord) => {
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
        }, { ai: [], handDrawn: [], winners: [] });

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

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-10" />
      
      {/* Hero Section */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-6 py-16 md:py-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Student Art Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover and celebrate the artistic talent of our students through their creative expressions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowTypeDialog(true)}
            >
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

      {/* Type Selection Dialog */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Select Artwork Type</DialogTitle>
          <DialogDescription>
            Please specify the type of artwork you're submitting
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => handleTypeSelection("ai")}
              variant="outline"
              className="w-full"
            >
              AI Generated Art
            </Button>
            <Button
              onClick={() => handleTypeSelection("handdrawn")}
              variant="outline"
              className="w-full"
            >
              Hand Drawn Art
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Challenge Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative z-10 px-6 py-16 bg-black/40"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Current Challenge</h2>
              <p className="text-primary flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {calculateDaysRemaining()} days remaining
              </p>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90 mt-4 md:mt-0"
              onClick={() => setShowTypeDialog(true)}
            >
              Submit to Challenge
            </Button>
          </div>
          
          <div className="bg-black/20 rounded-xl p-6 mb-8">
            <h3 className="text-2xl font-semibold text-white mb-4">{currentChallenge.title}</h3>
            <p className="text-gray-300 mb-6">{currentChallenge.description}</p>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium text-white mb-4">Sample Interpretations:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentChallenge.sampleImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg">
                      <img 
                        src={image.imageUrl} 
                        alt={image.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h5 className="text-lg font-medium text-white">{image.title}</h5>
                          <p className="text-sm text-gray-300">{image.artist} - {image.grade}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 px-6 py-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Submit Your Art?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass p-6 rounded-xl text-center"
              >
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Artwork Gallery Filter */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 px-6 py-8 bg-black/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">Art Gallery</h2>
            <div className="flex items-center">
              <Filter className="mr-2 text-primary" />
              <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value as any)}>
                <ToggleGroupItem value="all" aria-label="All artwork">All</ToggleGroupItem>
                <ToggleGroupItem value="ai" aria-label="AI artwork">AI Generated</ToggleGroupItem>
                <ToggleGroupItem value="handdrawn" aria-label="Hand-drawn artwork">Hand Drawn</ToggleGroupItem>
                <ToggleGroupItem value="compare" aria-label="Compare styles">Compare Styles</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Compare Styles View */}
          {filter === "compare" && (
            <CompareStylesView 
              aiArtworks={aiSubmissions} 
              handDrawnArtworks={handDrawnSubmissions}
            />
          )}
        </div>
      </motion.section>

      {/* Inspiration Section */}
      {filter === "all" && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 px-6 py-16"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Inspirational Artworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inspirationArtworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          <p className="text-sm text-primary">{artwork.grade}</p>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-1">{artwork.title}</h3>
                        <p className="text-gray-300">{artwork.artist}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Competition Winners Section */}
      {(filter === "all" || filter === "ai" || filter === "handdrawn") && competitionWinners.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 px-6 py-16"
        >
          <ArtworkGrid
            submissions={competitionWinners}
            title="Competition Winners"
          />
        </motion.section>
      )}

      {/* AI Submissions Section */}
      {(filter === "all" || filter === "ai") && aiSubmissions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative z-10 px-6 py-16 bg-black/30"
        >
          <ArtworkGrid
            submissions={aiSubmissions}
            title="AI Generated Artworks"
          />
        </motion.section>
      )}

      {/* Hand Drawn Submissions Section */}
      {(filter === "all" || filter === "handdrawn") && handDrawnSubmissions.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="relative z-10 px-6 py-16"
        >
          <ArtworkGrid
            submissions={handDrawnSubmissions}
            title="Hand Drawn Artworks"
          />
        </motion.section>
      )}

      {/* No Submissions Message */}
      {!loading && aiSubmissions.length === 0 && handDrawnSubmissions.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p>No approved submissions yet. Be the first to submit your artwork!</p>
          <Button 
            variant="outline"
            onClick={() => setShowTypeDialog(true)}
            className="inline-flex mt-4"
          >
            <Plus className="mr-2" />
            Submit Artwork
          </Button>
        </div>
      )}

      {/* Type Selection Dialog - This dialog is already defined above and will work for both buttons */}
      <Dialog open={showTypeDialog} onOpenChange={setShowTypeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle>Select Artwork Type</DialogTitle>
          <DialogDescription>
            Please specify the type of artwork you're submitting
          </DialogDescription>
          
          <div className="grid gap-4 py-4">
            <Button
              onClick={() => handleTypeSelection("ai")}
              variant="outline"
              className="w-full"
            >
              AI Generated Art
            </Button>
            <Button
              onClick={() => handleTypeSelection("handdrawn")}
              variant="outline"
              className="w-full"
            >
              Hand Drawn Art
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
