import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Building2, ArrowLeft, FileUp, CheckCircle } from 'lucide-react';
import { saveProperty } from '../mockData';
import { useToast } from '../hooks/use-toast';

const UploadProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    configurations: '',
    location: '',
    pricePerSqft: '',
    developer: '',
    description: ''
  });
  const [videoFile, setVideoFile] = useState(null);
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.budget || !formData.location) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Save property to localStorage
    const property = {
      name: formData.name,
      budget: parseInt(formData.budget),
      configurations: formData.configurations,
      location: formData.location,
      pricePerSqft: parseInt(formData.pricePerSqft) || 0,
      developer: formData.developer,
      description: formData.description
    };

    saveProperty(property);

    toast({
      title: 'Success',
      description: 'Property added successfully!',
      variant: 'default'
    });

    // Reset form
    setFormData({
      name: '',
      budget: '',
      configurations: '',
      location: '',
      pricePerSqft: '',
      developer: '',
      description: ''
    });
  };

  const handleExcelSubmit = (e) => {
    e.preventDefault();
    
    if (!excelFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select an Excel file to upload',
        variant: 'destructive'
      });
      return;
    }

    // Mock Excel upload - just show success message
    toast({
      title: 'Upload Successful',
      description: `Excel file "${excelFile.name}" processed successfully! (Mock implementation)`,
      variant: 'default'
    });

    setExcelFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setExcelFile(file);
    }
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white font-serif text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center mb-6">
              Only administrators can upload properties.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-200" strokeWidth={1.5} />
            <span className="text-2xl font-serif text-white">PropertyHub</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{user?.name || 'Admin'}</p>
            <p className="text-amber-200 text-sm">{user?.role || 'admin'}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="text-amber-200 hover:text-amber-300 hover:bg-amber-200/10 mb-8 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Upload Card */}
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl text-white font-serif">Upload Property</CardTitle>
            <p className="text-gray-400 mt-2">Add properties manually or upload via Excel</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-gray-800">
                <TabsTrigger 
                  value="manual"
                  className="data-[state=active]:bg-amber-200 data-[state=active]:text-black transition-all duration-300"
                >
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger 
                  value="excel"
                  className="data-[state=active]:bg-amber-200 data-[state=active]:text-black transition-all duration-300"
                >
                  Excel Upload
                </TabsTrigger>
              </TabsList>

              {/* Manual Entry Tab */}
              <TabsContent value="manual">
                <form onSubmit={handleManualSubmit} className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Property Name */}
                    <div>
                      <Label htmlFor="name" className="text-gray-300 mb-2 block">Property Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter property name"
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                      />
                    </div>

                    {/* Budget */}
                    <div>
                      <Label htmlFor="budget" className="text-gray-300 mb-2 block">Budget (₹) *</Label>
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        value={formData.budget}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter budget"
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                      />
                    </div>

                    {/* Configurations */}
                    <div>
                      <Label htmlFor="configurations" className="text-gray-300 mb-2 block">Configurations</Label>
                      <Input
                        id="configurations"
                        name="configurations"
                        value={formData.configurations}
                        onChange={handleInputChange}
                        placeholder="e.g., 3 BHK"
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <Label htmlFor="location" className="text-gray-300 mb-2 block">Location *</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter location"
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                      />
                    </div>

                    {/* Price per Sqft */}
                    <div>
                      <Label htmlFor="pricePerSqft" className="text-gray-300 mb-2 block">₹ per Sqft</Label>
                      <Input
                        id="pricePerSqft"
                        name="pricePerSqft"
                        type="number"
                        value={formData.pricePerSqft}
                        onChange={handleInputChange}
                        placeholder="Enter price per sqft"
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                      />
                    </div>

                    {/* Developer Name */}
                    <div>
                      <Label htmlFor="developer" className="text-gray-300 mb-2 block">Developer Name</Label>
                      <Input
                        id="developer"
                        name="developer"
                        value={formData.developer}
                        onChange={handleInputChange}
                        placeholder="Enter developer name"
                        className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className="text-gray-300 mb-2 block">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter property description"
                      rows={4}
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full py-6 text-lg bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Add Property
                  </Button>
                </form>
              </TabsContent>

              {/* Excel Upload Tab */}
              <TabsContent value="excel">
                <form onSubmit={handleExcelSubmit} className="space-y-6 mt-6">
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-amber-200 transition-all duration-300">
                    <FileUp className="w-16 h-16 text-amber-200 mx-auto mb-4" />
                    <h3 className="text-white text-xl font-medium mb-2">Upload Excel File</h3>
                    <p className="text-gray-400 mb-6">Select an Excel file containing property data</p>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="excel-upload"
                    />
                    <Label
                      htmlFor="excel-upload"
                      className="inline-block px-6 py-3 bg-amber-200 hover:bg-amber-300 text-black font-medium rounded cursor-pointer transition-all duration-300"
                    >
                      Choose File
                    </Label>
                    {excelFile && (
                      <p className="text-amber-200 mt-4">
                        Selected: {excelFile.name}
                      </p>
                    )}
                  </div>

                  <div className="bg-black/50 border border-gray-800 rounded-lg p-6">
                    <h4 className="text-white font-medium mb-3">Excel Format Requirements:</h4>
                    <ul className="text-gray-400 text-sm space-y-2">
                      <li>• Column headers: Property Name, Budget, Configurations, Location, Price per Sqft, Developer, Description</li>
                      <li>• Budget and Price per Sqft should be numeric values</li>
                      <li>• All rows must have Property Name, Budget, and Location</li>
                      <li>• Save file as .xlsx or .xls format</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    disabled={!excelFile}
                    className="w-full py-6 text-lg bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileUp className="w-5 h-5 mr-2" />
                    Upload Excel File
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UploadProperty;
