import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Upload, X, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ProfilePhotoModal({ isOpen, onClose }) {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(user?.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Update preview when user avatar changes or modal opens
  useEffect(() => {
    if (user?.avatarUrl) {
      setPreview(user.avatarUrl);
    } else {
      setPreview(null);
    }
    setSelectedFile(null);
    setError('');
  }, [user?.avatarUrl, isOpen]);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFileSelect = (e) => {
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
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = selectedFile || fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      console.log('Starting file upload process...');
      // Step 1: Get presigned URL
      console.log('Requesting presigned URL...');
      const presignResponse = await api.request('/files/presign', {
        method: 'POST',
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          purpose: 'avatar',
          size: file.size,
        }),
      });
      console.log('Presigned URL received:', presignResponse);

      const presignData = presignResponse.data || presignResponse;
      const { uploadUrl, fileKey } = presignData;

      if (!uploadUrl || !fileKey) {
        throw new Error('Failed to get upload URL');
      }

      // Step 2: Upload to S3
      console.log('Uploading file to S3...');
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        console.error('S3 upload failed:', uploadResponse.status, uploadResponse.statusText);
        throw new Error('Failed to upload image to storage');
      }
      console.log('File uploaded to S3 successfully');

      // Step 3: Confirm upload and save to database
      console.log('Confirming upload...');
      const confirmResponse = await api.request('/files/confirm', {
        method: 'POST',
        body: JSON.stringify({
          fileKey,
          purpose: 'avatar',
        }),
      });
      console.log('Upload confirmed:', confirmResponse);

      const confirmData = confirmResponse.data || confirmResponse;
      const avatarUrl = confirmData?.url || confirmData?.avatarUrl;

      if (!avatarUrl) {
        throw new Error('Failed to get avatar URL after upload');
      }

      // Step 4: Update user profile with avatar URL
      try {
        console.log('Updating user profile with avatar URL:', avatarUrl);
        const updateResult = await api.updateUser({
          avatarUrl: avatarUrl,
        });
        console.log('User profile updated successfully:', updateResult);
      } catch (updateError) {
        console.error('Error updating user profile:', updateError);
        // If update fails but file was uploaded, still try to refresh
        // The file is already in storage, we just need to update the DB reference
        throw updateError;
      }

      // Refresh user data to get updated avatar URL
      await refreshUser();

      // Clear file input and selected file
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Close modal on success
      onClose();
    } catch (err) {
      console.error('Upload error details:', {
        error: err,
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      
      let errorMessage = 'Upload failed. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      // Check for network errors - provide more helpful messages
      if (
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Network request failed') ||
        err.message?.includes('ERR_CONNECTION_REFUSED') ||
        err.message?.includes('ERR_NETWORK')
      ) {
        errorMessage = 'Connection failed. Please check if the server is running.';
      }

      // Check for CORS errors
      if (err.message?.includes('CORS') || err.message?.includes('Access-Control')) {
        errorMessage = 'CORS error. Please check backend CORS configuration.';
      }

      if (
        errorMessage.toLowerCase().includes('session expired') ||
        errorMessage.toLowerCase().includes('401') ||
        errorMessage.toLowerCase().includes('unauthorized')
      ) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user?.avatarUrl) {
      setPreview(null);
      setSelectedFile(null);
      return;
    }

    setRemoving(true);
    setError('');

    try {
      console.log('Removing avatar from user profile');
      // Update user profile to remove avatar URL
      const updateResult = await api.updateUser({
        avatarUrl: null,
      });
      console.log('Avatar removed successfully:', updateResult);

      // Refresh user data
      await refreshUser();

      // Clear preview and selected file
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Close modal on success
      onClose();
    } catch (err) {
      console.error('Remove error details:', {
        error: err,
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      
      let errorMessage = 'Failed to remove photo. Please try again.';

      if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      // Check for network errors - provide more helpful messages
      if (
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('Network request failed') ||
        err.message?.includes('ERR_CONNECTION_REFUSED') ||
        err.message?.includes('ERR_NETWORK')
      ) {
        errorMessage = 'Connection failed. Please check if the server is running.';
      }

      // Check for CORS errors
      if (err.message?.includes('CORS') || err.message?.includes('Access-Control')) {
        errorMessage = 'CORS error. Please check backend CORS configuration.';
      }

      setError(errorMessage);
    } finally {
      setRemoving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original avatar
    if (user?.avatarUrl) {
      setPreview(user.avatarUrl);
    } else {
      setPreview(null);
    }
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Profile Photo</DialogTitle>
          <DialogDescription className="text-left pt-2">
            Upload a clear photo of yourself.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Profile Photo Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Profile Photo</h3>
            <div className="flex flex-col items-center gap-4">
              {/* Profile Picture Display */}
              <div className="relative">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-border"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-4xl font-bold text-white border-2 border-border">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || removing}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || removing}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Change photo
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRemove}
                  disabled={uploading || removing || !user?.avatarUrl}
                  className="flex-1"
                >
                  {removing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Remove photo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          {/* Instructions */}
          <p className="text-xs text-muted-foreground text-center">
            JPEG, PNG, or WebP. Max 5MB. Image will be resized automatically.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={uploading || removing}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || removing || !selectedFile}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

