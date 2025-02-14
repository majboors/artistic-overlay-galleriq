import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import type { ImageRecord } from "@/types/api";

const inspirationArtworks = [
  {
    id: 1,
    title: "Abstract Harmony",
    artist: "Sarah Ahmed",
    grade: "Grade 12",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Ali Hassan",
    grade: "Grade 11",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Nature's Palette",
    artist: "Fatima Khan",
    grade: "Grade 12",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    title: "Urban Symphony",
    artist: "Hassan Ali",
    grade: "Grade 11",
    imageUrl: "https://images.unsplash.com/photo-1549490349-b73aa36fbb0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    title: "Color Theory",
    artist: "Zara Malik",
    grade: "Grade 12",
    imageUrl: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    title: "Geometric Visions",
    artist: "Omar Shah",
    grade: "Grade 11",
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Index = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        const data = await api.getImages('true'); // Only get approved submissions
        setSubmissions(data);
      } catch (error) {
        console.error('Failed to load submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-10" />
      
      <header className="relative z-10 px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Student Art Gallery
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Showcasing the creative excellence of LGS Johar Town students through their artistic expressions.
          </p>
          <Link to="/upload">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2" />
              Submit Your Artwork
            </Button>
          </Link>
        </motion.div>
      </header>

      <main className="relative z-10 px-6 pb-24">
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Inspiration Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {inspirationArtworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
                onMouseEnter={() => setHoveredId(artwork.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${hoveredId === artwork.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-sm text-primary mb-2">{artwork.grade}</p>
                      <h3 className="text-xl font-semibold text-white mb-1">{artwork.title}</h3>
                      <p className="text-gray-300">{artwork.artist}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Student Submissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {submissions.map((submission, index) => {
              const details = JSON.parse(submission.datefield);
              return (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    <img
                      src={api.getImageById(submission.id)}
                      alt={details.title}
                      className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-sm text-primary mb-2">{details.grade}</p>
                        <h3 className="text-xl font-semibold text-white mb-1">{details.title}</h3>
                        <p className="text-gray-300">{details.studentName}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
