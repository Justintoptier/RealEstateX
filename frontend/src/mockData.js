// Mock data for PropertyHub

// Mock data for MAK Kotwal Venus

export const getMockProperties = () => {
  const stored = localStorage.getItem('properties');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultProperties = [
    {
      id: '1',
      name: 'Luxury Penthouse',
      budget: 15000000,
      configurations: '4 BHK',
      location: 'Bandra West, Mumbai',
      pricePerSqft: 35000,
      carpetArea: 2800,
      developer: 'Oberoi Realty',
      description: 'Stunning penthouse with panoramic views of the Arabian Sea',
      tags: ['Sea View', 'Premium', 'Penthouse'],
      gmapsLink: 'https://maps.google.com/?q=Bandra+West+Mumbai'
    },
    {
      id: '2',
      name: 'Premium Villa',
      budget: 25000000,
      configurations: '5 BHK',
      location: 'Whitefield, Bangalore',
      pricePerSqft: 12000,
      carpetArea: 4500,
      developer: 'Brigade Group',
      description: 'Spacious villa with private garden and swimming pool',
      tags: ['Villa', 'Garden', 'Pool'],
      gmapsLink: 'https://maps.google.com/?q=Whitefield+Bangalore'
    },
    {
      id: '3',
      name: 'Modern Apartment',
      budget: 8500000,
      configurations: '3 BHK',
      location: 'Andheri East, Mumbai',
      pricePerSqft: 28000,
      carpetArea: 1800,
      developer: 'Godrej Properties',
      description: 'Contemporary design with premium amenities',
      tags: ['Modern', 'Amenities'],
      gmapsLink: 'https://maps.google.com/?q=Andheri+East+Mumbai'
    },
    {
      id: '4',
      name: 'Sky Tower Residence',
      budget: 12000000,
      configurations: '3 BHK',
      location: 'Powai, Mumbai',
      pricePerSqft: 32000,
      carpetArea: 2100,
      developer: 'Lodha Group',
      description: 'High-rise luxury apartment with lake view',
      tags: ['Lake View', 'High Rise'],
      gmapsLink: 'https://maps.google.com/?q=Powai+Mumbai'
    },
    {
      id: '5',
      name: 'Garden Mansion',
      budget: 35000000,
      configurations: '6 BHK',
      location: 'Koramangala, Bangalore',
      pricePerSqft: 15000,
      carpetArea: 5200,
      developer: 'Prestige Group',
      description: 'Exclusive mansion with expansive gardens',
      tags: ['Mansion', 'Luxury', 'Garden'],
      gmapsLink: 'https://maps.google.com/?q=Koramangala+Bangalore'
    },
    {
      id: '6',
      name: 'Urban Studio',
      budget: 4500000,
      configurations: '2 BHK',
      location: 'Gurgaon, Delhi NCR',
      pricePerSqft: 18000,
      carpetArea: 1200,
      developer: 'DLF Limited',
      description: 'Compact and efficient urban living space',
      tags: ['Compact', 'Urban'],
      gmapsLink: 'https://maps.google.com/?q=Gurgaon+Delhi+NCR'
    },
    {
      id: '7',
      name: 'Riverside Apartments',
      budget: 9800000,
      configurations: '3 BHK',
      location: 'Pune, Maharashtra',
      pricePerSqft: 22000,
      carpetArea: 2200,
      developer: 'Kolte Patil',
      description: 'Serene living by the riverside with modern amenities',
      tags: ['River View', 'Peaceful', 'Modern'],
      gmapsLink: 'https://maps.google.com/?q=Pune+Maharashtra'
    },
    {
      id: '8',
      name: 'Green Valley Homes',
      budget: 6700000,
      configurations: '2 BHK',
      location: 'Navi Mumbai, Maharashtra',
      pricePerSqft: 25000,
      carpetArea: 1500,
      developer: 'Hiranandani',
      description: 'Eco-friendly homes with lush greenery',
      tags: ['Eco-Friendly', 'Green', 'Family'],
      gmapsLink: 'https://maps.google.com/?q=Navi+Mumbai'
    },
    {
      id: '9',
      name: 'Tech Park Residency',
      budget: 11500000,
      configurations: '3 BHK',
      location: 'Electronic City, Bangalore',
      pricePerSqft: 19000,
      carpetArea: 2400,
      developer: 'Sobha Limited',
      description: 'Close to IT parks with excellent connectivity',
      tags: ['IT Hub', 'Connectivity', 'Modern'],
      gmapsLink: 'https://maps.google.com/?q=Electronic+City+Bangalore'
    },
    {
      id: '10',
      name: 'Royal Heights',
      budget: 18000000,
      configurations: '4 BHK',
      location: 'South Delhi, Delhi',
      pricePerSqft: 45000,
      carpetArea: 3000,
      developer: 'Emaar India',
      description: 'Luxury living in the heart of South Delhi',
      tags: ['Luxury', 'Central', 'Premium'],
      gmapsLink: 'https://maps.google.com/?q=South+Delhi'
    },
    {
      id: '11',
      name: 'Coastal Paradise',
      budget: 22000000,
      configurations: '4 BHK',
      location: 'Worli, Mumbai',
      pricePerSqft: 55000,
      carpetArea: 3200,
      developer: 'Lodha Group',
      description: 'Beachfront property with stunning ocean views',
      tags: ['Beach Front', 'Luxury', 'Sea View'],
      gmapsLink: 'https://maps.google.com/?q=Worli+Mumbai'
    },
    {
      id: '12',
      name: 'Hill View Villas',
      budget: 14500000,
      configurations: '3 BHK',
      location: 'Lonavala, Maharashtra',
      pricePerSqft: 16000,
      carpetArea: 2600,
      developer: 'Shapoorji Pallonji',
      description: 'Weekend homes with breathtaking hill views',
      tags: ['Hill View', 'Weekend Home', 'Peaceful'],
      gmapsLink: 'https://maps.google.com/?q=Lonavala+Maharashtra'
    },
    {
      id: '13',
      name: 'Smart City Flats',
      budget: 7200000,
      configurations: '2 BHK',
      location: 'Thane, Mumbai',
      pricePerSqft: 24000,
      carpetArea: 1600,
      developer: 'Rustomjee',
      description: 'Smart homes with IoT integration',
      tags: ['Smart Home', 'Technology', 'Modern'],
      gmapsLink: 'https://maps.google.com/?q=Thane+Mumbai'
    },
    {
      id: '14',
      name: 'Airport Residency',
      budget: 10500000,
      configurations: '3 BHK',
      location: 'Andheri West, Mumbai',
      pricePerSqft: 30000,
      carpetArea: 2000,
      developer: 'K Raheja Corp',
      description: 'Near airport with excellent connectivity',
      tags: ['Airport', 'Connectivity', 'Business'],
      gmapsLink: 'https://maps.google.com/?q=Andheri+West+Mumbai'
    },
    {
      id: '15',
      name: 'Heritage Apartments',
      budget: 13000000,
      configurations: '3 BHK',
      location: 'Indiranagar, Bangalore',
      pricePerSqft: 26000,
      carpetArea: 2300,
      developer: 'Prestige Group',
      description: 'Classic architecture with modern amenities',
      tags: ['Heritage', 'Classic', 'Premium'],
      gmapsLink: 'https://maps.google.com/?q=Indiranagar+Bangalore'
    },
    {
      id: '16',
      name: 'Golf Course Villas',
      budget: 28000000,
      configurations: '5 BHK',
      location: 'DLF City, Gurgaon',
      pricePerSqft: 35000,
      carpetArea: 4800,
      developer: 'DLF Limited',
      description: 'Luxurious villas overlooking golf course',
      tags: ['Golf Course', 'Luxury', 'Sports'],
      gmapsLink: 'https://maps.google.com/?q=DLF+City+Gurgaon'
    },
    {
      id: '17',
      name: 'Metro Connect Homes',
      budget: 5800000,
      configurations: '2 BHK',
      location: 'Noida, Uttar Pradesh',
      pricePerSqft: 20000,
      carpetArea: 1400,
      developer: 'Supertech',
      description: 'Well-connected to metro stations',
      tags: ['Metro', 'Connectivity', 'Affordable'],
      gmapsLink: 'https://maps.google.com/?q=Noida+Uttar+Pradesh'
    },
    {
      id: '18',
      name: 'Lake View Towers',
      budget: 16500000,
      configurations: '4 BHK',
      location: 'Bellandur, Bangalore',
      pricePerSqft: 28000,
      carpetArea: 3100,
      developer: 'Brigade Group',
      description: 'Towers with stunning lake views',
      tags: ['Lake View', 'High Rise', 'Premium'],
      gmapsLink: 'https://maps.google.com/?q=Bellandur+Bangalore'
    },
    {
      id: '19',
      name: 'City Center Plaza',
      budget: 9200000,
      configurations: '2 BHK',
      location: 'Connaught Place, Delhi',
      pricePerSqft: 38000,
      carpetArea: 1700,
      developer: 'Tata Housing',
      description: 'Prime location in the heart of the city',
      tags: ['Central', 'Prime', 'Commercial Hub'],
      gmapsLink: 'https://maps.google.com/?q=Connaught+Place+Delhi'
    },
    {
      id: '20',
      name: 'Sunset Residency',
      budget: 19500000,
      configurations: '4 BHK',
      location: 'Marine Drive, Mumbai',
      pricePerSqft: 48000,
      carpetArea: 3400,
      developer: 'Oberoi Realty',
      description: 'Iconic location with breathtaking sunset views',
      tags: ['Sea View', 'Iconic', 'Luxury'],
      gmapsLink: 'https://maps.google.com/?q=Marine+Drive+Mumbai'
    }
  ];
  
  localStorage.setItem('properties', JSON.stringify(defaultProperties));
  return defaultProperties;
};

export const saveProperty = (property) => {
  const properties = getMockProperties();
  const newProperty = {
    ...property,
    id: Date.now().toString()
  };
  properties.push(newProperty);
  localStorage.setItem('properties', JSON.stringify(properties));
  return newProperty;
};

export const deleteProperty = (id) => {
  const properties = getMockProperties();
  const filtered = properties.filter(p => p.id !== id);
  localStorage.setItem('properties', JSON.stringify(filtered));
};

export const updateProperty = (id, updates) => {
  const properties = getMockProperties();
  const index = properties.findIndex(p => p.id === id);
  if (index !== -1) {
    properties[index] = { ...properties[index], ...updates };
    localStorage.setItem('properties', JSON.stringify(properties));
  }
};

export const togglePropertyVisibility = (id) => {
  const properties = getMockProperties();
  const index = properties.findIndex(p => p.id === id);
  if (index !== -1) {
    properties[index].hidden = !properties[index].hidden;
    localStorage.setItem('properties', JSON.stringify(properties));
    return properties[index];
  }
  return null;
};

export const searchProperties = (filters) => {
  let properties = getMockProperties();
  
  if (filters.name) {
    properties = properties.filter(p => 
      p.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }
  
  if (filters.location) {
    properties = properties.filter(p => 
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  
  if (filters.minBudget) {
    properties = properties.filter(p => p.budget >= parseInt(filters.minBudget));
  }
  
  if (filters.maxBudget) {
    properties = properties.filter(p => p.budget <= parseInt(filters.maxBudget));
  }
  
  if (filters.configurations) {
    properties = properties.filter(p => 
      p.configurations.toLowerCase().includes(filters.configurations.toLowerCase())
    );
  }
  
  if (filters.developer) {
    properties = properties.filter(p => 
      p.developer.toLowerCase().includes(filters.developer.toLowerCase())
    );
  }
  
  if (filters.minPricePerSqft) {
    properties = properties.filter(p => p.pricePerSqft >= parseInt(filters.minPricePerSqft));
  }
  
  if (filters.maxPricePerSqft) {
    properties = properties.filter(p => p.pricePerSqft <= parseInt(filters.maxPricePerSqft));
  }
  
  if (filters.minCarpetArea) {
    properties = properties.filter(p => p.carpetArea >= parseInt(filters.minCarpetArea));
  }
  
  if (filters.maxCarpetArea) {
    properties = properties.filter(p => p.carpetArea <= parseInt(filters.maxCarpetArea));
  }
  
  if (filters.tags) {
    properties = properties.filter(p => 
      p.tags && p.tags.some(tag => 
        tag.toLowerCase().includes(filters.tags.toLowerCase())
      )
    );
  }
  
  // Filter hidden properties for non-admin users
  if (!filters.showHidden) {
    properties = properties.filter(p => !p.hidden);
  }
  
  return properties;
};

// User Management Functions
export const getMockUsers = () => {
  const stored = localStorage.getItem('mockUsers');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const defaultUsers = [
    {
      user_id: 'user_default_1',
      name: 'John Doe',
      email: 'user@makkotwal.com',
      role: 'user',
      picture: 'https://ui-avatars.com/api/?name=John+Doe&background=fbbf24&color=000',
      created_at: new Date().toISOString()
    },
    {
      user_id: 'admin_default_1',
      name: 'Admin User',
      email: 'admin@makkotwal.com',
      role: 'admin',
      picture: 'https://ui-avatars.com/api/?name=Admin+User&background=fbbf24&color=000',
      created_at: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const addUser = (userData) => {
  const users = getMockUsers();
  const newUser = {
    user_id: 'user_' + Date.now(),
    ...userData,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem('mockUsers', JSON.stringify(users));
  return newUser;
};

export const deleteUser = (userId) => {
  const users = getMockUsers();
  const filtered = users.filter(u => u.user_id !== userId);
  localStorage.setItem('mockUsers', JSON.stringify(filtered));
};

export const updateUserRole = (userId, newRole) => {
  const users = getMockUsers();
  const index = users.findIndex(u => u.user_id === userId);
  if (index !== -1) {
    users[index].role = newRole;
    localStorage.setItem('mockUsers', JSON.stringify(users));
    return users[index];
  }
  return null;
};
