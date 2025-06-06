import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { MapPin, Upload, X, Camera } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { ReportFormData, IssueCategory } from '../../types';
import toast from 'react-hot-toast';

interface LocationPickerProps {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setPosition([position.lat, position.lng]);
        },
      }}
    />
  );
};

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'roads', label: 'Roads & Sidewalks' },
  { value: 'lighting', label: 'Street Lighting' },
  { value: 'trash', label: 'Trash & Sanitation' },
  { value: 'water', label: 'Water Services' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'safety', label: 'Public Safety' },
  { value: 'noise', label: 'Noise Complaint' },
  { value: 'other', label: 'Other' }
];

const IssueForm: React.FC = () => {
  const [position, setPosition] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [userLocationLoaded, setUserLocationLoaded] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ReportFormData>();

  // Get user's location for the map
  React.useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setUserLocationLoaded(true);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserLocationLoaded(true); // Still mark as loaded so the form is usable
          toast.error("Couldn't determine your location. Please select manually.");
        }
      );
    } else {
      setUserLocationLoaded(true);
      toast.error("Geolocation is not supported by your browser.");
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviewUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newPreviewUrls.push(URL.createObjectURL(file));
      }
    }
    
    setPhotoPreviewUrls(newPreviewUrls);
  };

  const removePhoto = (index: number) => {
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      setIsSubmitting(true);
      
      // Update location with the current position from the map
      const formData = {
        ...data,
        location: {
          lat: position[0],
          lng: position[1],
        }
      };
      
      console.log("Form data to submit:", formData);
      
      // This would normally send data to the backend
      // await api.submitIssue(formData);
      
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Issue reported successfully!");
      reset();
      setPhotoPreviewUrls([]);
      
    } catch (error) {
      console.error("Error submitting issue:", error);
      toast.error("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Report an Issue</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Brief title describing the issue"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            defaultValue="other"
            rules={{ required: 'Please select a category' }}
            render={({ field }) => (
              <select
                id="category"
                {...field}
                className={`w-full px-4 py-2 border rounded-md bg-white focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { 
              required: 'Description is required',
              minLength: { 
                value: 20, 
                message: 'Description should be at least 20 characters' 
              } 
            })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Provide detailed information about the issue..."
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Location on map */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="text-xs text-gray-500 flex items-center">
              <MapPin size={14} className="mr-1" />
              <span>Click on map or drag the marker to set location</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full border border-gray-300 rounded-md overflow-hidden">
            {userLocationLoaded ? (
              <MapContainer 
                center={position} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos
          </label>
          
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Camera size={48} className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="photos"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload photos</span>
                  <input
                    id="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    {...register('photos')}
                    onChange={handlePhotoChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>
          
          {/* Photo previews */}
          {photoPreviewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {photoPreviewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                    <img
                      src={url}
                      alt={`Upload preview ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;