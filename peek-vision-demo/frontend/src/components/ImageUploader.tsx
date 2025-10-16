import React, { useState } from "react";

const ImageUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 👈 new state for image preview
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false); // 👈 Tracks if AI is running

  // Handle user selecting an image file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 👈 create and set preview URL
      setResult(null); // reset old results
    }
  };

  // Handle upload and call backend for analysis
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true); // 👈 start loader animation
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      // POST the file to your backend API
      const res = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        body: formData,
      });

      // Parse JSON returned by backend (AI conclusions)
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error analyzing image:", err);
    } finally {
      setLoading(false); // 👈 stop loader animation
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white text-center max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Eye Image for Analysis</h2>

      {/* File input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
      />

      {/* Upload/Analyze button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* Loader feedback */}
      {loading && (
        <div className="mt-4 text-gray-600 animate-pulse">
          ⏳ Analyzing image with DeepSeek AI...
        </div>
      )}

      {/* Results display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
          <div className="row">
            <div>
              {previewUrl && <img src={previewUrl} alt="preview" style={{ maxWidth: 320 }} />}
            </div>
            <div>
              <h3 className="font-semibold">Result: {result.result}</h3>
              <p>Confidence: {result.confidence}</p>

              {result.recommendations && result.recommendations.length > 0 && (
                <>
                  <p className="mt-2 font-medium">Recommendations:</p>
                  <ul className="list-disc ml-5 mt-2 text-sm">
                    {result.recommendations.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;