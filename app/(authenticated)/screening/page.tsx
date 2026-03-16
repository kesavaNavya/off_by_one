'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { addCase, getCasesFromStorage, saveCasesToStorage } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle2, Loader2, Image } from 'lucide-react';

export default function ScreeningPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patient_name: '',
    age: '',
    gender: 'M',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.patient_name || !formData.age || !file) {
      setError('Please fill in all fields and select an image');
      return;
    }

    setLoading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create new case in mock storage
      const newCase = addCase({
        patient_name: formData.patient_name,
        age: parseInt(formData.age),
        gender: formData.gender,
        status: 'Pending',
        image_path: '/uploads/sample-retina-new.jpg',
        doctor_id: user?.id || 'user_demo',
      });

      setSuccess('Image uploaded successfully!');
      setTimeout(() => {
        router.push(`/cases/${newCase.id}`);
      }, 1500);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">New Screening</h1>
        <p className="text-muted-foreground mt-1">Upload a retinal image for DR screening analysis</p>
      </div>

      {/* Form Card */}
      <Card className="border-border/30 max-w-2xl">
        <CardHeader>
          <CardTitle>Retinal Image Upload</CardTitle>
          <CardDescription>
            Provide patient information and upload a fundus photograph for automated analysis
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="border-destructive/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500/30 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
              </Alert>
            )}

            {/* Patient Information Section */}
            <div className="space-y-4 pb-6 border-b border-border/30">
              <h3 className="font-semibold text-foreground">Patient Information</h3>

              <div className="space-y-2">
                <label htmlFor="patient_name" className="text-sm font-medium text-foreground">
                  Patient Name *
                </label>
                <Input
                  id="patient_name"
                  name="patient_name"
                  placeholder="Enter patient full name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="border-border/30 focus:border-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="age" className="text-sm font-medium text-foreground">
                    Age *
                  </label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="Patient age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="border-border/30 focus:border-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium text-foreground">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full h-10 px-3 rounded-md border border-border/30 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Retinal Image</h3>

              <div className="relative border-2 border-dashed border-border/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-accent/5">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {preview ? (
                  <div className="space-y-4">
                    <Image className="w-12 h-12 mx-auto text-primary opacity-50" />
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-w-xs h-48 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-sm text-foreground font-medium">{file?.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFile(null);
                        setPreview('');
                      }}
                      disabled={loading}
                      className="border-border/30"
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                    <div>
                      <p className="font-semibold text-foreground">Drag and drop your image here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !file}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Uploading...' : 'Upload & Analyze'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="border-border/30"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-border/30 bg-accent/5">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3">Guidelines for Best Results</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Use clear, high-quality fundus photography</li>
            <li>✓ Ensure adequate lighting and contrast</li>
            <li>✓ Include the optic disc and macula in the image</li>
            <li>✓ Avoid shadows and reflections on the retina</li>
            <li>✓ File should be in JPG or PNG format</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
