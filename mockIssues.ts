import { Issue } from '../types';

// Generate random location near a base point
const randomLocation = (baseLat: number, baseLng: number, radiusKm: number) => {
  // Earth's radius in km
  const R = 6371;
  
  // Convert radius from km to radians
  const radiusRad = radiusKm / R;
  
  // Random angle
  const angle = Math.random() * 2 * Math.PI;
  
  // Random distance within radius
  const distance = Math.random() * radiusRad;
  
  // Convert base location to radians
  const baseLatRad = baseLat * (Math.PI / 180);
  const baseLngRad = baseLng * (Math.PI / 180);
  
  // Calculate new point
  const newLat = Math.asin(
    Math.sin(baseLatRad) * Math.cos(distance) +
    Math.cos(baseLatRad) * Math.sin(distance) * Math.cos(angle)
  );
  
  const newLng = baseLngRad + Math.atan2(
    Math.sin(angle) * Math.sin(distance) * Math.cos(baseLatRad),
    Math.cos(distance) - Math.sin(baseLatRad) * Math.sin(newLat)
  );
  
  // Convert back to degrees
  return {
    lat: newLat * (180 / Math.PI),
    lng: newLng * (180 / Math.PI)
  };
};

// Random sample addresses
const addresses = [
  "123 Main St",
  "456 Oak Avenue",
  "789 Elm Boulevard",
  "321 Pine Road",
  "654 Maple Lane",
  "987 Cedar Court",
  "741 Birch Street",
  "852 Walnut Drive",
  "963 Willow Path",
  "159 Cherry Way"
];

// Base date for generating dates in the past
const now = new Date();
const getRandomPastDate = (maxDaysAgo: number) => {
  const past = new Date(now);
  past.setDate(past.getDate() - Math.floor(Math.random() * maxDaysAgo));
  return past.toISOString();
};

// New York City coordinates as base
const NYC_LAT = 40.7128;
const NYC_LNG = -74.0060;

// Generate mock issues data
export const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole that has been growing for weeks. It\'s causing damage to vehicles and is a safety hazard, especially at night.',
    category: 'roads',
    status: 'in_progress',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 5),
      address: '123 Main Street'
    },
    photos: [
      'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '1',
    reportedAt: getRandomPastDate(30),
    updatedAt: getRandomPastDate(15),
    upvotes: 24,
    comments: [
      {
        id: 'c1',
        issueId: '1',
        userId: '1',
        userName: 'John Citizen',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'I hit this pothole yesterday and almost damaged my tire!',
        createdAt: getRandomPastDate(28)
      },
      {
        id: 'c2',
        issueId: '1',
        userId: '2',
        userName: 'Admin User',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'Thanks for reporting. We\'ve dispatched a team to assess the issue.',
        createdAt: getRandomPastDate(20)
      }
    ],
    hasUpvoted: false
  },
  {
    id: '2',
    title: 'Broken Street Light',
    description: 'Street light on corner of Oak and 5th has been out for over a week, making the intersection unsafe at night.',
    category: 'lighting',
    status: 'reported',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 5),
      address: '501 Oak Avenue'
    },
    photos: [
      'https://images.pexels.com/photos/1755680/pexels-photo-1755680.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '1',
    reportedAt: getRandomPastDate(10),
    updatedAt: getRandomPastDate(10),
    upvotes: 12,
    comments: [],
    hasUpvoted: true
  },
  {
    id: '3',
    title: 'Overflowing Trash Can',
    description: 'The public trash can at Central Park entrance has been overflowing for days. It\'s attracting pests and creating bad odors.',
    category: 'trash',
    status: 'resolved',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 2),
      address: 'Central Park East Entrance'
    },
    photos: [
      'https://images.pexels.com/photos/2199486/pexels-photo-2199486.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '2',
    reportedAt: getRandomPastDate(14),
    updatedAt: getRandomPastDate(3),
    upvotes: 8,
    comments: [
      {
        id: 'c3',
        issueId: '3',
        userId: '2',
        userName: 'Admin User',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'The sanitation department has been notified and will clear this trash can today.',
        createdAt: getRandomPastDate(7)
      },
      {
        id: 'c4',
        issueId: '3',
        userId: '1',
        userName: 'John Citizen',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'Thank you! The trash has been cleared and the area is much cleaner now.',
        createdAt: getRandomPastDate(3)
      }
    ],
    hasUpvoted: false
  },
  {
    id: '4',
    title: 'Water Main Break',
    description: 'Water is gushing out of the sidewalk on Elm Street. It looks like a major water main break and it\'s flooding the street.',
    category: 'water',
    status: 'under_review',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 4),
      address: '742 Elm Street'
    },
    photos: [
      'https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '1',
    reportedAt: getRandomPastDate(2),
    updatedAt: getRandomPastDate(1),
    upvotes: 35,
    comments: [
      {
        id: 'c5',
        issueId: '4',
        userId: '2',
        userName: 'Admin User',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'We have dispatched an emergency water department team to address this issue. Please avoid the area for now.',
        createdAt: getRandomPastDate(1)
      }
    ],
    hasUpvoted: false
  },
  {
    id: '5',
    title: 'Power Outage',
    description: 'The entire block on Maple Avenue is experiencing a power outage. Multiple homes affected.',
    category: 'electricity',
    status: 'in_progress',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 3),
      address: '800 Block of Maple Avenue'
    },
    photos: [],
    reportedBy: '1',
    reportedAt: getRandomPastDate(5),
    updatedAt: getRandomPastDate(2),
    upvotes: 27,
    comments: [
      {
        id: 'c6',
        issueId: '5',
        userId: '1',
        userName: 'John Citizen',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'I\'ve seen utility trucks in the area. Looks like they\'re working on it.',
        createdAt: getRandomPastDate(2)
      }
    ],
    hasUpvoted: true
  },
  {
    id: '6',
    title: 'Graffiti on Community Center',
    description: 'Someone has spray painted graffiti on the south wall of the community center. It includes offensive language and should be removed.',
    category: 'other',
    status: 'reported',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 4),
      address: '123 Community Way'
    },
    photos: [
      'https://images.pexels.com/photos/3279690/pexels-photo-3279690.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '2',
    reportedAt: getRandomPastDate(4),
    updatedAt: getRandomPastDate(4),
    upvotes: 7,
    comments: [],
    hasUpvoted: false
  },
  {
    id: '7',
    title: 'Loud Construction Noise',
    description: 'Construction crew on Pine Street has been working past permitted hours (10pm) for the past week. The noise is extremely disruptive to local residents.',
    category: 'noise',
    status: 'under_review',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 5),
      address: '400 Pine Street'
    },
    photos: [],
    reportedBy: '1',
    reportedAt: getRandomPastDate(6),
    updatedAt: getRandomPastDate(3),
    upvotes: 18,
    comments: [
      {
        id: 'c7',
        issueId: '7',
        userId: '2',
        userName: 'Admin User',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'We\'re reviewing the noise permit for this construction site. An inspector will visit tomorrow evening.',
        createdAt: getRandomPastDate(3)
      }
    ],
    hasUpvoted: false
  },
  {
    id: '8',
    title: 'Dangerous Intersection',
    description: 'The intersection at Cedar and Main is very dangerous for pedestrians. Cars frequently run the stop sign and there have been several near-misses.',
    category: 'safety',
    status: 'in_progress',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 3),
      address: 'Cedar and Main Intersection'
    },
    photos: [
      'https://images.pexels.com/photos/1881676/pexels-photo-1881676.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '1',
    reportedAt: getRandomPastDate(45),
    updatedAt: getRandomPastDate(7),
    upvotes: 42,
    comments: [
      {
        id: 'c8',
        issueId: '8',
        userId: '1',
        userName: 'John Citizen',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'I almost got hit by a car here yesterday! We need a traffic light!',
        createdAt: getRandomPastDate(30)
      },
      {
        id: 'c9',
        issueId: '8',
        userId: '2',
        userName: 'Admin User',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'A traffic study has been completed and the transportation department has approved installation of a traffic light. Construction will begin next month.',
        createdAt: getRandomPastDate(7)
      }
    ],
    hasUpvoted: true
  },
  {
    id: '9',
    title: 'Flooded Underpass',
    description: 'The underpass on River Road is completely flooded after yesterday\'s rain. Cars cannot pass through and it\'s creating major traffic problems.',
    category: 'roads',
    status: 'resolved',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 6),
      address: 'River Road Underpass'
    },
    photos: [
      'https://images.pexels.com/photos/12587454/pexels-photo-12587454.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '2',
    reportedAt: getRandomPastDate(17),
    updatedAt: getRandomPastDate(2),
    upvotes: 31,
    comments: [
      {
        id: 'c10',
        issueId: '9',
        userId: '2',
        userName: 'Admin User',
        userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'Public works department has deployed pumps to clear the flooding.',
        createdAt: getRandomPastDate(16)
      },
      {
        id: 'c11',
        issueId: '9',
        userId: '1',
        userName: 'John Citizen',
        userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
        content: 'The road is now clear and traffic is moving normally. Thank you!',
        createdAt: getRandomPastDate(3)
      }
    ],
    hasUpvoted: false
  },
  {
    id: '10',
    title: 'Playground Equipment Damaged',
    description: 'The swing set at Riverside Park playground is broken. Several chains are snapped and it\'s a safety hazard for children.',
    category: 'safety',
    status: 'reported',
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 2),
      address: 'Riverside Park, Playground Area'
    },
    photos: [
      'https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    reportedBy: '1',
    reportedAt: getRandomPastDate(1),
    updatedAt: getRandomPastDate(1),
    upvotes: 15,
    comments: [],
    hasUpvoted: false
  }
];

// Add more random issues
for (let i = 11; i <= 30; i++) {
  const categories: Array<'roads' | 'lighting' | 'trash' | 'water' | 'electricity' | 'safety' | 'noise' | 'other'> = 
    ['roads', 'lighting', 'trash', 'water', 'electricity', 'safety', 'noise', 'other'];
  
  const statuses: Array<'reported' | 'under_review' | 'in_progress' | 'resolved' | 'closed'> = 
    ['reported', 'under_review', 'in_progress', 'resolved', 'closed'];
  
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
  
  const randomIssue: Issue = {
    id: i.toString(),
    title: `Issue #${i}`,
    description: `This is a randomly generated issue for ${randomCategory}. It was reported and needs to be addressed.`,
    category: randomCategory,
    status: randomStatus,
    location: {
      ...randomLocation(NYC_LAT, NYC_LNG, 10),
      address: randomAddress
    },
    photos: [],
    reportedBy: Math.random() > 0.5 ? '1' : '2',
    reportedAt: getRandomPastDate(30),
    updatedAt: getRandomPastDate(15),
    upvotes: Math.floor(Math.random() * 20),
    comments: [],
    hasUpvoted: Math.random() > 0.7
  };
  
  mockIssues.push(randomIssue);
}