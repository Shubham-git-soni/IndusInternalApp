'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: string;
}

interface FileUploaderProps {
  onFilesChange?: (files: File[]) => void;
  existingFiles?: Array<{ id: string; name: string; url: string }>;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export default function FileUploader({
  onFilesChange,
  existingFiles = [],
  maxFiles = 10,
  maxSizeMB = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt']
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: UploadedFile[] = [];

    files.forEach(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`${file.name} exceeds ${maxSizeMB}MB limit`);
        return;
      }

      const fileObject: UploadedFile = {
        id: `${Date.now()}-${file.name}`,
        file,
        url: URL.createObjectURL(file),
        type: file.type
      };

      validFiles.push(fileObject);
    });

    const newFiles = [...uploadedFiles, ...validFiles];
    setUploadedFiles(newFiles);

    if (onFilesChange) {
      onFilesChange(newFiles.map(f => f.file));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);

    // Revoke object URL to prevent memory leaks
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
    }

    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-600" />;
    } else if (type.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    } else {
      return <File className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium text-sm">Attachments</span>
            <Badge variant="secondary" className="text-xs">
              {uploadedFiles.length + existingFiles.length}/{maxFiles}
            </Badge>
          </div>
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadedFiles.length + existingFiles.length >= maxFiles}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Max {maxFiles} files • {maxSizeMB}MB per file • Images, PDF, Word, Excel
          </p>
        </div>

        {/* Existing Files (from server) */}
        {existingFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Existing Files</p>
            {existingFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
              >
                <File className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file.url, '_blank')}
                  className="shrink-0"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Newly Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {existingFiles.length > 0 && (
              <p className="text-xs font-medium text-muted-foreground">New Files</p>
            )}
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border"
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>
                {file.type.startsWith('image/') && (
                  <img
                    src={file.url}
                    alt={file.file.name}
                    className="w-12 h-12 object-cover rounded shrink-0"
                  />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length === 0 && existingFiles.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No files attached</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}