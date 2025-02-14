
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const Upload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !studentName || !grade || !title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select an image",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("datefield", JSON.stringify({ studentName, grade, title }));

    try {
      await api.uploadImage(formData);
      toast({
        title: "Success!",
        description: "Your artwork has been uploaded successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your artwork",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-10" />
      
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8"
        >
          <h1 className="text-3xl font-bold text-white mb-8">Submit Your Artwork</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Student Name
              </label>
              <Input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Grade
              </label>
              <Input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full"
                placeholder="e.g. Grade 11"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Artwork Title
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
                placeholder="Give your artwork a title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Upload Image
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Submit Artwork"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
