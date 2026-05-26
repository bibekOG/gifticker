import type { UploadedFile } from "../../services/storageService.js";
import { supabase } from "../supabase.js";

interface UploadRow {
  id: string;
  original_name: string;
  file_name: string;
  mime_type: string;
  size: number;
  storage_path: string;
  created_at: string;
}

function rowToUpload(row: UploadRow): UploadedFile {
  return {
    id: row.id,
    originalName: row.original_name,
    fileName: row.file_name,
    mimeType: row.mime_type,
    size: row.size,
    path: row.storage_path,
  };
}

export const uploadRepository = {
  async create(file: UploadedFile): Promise<UploadedFile> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("uploads")
      .insert({
        original_name: file.originalName,
        file_name: file.fileName,
        mime_type: file.mimeType,
        size: file.size,
        storage_path: file.path,
      })
      .select()
      .single();

    if (error) throw error;
    return rowToUpload(data);
  },
};
