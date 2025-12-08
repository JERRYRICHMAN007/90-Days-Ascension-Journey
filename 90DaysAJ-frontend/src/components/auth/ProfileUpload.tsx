import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ProfileUpload() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(user?.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when user avatar changes
  useEffect(() => {
    if (user?.avatarUrl) {
      setPreview(user.avatarUrl);
    }
    // Clear any persistent errors when user data is available
    if (user && error && error.includes('Session expired')) {
      setError('');
    }
  }, [user?.avatarUrl, user]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = selectedFile || fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Step 1: Get presigned URL
      const presignResponse = await api.request('/files/presign', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          purpose: 'avatar',
          size: file.size,
        }),
      });

      // Handle response format: { success: true, data: {...} } or direct response
      const presignData = presignResponse.data || presignResponse;
      const { uploadUrl, fileKey } = presignData;

      if (!uploadUrl || !fileKey) {
        throw new Error('Failed to get upload URL');
      }

      // Step 2: Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image to storage');
      }

      // Step 3: Confirm upload
      const confirmResponse = await api.request('/files/confirm', {
        method: 'POST',
        body: JSON.stringify({
          fileKey,
          purpose: 'avatar',
        }),
      });

      // Handle response format: { success: true, data: {...} } or direct response
      const confirmData = confirmResponse.data || confirmResponse;
      const avatarUrl = confirmData?.url || confirmData?.avatarUrl;

      // Refresh user data to get updated avatar URL
      await refreshUser();
      
      // Update preview with new URL
      if (avatarUrl) {
        setPreview(avatarUrl);
      } else if (user?.avatarUrl) {
        setPreview(user.avatarUrl);
      }

      // Clear file input and selected file
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      let errorMessage = 'Upload failed. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Check if it's a session error
      if (errorMessage.toLowerCase().includes('session expired') || 
          errorMessage.toLowerCase().includes('401') ||
          errorMessage.toLowerCase().includes('unauthorized')) {
        errorMessage = 'Session expired. Please login again.';
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(user?.avatarUrl || null);
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className="text-destructive hover:text-destructive/80 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-6">
        <div className="relative">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>

          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
            </Button>
          )}

          <p className="text-xs text-muted-foreground">
            JPEG, PNG, or WebP. Max 5MB. Image will be resized automatically.
          </p>
        </div>
      </div>
    </Card>
  );
}

