import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  label: string;
}

const ImageUpload = ({ bucket, value, onChange, label }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      console.error("Upload error:", error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Aperçu" className="w-32 h-32 object-cover rounded-lg border border-border" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-8 rounded-lg border-2 border-dashed border-input bg-background text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex flex-col items-center gap-2"
        >
          {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
          <span className="text-sm">{uploading ? "Téléversement..." : "Cliquez pour choisir une image"}</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default ImageUpload;
