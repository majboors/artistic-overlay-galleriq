
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { api } from "@/lib/api";
import type { UnmarkedImage } from "@/types/api";

const CheckPage = () => {
  const [currentImage, setCurrentImage] = useState<UnmarkedImage | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadNextImage = async () => {
    setLoading(true);
    try {
      const data = await api.getUnmarkedImage();
      setCurrentImage(data);
    } catch (error) {
      toast({
        title: "No more images",
        description: "There are no more images to review",
        variant: "destructive",
      });
      setCurrentImage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNextImage();
  }, []);

  const handleMark = async (marking: boolean) => {
    if (!currentImage) return;

    try {
      await api.markImage(currentImage.id, marking);
      toast({
        title: "Success",
        description: marking ? "Image approved" : "Image rejected",
      });
      loadNextImage();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark the image",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No More Images</h2>
          <p>All images have been reviewed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-10" />
      
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Review Artwork</h1>
          
          <div className="space-y-6">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={api.getImageById(currentImage.id)}
                alt="Artwork to review"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-4 justify-center pt-6">
              <Button
                onClick={() => handleMark(false)}
                variant="destructive"
                size="lg"
                className="w-32"
              >
                <X className="mr-2" />
                Reject
              </Button>
              
              <Button
                onClick={() => handleMark(true)}
                variant="default"
                size="lg"
                className="w-32"
              >
                <Check className="mr-2" />
                Approve
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Check;
