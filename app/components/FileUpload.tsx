"use client"; // This component must be a client component

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import axios from "axios";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess?: (response: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File) => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      setError("Invalid file type. Please upload a video file.");
    }
    if(file.size > 100 * 1024 * 1024) { 
      setError("File size exceeds the limit of 100 MB.");
    }
    return true;
}

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    if (!validateFile(file)) {
      setUploading(false);
      return;
    }

    try {
        const authRes = await axios.get ("/api/auth/imageki-auth");
        const {token,expire,signature} = authRes.data;
        const res =await upload({
            // Authentication parameters
            expire,
            token,
            signature,
            publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            file,
            fileName: file.name, 
            onProgress: (event) => {
                if(event.lengthComputable && onProgress) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress(progress);
                }
            },
            
            
        });
        onSuccess?.(res);
    } catch (error) {
        console.error("Upload failed:", error);
    }

    
}


  return (
    <>
      <input type="file" 
      accept={fileType === "video"?"video/*":"image/*"} 
      onChange={handleFileChange}
      />

        {uploading && <p>Uploading...</p>}
      
    </>
  );
};

export default FileUpload;
