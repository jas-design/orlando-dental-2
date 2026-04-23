import React, { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);
  const { showNotification } = useNotification();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotification("File is too large. Max 10MB.", "error");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      // Use uploadBytes for maximum reliability
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      onChange(downloadURL);
      setUploading(false);
      setProgress(0);
      showNotification("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      showNotification("Upload failed. Please check your storage permissions or connection.", "error");
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">{label}</label>}
      
      <div className="relative group">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or upload..."
            className="flex-1 p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-6 bg-brand-primary text-white rounded-2xl font-bold transition-all hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            <span className="hidden md:inline">Upload</span>
          </button>
        </div>

        {uploading && (
           <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
           </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {value && (
        <div className="relative w-fit">
          <div className="w-40 h-24 rounded-xl overflow-hidden border-2 border-white shadow-md bg-gray-50">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80';
              }}
            />
          </div>
          <button 
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
