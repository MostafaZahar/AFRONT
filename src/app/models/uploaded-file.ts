// src/app/models/uploaded-file.model.ts
export interface uploadedfile {
    id: number;
    fileName: string;
    filePath: string;
    uploadDate: Date;
    userId: string;
    status: string; // "Success" or "Failed"
  }
  