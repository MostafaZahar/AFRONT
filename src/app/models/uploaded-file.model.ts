export interface UploadedFile {
    id: number;
    fileName: string;
    filePath: string;
    uploadDate: Date;
    userId: string;
    status: string; // "Success" or "Failed"
  }
  