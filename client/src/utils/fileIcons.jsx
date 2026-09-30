import React from 'react';
import { LuFileText, LuImage, LuFile } from 'react-icons/lu';

// Returns appropriate file icon based on file type or extension
export const getFileIcon = (file, size = 20) => {
  const name = typeof file === 'string'
    ? file
    : (file?.originalName || file?.filePath || file?.name || '');
  const mime = file?.mimeType || '';
  const ext = name.split('.').pop()?.toLowerCase();

  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
    return <LuImage size={size} />;
  }
  if (mime === 'application/pdf' || ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
    return <LuFileText size={size} />;
  }
  return <LuFile size={size} />;
};
