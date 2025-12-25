// Mock data for PropertyHub

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
      tags: ['Sea View', 'Premium', 'Penthouse']
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
      tags: ['Villa', 'Garden', 'Pool']
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
      tags: ['Modern', 'Amenities']
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
      tags: ['Lake View', 'High Rise']
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
      tags: ['Mansion', 'Luxury', 'Garden']
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
      tags: ['Compact', 'Urban']
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
  
  return properties;
};
