import React, { useState } from "react";

interface ImageUploaderProps {
  onReport: (report: any) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onReport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      onReport(null); // Clear previous report
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      onReport({
        ...data,
        previewUrl,
        filename: selectedFile.name,
      });
    } catch (err) {
      console.error("Error analyzing image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white text-center max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Eye Image for Analysis</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
      />

      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {loading && (
        <div className="mt-4 text-gray-600 animate-pulse">
          ⏳ Analyzing image with DeepSeek AI...
        </div>
      )}
    </div>
  );
};

export default ImageUploader;