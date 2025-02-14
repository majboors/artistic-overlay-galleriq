
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, X, Filter } from "lucide-react";
import { api } from "@/lib/api";
import type { ImageRecord } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterType = 'all' | 'true' | 'false' | 'unmarked';

const CheckPage = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  const loadImages = async (filterValue: FilterType = 'all') => {
    setLoading(true);
    try {
      const data = await api.getImages(filterValue === 'all' ? undefined : filterValue);
      setImages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages(filter);
  }, [filter]);

  const handleMark = async (id: string, marking: boolean) => {
    try {
      await api.markImage(id, marking);
      toast({
        title: "Success",
        description: marking ? "Image approved" : "Image rejected",
      });
      loadImages(filter);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (marking: boolean | null) => {
    if (marking === null) return "Pending Review";
    return marking ? "Approved" : "Rejected";
  };

  const getStatusColor = (marking: boolean | null) => {
    if (marking === null) return "text-yellow-500";
    return marking ? "text-green-500" : "text-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-10" />
      
      <div className="container max-w-6xl mx-auto px-4 py-16">
        {/* Debug Panel */}
        <div className="mb-8 p-4 bg-black/50 rounded-lg">
          <h2 className="text-white font-semibold mb-2">Debug Information:</h2>
          <pre className="text-xs text-gray-300 overflow-auto max-h-40">
            {JSON.stringify(images, null, 2)}
          </pre>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Review Artwork</h1>
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value as FilterType)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter images" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Rejected</SelectItem>
                  <SelectItem value="unmarked">Pending Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => {
              let details;
              try {
                details = JSON.parse(image.datefield);
              } catch {
                details = { title: "Untitled", studentName: "Unknown", grade: "Unspecified" };
              }

              return (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-lg overflow-hidden"
                >
                  <div className="aspect-square">
                    <img
                      src={api.getImageById(image.id)}
                      alt={details.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{details.title}</h3>
                        <p className="text-sm text-gray-300">{details.studentName}</p>
                        <p className="text-sm text-gray-400">{details.grade}</p>
                      </div>
                      <span className={`text-sm font-medium ${getStatusColor(image.marking)}`}>
                        {getStatusBadge(image.marking)}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => handleMark(image.id, false)}
                        variant={image.marking === false ? "destructive" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      
                      <Button
                        onClick={() => handleMark(image.id, true)}
                        variant={image.marking === true ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No images found for the selected filter</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Check;
