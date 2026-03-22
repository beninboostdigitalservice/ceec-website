import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2, FileText, Film, Image } from "lucide-react";

interface MultiFileUploadProps {
  bucket: string;
  values: string[];
  onChange: (urls: string[]) => void;
  label: string;
  accept?: string;
  type?: "image" | "video" | "document";
}

const MultiFileUpload = ({ bucket, values, onChange, label, accept = "image/*", type = "image" }: MultiFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${safeName}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (error) {
        console.error("Upload error:", error.message);
        continue;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      newUrls.push(data.publicUrl);
    }

    onChange([...values, ...newUrls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const Icon = type === "video" ? Film : type === "document" ? FileText : Image;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {values.map((url, i) => (
            <div key={i} className="relative group">
              {type === "image" ? (
                <img src={url} alt="" className="w-24 h-24 object-cover rounded-lg border border-border" />
              ) : (
                <div className="w-24 h-24 rounded-lg border border-border bg-muted flex flex-col items-center justify-center gap-1 px-1" title={url.split("/").pop()?.replace(/^\d+-/, "") || ""}>
                  <Icon size={20} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground text-center truncate w-full">
                    {url.split("/").pop()?.replace(/^\d+-/, "") || "Fichier"}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full py-6 rounded-lg border-2 border-dashed border-input bg-background text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex flex-col items-center gap-2"
      >
        {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
        <span className="text-sm">{uploading ? "Téléversement..." : "Cliquez pour ajouter des fichiers"}</span>
      </button>
      <input ref={inputRef} type="file" accept={accept} multiple onChange={handleUpload} className="hidden" />
    </div>
  );
};

export default MultiFileUpload;
