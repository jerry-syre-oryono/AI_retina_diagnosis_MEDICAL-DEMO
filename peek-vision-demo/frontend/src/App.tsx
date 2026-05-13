'use client';

import { useState, useEffect } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle2, Loader2, History, XCircle } from 'lucide-react';

// Replicate the Report type from the backend
interface Report {
  id: string;
  filename: string;
  createdAt: string;
  analysis: {
    result: 'normal' | 'abnormal' | string; // Allow string for initial parsing
    confidence: number | string;
    recommendations: string[];
    rawOutput?: any;
  };
}

export default function PeekVisionDemo() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<Report['analysis'] | null>(null);
  const [reports, setReports] = useState<Report[]>([]); // State to store historical reports

  // Fetch reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/reports");
        const data: Report[] = await res.json();
        // Sort reports by createdAt in descending order
        setReports(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    fetchReports();
  }, []); // Empty dependency array means this runs once on mount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null); // Clear previous analysis result
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:4000/analyze", {
        method: "POST",
        body: formData,
      });

      const newReport: Report = await res.json();
      setResult(newReport.analysis); // Display the analysis of the new report
      setReports(prevReports => [newReport, ...prevReports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // Add new report to history and re-sort
      setFile(null); // Clear the file input after successful analysis
    } catch (err) {
      console.error("Error analyzing image:", err);
      // You might want to set an error state here to show in the UI
      setResult({
        result: 'Analysis Failed',
        confidence: 'N/A',
        recommendations: ['Please try again or contact support.'],
        rawOutput: err,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">PeekVision</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">How It Works</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">Science</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition">About</a>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
                  For Clinicians
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-16 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Retinal Screening
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload a retinal image and get instant AI-powered screening insights. 
              Fast, accurate, and built for early detection.
            </p>
            <div className="inline-flex items-center bg-amber-50 text-amber-800 px-6 py-3 rounded-full text-sm font-medium">
              <AlertCircle className="w-5 h-5 mr-2" />
              Demo Only — Not for clinical diagnosis
            </div>
          </div>
        </section>

        {/* Upload Card */}
        <section className="px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                <h3 className="text-2xl font-bold text-white">Upload Eye Image for Analysis</h3>
                <p className="text-blue-100 mt-2">Supports high-resolution fundus photography</p>
              </div>

              <div className="p-10">
                {!file ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <label className="cursor-pointer">
                      <span className="text-lg font-medium text-blue-600 hover:text-blue-700">
                        Click to upload
                      </span>{' '}
                      <span className="text-gray-600">or drag and drop</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG up to 10MB • Recommended: 2000+ pixels
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{file.name}</p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        ×
                      </button>
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>Analyzing with DeepSeek AI...</span>
                        </>
                      ) : (
                        <>
                          <span>Start Analysis</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Current Analysis Result */}
                {result && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Latest Analysis Report</h3>
                    <div className={`p-6 rounded-xl border-2 ${
                      result.result && typeof result.result === 'string' && (result.result.toLowerCase().includes('normal') || result.result.toLowerCase().includes('no significant abnormalities'))
                        ? 'bg-green-50 border-green-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="flex items-start space-x-4">
                        {result.result && typeof result.result === 'string' && (result.result.toLowerCase().includes('normal') || result.result.toLowerCase().includes('no significant abnormalities')) ? (
                          <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-10 h-10 text-red-600 flex-shrink-0" />
                        )}
                        <div className="flex-grow">
                          <h4 className={`text-xl font-bold ${
                            result.result && typeof result.result === 'string' && (result.result.toLowerCase().includes('normal') || result.result.toLowerCase().includes('no significant abnormalities')) ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {result.result && typeof result.result === 'string' && (result.result.toLowerCase().includes('normal') || result.result.toLowerCase().includes('no significant abnormalities')) ? 'No Significant Abnormalities Detected' : 'Potential Abnormality Detected'}
                          </h4>
                          <p className="text-gray-700 mt-2">
                            <strong className="font-semibold">Detailed findings:</strong> {result.result}
                          </p>
                          <p className="text-gray-700 mt-2">
                            <strong className="font-semibold">Confidence:</strong> {result.confidence}
                          </p>
                          <div className="text-gray-700 mt-2">
                            <strong className="font-semibold">Recommendations:</strong>
                            {result.recommendations && result.recommendations.length > 0 ? (
                              <ul className="list-disc list-inside mt-1">
                                {result.recommendations.map((rec: string, i: number) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>N/A</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                <strong>Important:</strong> This is a demonstration tool using AI heuristics. 
                Results are not medically validated and should not replace professional diagnosis.
              </p>
            </div>
          </div>
        </section>

        {/* Reports History Section */}
        <section className="px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-700 px-8 py-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <History className="w-7 h-7 mr-3" /> Analysis History
                </h3>
                <p className="text-purple-100 mt-2">Browse your past retinal image analyses</p>
              </div>

              <div className="p-8">
                {reports.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-lg">No analysis reports yet.</p>
                    <p className="text-md">Upload an image above to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-lg text-gray-800">
                            Report for "{report.filename}"
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className={`p-4 rounded-md border-l-4 ${
                          report.analysis.result && typeof report.analysis.result === 'string' && (report.analysis.result.toLowerCase().includes('normal') || report.analysis.result.toLowerCase().includes('no significant abnormalities'))
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                        }`}>
                          <p className="text-md text-gray-700">
                            <strong className="font-medium">Status:</strong>{' '}
                            {report.analysis.result && typeof report.analysis.result === 'string' && (report.analysis.result.toLowerCase().includes('normal') || report.analysis.result.toLowerCase().includes('no significant abnormalities'))
                              ? 'Normal'
                              : 'Abnormal'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong className="font-medium">Findings:</strong> {report.analysis.result}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong className="font-medium">Confidence:</strong> {report.analysis.confidence}
                          </p>
                          <div className="text-sm text-gray-600 mt-1">
                            <strong className="font-medium">Recommendations:</strong>
                            {report.analysis.recommendations && report.analysis.recommendations.length > 0 ? (
                              <ul className="list-disc list-inside ml-4 mt-1">
                                {report.analysis.recommendations.map((rec: string, i: number) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            ) : (
                              <span> N/A</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">© 2025 PeekVision • Research & Demonstration Use Only</p>
          </div>
        </footer>
      </div>
    </>
  );
}