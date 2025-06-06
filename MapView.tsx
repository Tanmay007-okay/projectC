import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Issue, IssueCategory, IssueStatus } from '../../types';
import IssueCard from '../issues/IssueCard';
import { useNavigate } from 'react-router-dom';
import MarkerClusterGroup from 'react-leaflet-cluster';

interface MapControlsProps {
  userLocation: [number, number] | null;
  onCenterUser: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({ userLocation, onCenterUser }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView(userLocation, 15);
    }
  }, [userLocation, map]);
  
  return (
    <div className="absolute right-4 top-4 z-400 flex flex-col space-y-2">
      <button 
        onClick={onCenterUser}
        disabled={!userLocation}
        className="bg-white p-2 rounded-md shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Center on my location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-800" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

// Helper to get marker color based on category and status
const getMarkerColor = (category: IssueCategory, status: IssueStatus): string => {
  if (status === 'resolved') return '#10B981'; // green
  if (status === 'in_progress') return '#3B82F6'; // blue
  
  // Colors by category for reported/under_review
  switch (category) {
    case 'roads': return '#EF4444'; // red
    case 'lighting': return '#F59E0B'; // amber
    case 'trash': return '#6366F1'; // indigo
    case 'water': return '#06B6D4'; // cyan
    case 'electricity': return '#F97316'; // orange
    case 'safety': return '#DC2626'; // red
    case 'noise': return '#8B5CF6'; // violet
    default: return '#6B7280'; // gray
  }
};

// Create custom marker icon
const createMarkerIcon = (category: IssueCategory, status: IssueStatus) => {
  const color = getMarkerColor(category, status);
  return divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; justify-content: center; align-items: center;"></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface MapViewProps {
  issues: Issue[];
  filters: {
    categories: IssueCategory[];
    statuses: IssueStatus[];
  };
}

const MapView: React.FC<MapViewProps> = ({ issues, filters }) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const navigate = useNavigate();
  
  // Filter issues based on selected categories and statuses
  const filteredIssues = issues.filter(issue => {
    const categoryMatch = filters.categories.length === 0 || filters.categories.includes(issue.category);
    const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(issue.status);
    return categoryMatch && statusMatch;
  });
  
  useEffect(() => {
    // Get user's location
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to a central location of the city if user location is not available
          setUserLocation([40.7128, -74.0060]); // New York City coordinates as default
        }
      );
    }
  }, []);
  
  const handleCenterUser = () => {
    if (userLocation) {
      // This will be handled by the MapControls component
    }
  };
  
  return (
    <div className="h-full w-full relative">
      {userLocation ? (
        <MapContainer 
          center={userLocation} 
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          <Marker 
            position={userLocation}
            icon={divIcon({
              html: `<div class="pulse-marker"></div>`,
              className: '',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
          
          {/* Issue markers with clustering */}
          <MarkerClusterGroup>
            {filteredIssues.map(issue => (
              <Marker 
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={createMarkerIcon(issue.category, issue.status)}
              >
                <Popup>
                  <div className="w-60 sm:w-72">
                    <IssueCard 
                      issue={issue} 
                      compact 
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    />
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
          
          <MapControls userLocation={userLocation} onCenterUser={handleCenterUser} />
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;