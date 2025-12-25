import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, MapPin, Building, DollarSign, Home, X } from 'lucide-react';

const PropertyDetailsModal = ({ property, isOpen, onClose }) => {
  if (!property) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-serif text-white pr-8">
            {property.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Price */}
          <div className="bg-amber-200/10 p-4 rounded-lg border border-amber-200/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-amber-200" />
              <span className="text-gray-400 text-sm">Price</span>
            </div>
            <p className="text-3xl font-bold text-amber-200">{formatCurrency(property.budget)}</p>
          </div>

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
