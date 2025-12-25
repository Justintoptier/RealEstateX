import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Building2, ArrowLeft, X, Eye, EyeOff } from 'lucide-react';
import { searchProperties, togglePropertyVisibility } from '../mockData';
import { useToast } from '../hooks/use-toast';

const SearchProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    name: '',
    location: '',
    minBudget: '',
    maxBudget: '',
    configurations: '',
    developer: '',
    minPricePerSqft: '',
    maxPricePerSqft: '',
    tags: ''
  });
  const [carpetAreaRange, setCarpetAreaRange] = useState([500, 5000]);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    const searchFilters = {
      ...filters,
      minCarpetArea: carpetAreaRange[0],
      maxCarpetArea: carpetAreaRange[1],
      showHidden: user?.role === 'admin' // Admin can see hidden properties
    };
    const searchResults = searchProperties(searchFilters);
    setResults(searchResults);
    setHasSearched(true);
  };

  const handleToggleVisibility = (propertyId) => {
    const property = togglePropertyVisibility(propertyId);
    if (property) {
      toast({
        title: 'Success',
        description: `Property ${property.hidden ? 'hidden' : 'visible'} successfully!`,
        variant: 'default'
      });
      handleSearch(); // Refresh results
    }
  };

  const handleClearAll = () => {
    setFilters({
      name: '',
      location: '',
      minBudget: '',
      maxBudget: '',
      configurations: '',
      developer: '',
      minPricePerSqft: '',
      maxPricePerSqft: '',
      tags: ''
    });
    setCarpetAreaRange([500, 5000]);
    setResults([]);
    setHasSearched(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-200" strokeWidth={1.5} />
            <span className="text-2xl font-serif text-white">MAK Kotwal Venus</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{user?.name || 'User'}</p>
            <p className="text-amber-200 text-sm">{user?.role || 'user'}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="text-amber-200 hover:text-amber-300 hover:bg-amber-200/10 mb-8 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Search Filters Card */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl text-white font-serif">Search Filters</CardTitle>
              <Button
                onClick={handleClearAll}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Property Name */}
              <div>
                <Label htmlFor="name" className="text-gray-300 mb-2 block">Property Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={filters.name}
                  onChange={handleInputChange}
                  placeholder="Enter property name"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-gray-300 mb-2 block">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Min Budget */}
              <div>
                <Label htmlFor="minBudget" className="text-gray-300 mb-2 block">Min Budget (₹)</Label>
                <Input
                  id="minBudget"
                  name="minBudget"
                  type="number"
                  value={filters.minBudget}
                  onChange={handleInputChange}
                  placeholder="Enter minimum budget"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Max Budget */}
              <div>
                <Label htmlFor="maxBudget" className="text-gray-300 mb-2 block">Max Budget (₹)</Label>
                <Input
                  id="maxBudget"
                  name="maxBudget"
                  type="number"
                  value={filters.maxBudget}
                  onChange={handleInputChange}
                  placeholder="Enter maximum budget"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Configurations */}
              <div>
                <Label htmlFor="configurations" className="text-gray-300 mb-2 block">Configurations</Label>
                <Input
                  id="configurations"
                  name="configurations"
                  value={filters.configurations}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 BHK, 3 BHK"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Developer Name */}
              <div>
                <Label htmlFor="developer" className="text-gray-300 mb-2 block">Developer Name</Label>
                <Input
                  id="developer"
                  name="developer"
                  value={filters.developer}
                  onChange={handleInputChange}
                  placeholder="Enter developer name"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Min Price per Sqft */}
              <div>
                <Label htmlFor="minPricePerSqft" className="text-gray-300 mb-2 block">Min ₹/Sqft</Label>
                <Input
                  id="minPricePerSqft"
                  name="minPricePerSqft"
                  type="number"
                  value={filters.minPricePerSqft}
                  onChange={handleInputChange}
                  placeholder="Enter minimum price"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Max Price per Sqft */}
              <div>
                <Label htmlFor="maxPricePerSqft" className="text-gray-300 mb-2 block">Max ₹/Sqft</Label>
                <Input
                  id="maxPricePerSqft"
                  name="maxPricePerSqft"
                  type="number"
                  value={filters.maxPricePerSqft}
                  onChange={handleInputChange}
                  placeholder="Enter maximum price"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags" className="text-gray-300 mb-2 block">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={filters.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., Sea View, Garden, Pool"
                  className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* Carpet Area Slider */}
            <div className="mt-6">
              <Label className="text-gray-300 mb-4 block">
                Carpet Area: {carpetAreaRange[0]} - {carpetAreaRange[1]} sqft
              </Label>
              <Slider
                value={carpetAreaRange}
                onValueChange={setCarpetAreaRange}
                min={500}
                max={5000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-gray-500 text-sm mt-2">
                <span>500 sqft</span>
                <span>5000 sqft</span>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="w-full mt-8 py-6 text-lg bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Search Properties
            </Button>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div>
            <h2 className="text-2xl font-serif text-white mb-6">
              {results.length} {results.length === 1 ? 'Property' : 'Properties'} Found
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((property) => (
                <Card key={property.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-white font-serif">{property.name}</CardTitle>
                    <p className="text-amber-200 text-lg font-medium">{formatCurrency(property.budget)}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Configuration:</span>
                        <span className="text-white">{property.configurations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{property.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Carpet Area:</span>
                        <span className="text-white">{property.carpetArea} sqft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price/Sqft:</span>
                        <span className="text-white">₹{property.pricePerSqft.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Developer:</span>
                        <span className="text-white">{property.developer}</span>
                      </div>
                      {property.gmapsLink && (
                        <div className="pt-2">
                          <a
                            href={property.gmapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-200 hover:text-amber-300 text-sm underline transition-colors duration-300"
                          >
                            View on Google Maps →
                          </a>
                        </div>
                      )}
                      {property.tags && property.tags.length > 0 && (
                        <div className="pt-2 border-t border-gray-800">
                          <div className="flex flex-wrap gap-2">
                            {property.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-amber-200/10 text-amber-200 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {property.description && (
                        <p className="text-gray-400 mt-4 pt-4 border-t border-gray-800">
                          {property.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchProperties;
