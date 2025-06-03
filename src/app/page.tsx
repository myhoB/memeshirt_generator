'use client';

import { useState, useRef } from 'react';
import { BiImageAdd, BiText, BiDownload, BiSmile } from 'react-icons/bi';
import Header from './components/Header';
import Footer from './components/Footer';
import TShirtCanvas from './components/TShirtCanvas';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<{ addText: (initialText?: string) => void; downloadCanvas: () => void }>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // For SVGs, we need to ensure proper encoding
        if (file.type === 'image/svg+xml') {
          const encoded = encodeURIComponent(result);
          setUploadedImage(`data:image/svg+xml;charset=utf-8,${encoded}`);
        } else {
          setUploadedImage(result);
        }
      };
      
      if (file.type === 'image/svg+xml') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    if (canvasRef.current?.addText) {
      // Add the emoji as text
      canvasRef.current.addText(emoji.native);
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFFFE]">
      <Header />
      
      <main className="flex-grow relative">
        <div className="w-full min-h-screen">
          <div className="text-center mb-12 px-4">
            <h1 className="text-5xl font-bold text-[#0B3954] mb-4">Design Your Meme Shirt</h1>
            <p className="text-xl text-[#8B575C]">Create unique and funny t-shirts with your favorite memes!</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch min-h-[80vh]">
            {/* Preview Section */}
            <div className="flex-1 px-4 md:px-8">
              <TShirtCanvas 
                ref={canvasRef}
                uploadedImage={uploadedImage}
              />
            </div>

            {/* Controls Section */}
            <div className="flex-1 px-4 md:px-8">
              <div className="h-full min-h-[600px] overflow-y-auto space-y-8 bg-white p-8 rounded-lg shadow-lg border border-[#BFD7EA]">
                <div>
                  <h2 className="text-2xl font-bold text-[#0B3954] mb-6">Customize Your Design</h2>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#BFD7EA] hover:bg-[#0B3954] text-[#0B3954] hover:text-white font-bold py-4 px-6 rounded-lg transition-colors"
                      >
                        <BiImageAdd className="w-6 h-6" />
                        Add Image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.svg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      <button
                        onClick={() => canvasRef.current?.addText()}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#BFD7EA] hover:bg-[#0B3954] text-[#0B3954] hover:text-white font-bold py-4 px-6 rounded-lg transition-colors"
                      >
                        <BiText className="w-6 h-6" />
                        Add Text
                      </button>

                      <button
                        onClick={() => setShowEmojiPicker(true)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#BFD7EA] hover:bg-[#0B3954] text-[#0B3954] hover:text-white font-bold py-4 px-6 rounded-lg transition-colors"
                      >
                        <BiSmile className="w-6 h-6" />
                        Add Emoji
                      </button>
                    </div>

                    <button
                      onClick={() => canvasRef.current?.downloadCanvas()}
                      className="w-full flex items-center justify-center gap-2 bg-[#C98986] hover:bg-[#8B575C] text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      <BiDownload className="w-6 h-6" />
                      Download Design
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-[#BFD7EA]/10 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#0B3954] mb-3">Design Tips</h3>
                  <ul className="space-y-2 text-[#8B575C]">
                    <li>🖱️ Click and drag elements to position them</li>
                    <li>↔️ Use corner handles to resize elements</li>
                    <li>🔄 Use any edge handle to rotate</li>
                    <li>✨ Double-click text to edit content</li>
                    <li>❌ Click the × button to delete selected elements</li>
                    <li>⌨️ Press Enter to save text changes, Escape to cancel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emoji Picker Modal */}
        {showEmojiPicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#0B3954]">Choose an Emoji</h3>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-[#8B575C] hover:text-[#0B3954] text-2xl"
                >
                  ×
                </button>
              </div>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
