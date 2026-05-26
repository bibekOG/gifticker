import { useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export function useFileUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      navigate("/canvas");
    }
  };

  return { fileInputRef, handleUploadClick, handleFileChange };
}
