import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, MapPin, Building, DollarSign, Home, Settings, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

const PropertyDetailsModal = ({ property, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showFieldSettings, setShowFieldSettings] = useState(false);
  const [fieldVisibility, setFieldVisibility] = useState({
    budget: true,
    configurations: true,
    location: true,
    carpet_area: true,
    price_per_sqft: true,
    developer: true,
    description: true,
    gmaps_link: true,
    tags: true,
    downloads: true
  });

  useEffect(() => {
    if (property && property.field_visibility) {
      setFieldVisibility({ ...fieldVisibility, ...property.field_visibility });
    } else {
      // Reset to all visible
      setFieldVisibility({
        budget: true,
        configurations: true,
        location: true,
        carpet_area: true,
        price_per_sqft: true,
        developer: true,
        description: true,
        gmaps_link: true,
        tags: true,
        downloads: true
      });
    }
  }, [property]);

  if (!property) return null;

  const isAdmin = user?.role === 'admin';
  const isFieldVisible = (fieldName) => {
    // Admin always sees all fields, users see based on settings
    return isAdmin || fieldVisibility[fieldName] !== false;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownload = (filename, type) => {
    const downloadUrl = `${process.env.REACT_APP_BACKEND_URL}/api/files/${filename}`;
    window.open(downloadUrl, '_blank');
  };

  const toggleFieldVisibility = async (fieldName) => {
    const newVisibility = {
      ...fieldVisibility,
      [fieldName]: !fieldVisibility[fieldName]
    };
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/properties/${property.property_id}/field-visibility`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            field_visibility: newVisibility
          })
        }
      );

      if (response.ok) {
        setFieldVisibility(newVisibility);
        toast({
          title: 'Success',
          description: `Field visibility updated`,
          variant: 'default'
        });
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Update field visibility error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update field visibility',
        variant: 'destructive'
      });
    }
  };

  const FieldToggle = ({ fieldName, label }) => (
    <div className="flex items-center justify-between p-2 bg-black/30 rounded border border-gray-800">
      <span className="text-gray-300 text-sm">{label}</span>
      <Button
        onClick={() => toggleFieldVisibility(fieldName)}
        variant="ghost"
        size="sm"
        className={`${
          fieldVisibility[fieldName] 
            ? 'text-green-400 hover:text-green-300' 
            : 'text-red-400 hover:text-red-300'
        }`}
      >
        {fieldVisibility[fieldName] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-3xl font-serif text-white">
              {property.name}
            </DialogTitle>
            {isAdmin && (
              <Button
                onClick={() => setShowFieldSettings(!showFieldSettings)}
                variant="ghost"
                className="text-amber-200 hover:text-amber-300 hover:bg-amber-200/10"
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Field Visibility Settings - Admin Only */}
          {isAdmin && showFieldSettings && (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-amber-200/20">
              <h3 className="text-lg font-semibold text-amber-200 mb-3">
                Field Visibility Settings (User View)
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                <FieldToggle fieldName="budget" label="Budget/Price" />
                <FieldToggle fieldName="configurations" label="Configuration" />
                <FieldToggle fieldName="location" label="Location" />
                <FieldToggle fieldName="carpet_area" label="Carpet Area" />
                <FieldToggle fieldName="price_per_sqft" label="Price per Sqft" />
                <FieldToggle fieldName="developer" label="Developer" />
                <FieldToggle fieldName="description" label="Description" />
                <FieldToggle fieldName="gmaps_link" label="Google Maps" />
                <FieldToggle fieldName="tags" label="Tags/Features" />
                <FieldToggle fieldName="downloads" label="Downloads" />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Toggle visibility of fields for regular users. You (admin) can always see all fields.
              </p>
            </div>
          )}

          {/* Price */}
          {isFieldVisible('budget') && (
            <div className="bg-amber-200/10 p-4 rounded-lg border border-amber-200/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-amber-200" />
                <span className="text-gray-400 text-sm">Price</span>
              </div>
              <p className="text-3xl font-bold text-amber-200">{formatCurrency(property.budget)}</p>
            </div>
          )}

          {/* Property Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Configuration */}
            {property.configurations && (
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-amber-200" />
                  <span className="text-gray-400 text-sm">Configuration</span>
                </div>
                <p className="text-white text-lg font-medium">{property.configurations}</p>
              </div>
            )}

            {/* Location */}
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-amber-200" />
                <span className="text-gray-400 text-sm">Location</span>
              </div>
              <p className="text-white text-lg font-medium">{property.location}</p>
            </div>

            {/* Carpet Area */}
            {property.carpet_area && (
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5 text-amber-200" />
                  <span className="text-gray-400 text-sm">Carpet Area</span>
                </div>
                <p className="text-white text-lg font-medium">{property.carpet_area} sqft</p>
              </div>
            )}

            {/* Price per Sqft */}
            {property.price_per_sqft && (
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-amber-200" />
                  <span className="text-gray-400 text-sm">Price per Sqft</span>
                </div>
                <p className="text-white text-lg font-medium">₹{property.price_per_sqft.toLocaleString()}</p>
              </div>
            )}

            {/* Developer */}
            {property.developer && (
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Building className="w-5 h-5 text-amber-200" />
                  <span className="text-gray-400 text-sm">Developer</span>
                </div>
                <p className="text-white text-lg font-medium">{property.developer}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>
          )}

          {/* Tags */}
          {property.tags && property.tags.length > 0 && (
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {property.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-amber-200/10 text-amber-200 text-sm rounded-full border border-amber-200/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Download Section */}
          {(property.video_file || property.floor_plan_file) && (
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Downloads</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {property.video_file && (
                  <Button
                    onClick={() => handleDownload(property.video_file, 'video')}
                    className="bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Video
                  </Button>
                )}
                {property.floor_plan_file && (
                  <Button
                    onClick={() => handleDownload(property.floor_plan_file, 'floor_plan')}
                    className="bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Floor Plan
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Google Maps Link */}
          {property.gmaps_link && (
            <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
              <a
                href={property.gmaps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-amber-200 hover:text-amber-300 transition-colors duration-300 underline"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          )}

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-800 transition-all duration-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
