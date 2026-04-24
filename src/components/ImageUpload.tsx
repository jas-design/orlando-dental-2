import React, { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../lib/firebase';
import { Upload, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label, folder = 'images' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showNotification } = useNotification();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if user is authenticated
    if (!auth.currentUser) {
      showNotification("You must be logged in to upload images.", "error");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB to be safe)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("File is too large. Max 5MB.", "error");
      return;
    }

    setUploading(true);

    try {
      console.log("Starting upload for file:", file.name, "type:", file.type);
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      // Adding metadata can help some browsers process the upload more reliably
      const metadata = {
        contentType: file.type || 'image/jpeg'
      };

      const result = await uploadBytes(storageRef, file, metadata);
      console.log("Upload successful, getting download URL...");
      const downloadURL = await getDownloadURL(result.ref);
      
      onChange(downloadURL);
      showNotification("Image uploaded successfully!");
    } catch (error: any) {
      console.error("FULL Upload error:", error);
      
      let message = "Upload failed.";
      const errorCode = error.code || 'unknown';

      if (errorCode === 'storage/unauthorized') {
        message = "Permission Denied. 1. Go to Firebase Console > Storage > Rules. 2. Set to: allow read, write: if request.auth != null;";
      } else if (errorCode === 'storage/retry-limit-exceeded' || error.message?.includes('CORS')) {
        message = "CORS Blocked. You must configure CORS in Google Cloud Shell: GSUTIL set cors [JSON_FILE] gs://[BUCKET]";
      } else if (errorCode === 'storage/project-not-found') {
        message = "Storage not initialized. Go to Firebase Console > Storage and click 'Get Started'.";
      } else {
        message = `Upload failed (${errorCode}). Check Console for details or paste a direct image URL instead.`;
      }
      
      showNotification(message, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">{label}</label>}
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Paste URL Input */}
        <div className="flex-1 relative group">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL here..."
            className="w-full p-4 pl-12 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-gray-300 text-sm font-medium" 
          />
        </div>

        {/* Or Upload Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full md:w-auto px-8 bg-brand-primary text-white rounded-2xl font-bold transition-all hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/10 whitespace-nowrap min-h-[56px]"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {uploading && (
        <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-brand-primary animate-pulse w-full" />
        </div>
      )}

      {value && (
        <div className="relative group mt-4">
          <div className="w-full max-w-sm aspect-[16/9] rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-50 relative">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80';
              }}
            />
            {/* Overlay for actions */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <button 
                type="button"
                onClick={() => onChange('')}
                className="bg-white text-brand-dark p-3 rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center max-w-sm uppercase tracking-widest font-bold">Image Preview</p>
        </div>
      )}
    </div>
  );
}
