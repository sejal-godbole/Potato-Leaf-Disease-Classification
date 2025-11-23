import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import { Upload, X, CheckCircle, AlertTriangle, Leaf, Loader2, Image as ImageIcon, Sprout } from 'lucide-react';

// Ensure this matches your running FastAPI server port
const API_URL = "http://localhost:8000/predict";

const App = () => {
  // --- State Management ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // --- Effects ---
  // Clean up object URLs to prevent memory leaks when the component updates
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // --- Event Handlers ---
  
  // Handle file selection via Input Click
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    handleFileSelection(file);
  };

  // Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Centralized File Logic
  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  // Clear the current state to start over
  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  // --- API Logic ---
  const sendFile = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Send POST request to FastAPI
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Delay slightly for better UI experience (optional)
      setTimeout(() => {
        setResult(res.data);
        setIsLoading(false);
      }, 400);

    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Is FastAPI running on port 8000?");
      setIsLoading(false);
    }
  };

  // --- UI Helper ---
  // Returns colors and icons based on the specific disease
  const getResultStyle = (label) => {
    switch (label) {
      case 'Healthy':
        return { 
          bg: 'bg-green-50', 
          border: 'border-green-200',
          text: 'text-green-800', 
          bar: 'bg-green-500',
          icon: <CheckCircle className="w-8 h-8 text-green-600" />
        };
      case 'Early Blight':
        return { 
          bg: 'bg-yellow-50', 
          border: 'border-yellow-200',
          text: 'text-yellow-800', 
          bar: 'bg-yellow-500',
          icon: <AlertTriangle className="w-8 h-8 text-yellow-600" />
        };
      case 'Late Blight':
        return { 
          bg: 'bg-red-50', 
          border: 'border-red-200',
          text: 'text-red-800', 
          bar: 'bg-red-500',
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          border: 'border-gray-200',
          text: 'text-gray-800', 
          bar: 'bg-gray-500',
          icon: <Leaf className="w-8 h-8 text-gray-600" />
        };
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-900 from-green-50 via-white to-emerald-100 font-sans text-slate-800 flex flex-col">
      
      {/* Navbar */}
      <nav className="w-full shadow-black bg-white/80 backdrop-blur-md border-b border-green-100 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 mr-4 hidden sm:inline">Project By Sejal Sampat Godbole</span>
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Sprout size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Agro<span className="text-green-600">AI</span></span>
          </div>
          <div className="text-sm font-medium text-slate-500 hidden sm:block">Potato Disease Classification</div>
        </div>
      </nav>
      


      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-20 pb-12 px-4">
        
        <div className="w-full max-w-3xl">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Potato Leaf Disease Classification</h3>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-green-900/5 overflow-hidden border border-slate-100">
            
            {/* Header Section inside Card */}
            <div className="bg-green-900 px-8 py-6 text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Upload Leaf Image</h1>
              <p className="text-green-100 text-sm">Detect Early Blight, Late Blight, or Healthy plants instantly.</p>
            </div>

            <div className="p-8">
              {/* 1. Upload State */}
              {!preview ? (
                <div 
                  className={`
                    relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ease-out cursor-pointer group
                    ${dragActive 
                      ? "border-green-500 bg-green-50 scale-[1.02]" 
                      : "border-slate-300 hover:border-green-400 hover:bg-slate-50"
                    }
                  `}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={onSelectFile}
                    accept="image/*"
                  />
                  
                  <div className="flex flex-col items-center justify-center gap-4 transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-700">Drag & drop or click to upload</p>
                      <p className="text-sm text-slate-400 mt-1">Supports JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 2. Preview & Result State */
                <div className="space-y-6">
                  
                  {/* Image Preview Box */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video shadow-inner flex items-center justify-center group">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="h-full w-full object-contain" 
                    />
                    <button 
                      onClick={clearSelection}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                      <AlertTriangle className="shrink-0" size={20} />
                      {error}
                    </div>
                  )}

                  {/* Action Button (Hide if we have a result) */}
                  {!result && (
                    <button
                      onClick={sendFile}
                      disabled={isLoading}
                      className={`
                        w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-900/10 transition-all duration-200 flex items-center justify-center gap-3
                        ${isLoading 
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        }
                      `}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <ImageIcon /> Analyze Leaf
                        </>
                      )}
                    </button>
                  )}

                  {/* 3. Prediction Results */}
                  {result && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {(() => {
                        const style = getResultStyle(result.class);
                        return (
                          <div className={`p-6 rounded-2xl border ${style.bg} ${style.border} text-center space-y-4`}>
                            
                            <div className="flex flex-col items-center gap-2">
                              <div className="bg-white p-3 rounded-full shadow-sm">
                                {style.icon}
                              </div>
                              <h3 className={`text-2xl font-bold ${style.text}`}>
                                {result.class}
                              </h3>
                            </div>

                            {/* Confidence Bar */}
                            <div className="w-full bg-white/60 rounded-full h-3 overflow-hidden shadow-inner">
                              <div 
                                className={`h-full ${style.bar} transition-all duration-1000 ease-out`}
                                style={{ width: `${(result.confidence * 100).toFixed(1)}%` }}
                              />
                            </div>
                            
                            <div className="flex justify-between text-sm font-medium opacity-80 px-2">
                              <span>Confidence Score</span>
                              <span>{(result.confidence * 100).toFixed(2)}%</span>
                            </div>

                            <button 
                              onClick={clearSelection}
                              className="mt-2 text-sm text-slate-500 hover:text-green-600 underline underline-offset-4"
                            >
                              Analyze another image
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            &copy; {new Date().getFullYear()} Potato Disease Classification Project by Sejal Sampat Godbole. All rights reserved.
          </p>

        </div>
      </main>
    </div>
  );
};

export default App;