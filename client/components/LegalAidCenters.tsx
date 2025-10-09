import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Phone, ArrowLeft, ExternalLink } from 'lucide-react';

interface LegalAidCenter {
  name: string;
  address: string;
  phone: string;
  distance: string;
  services: string[];
  website?: string;
}

export function LegalAidCenters({ onBack }: { onBack: () => void }) {
  const [centers, setCenters] = useState<LegalAidCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState('your area');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    const fetchLegalAidCenters = async () => {
      try {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ lat: latitude, lng: longitude });
              
              // In a real app, you would send these coordinates to your backend
              // to find the nearest legal aid centers. For now, we'll use mock data.
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              const mockCenters: LegalAidCenter[] = [
                {
                  name: "Legal Aid Society",
                  address: "123 Justice St, City, State",
                  phone: "+1 (555) 123-4567",
                  distance: "2.5 miles away",
                  services: ["Civil Legal Aid", "Housing", "Family Law"],
                  website: "https://legalaid.org"
                },
                {
                  name: "Pro Bono Legal Services",
                  address: "456 Rights Ave, City, State",
                  phone: "+1 (555) 987-6543",
                  distance: "5.1 miles away",
                  services: ["Immigration", "Employment", "Public Benefits"],
                  website: "https://probono-legal.org"
                },
                {
                  name: "Community Law Center",
                  address: "789 Freedom Blvd, City, State",
                  phone: "+1 (555) 456-7890",
                  distance: "3.7 miles away",
                  services: ["Housing", "Consumer Rights", "Elder Law"],
                  website: "https://communitylaw.example.com"
                }
              ];
              
              setCenters(mockCenters);
              setLocation('your location');
              setIsLoading(false);
            },
            (error) => {
              console.error('Error getting location:', error);
              // Fallback to mock data without location
              fetchMockData();
            }
          );
        } else {
          // Fallback if geolocation is not supported
          fetchMockData();
        }
      } catch (error) {
        console.error('Error fetching legal aid centers:', error);
        setIsLoading(false);
      }
    };

    const fetchMockData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCenters: LegalAidCenter[] = [
        {
          name: "Legal Aid Society",
          address: "123 Justice St, City, State",
          phone: "+1 (555) 123-4567",
          distance: "2.5 miles away",
          services: ["Civil Legal Aid", "Housing", "Family Law"],
          website: "https://legalaid.org"
        },
        {
          name: "Pro Bono Legal Services",
          address: "456 Rights Ave, City, State",
          phone: "+1 (555) 987-6543",
          distance: "5.1 miles away",
          services: ["Immigration", "Employment", "Public Benefits"],
          website: "https://probono-legal.org"
        }
      ];
      setCenters(mockCenters);
      setIsLoading(false);
    };

    fetchLegalAidCenters();
  }, []);

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[500px] flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <Button 
          className="text-white hover:bg-blue-700 h-9 px-3 text-sm"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-lg font-semibold">Legal Aid Centers</h2>
        <div className="w-10"></div> {/* For alignment */}
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="mb-4">
          <h3 className="font-medium text-slate-800">Legal aid centers near {location}</h3>
          <p className="text-sm text-slate-500">Showing {centers.length} centers</p>
        </div>
        
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-slate-600">Finding legal aid centers near you...</span>
          </div>
        ) : centers.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-4">
            <MapPin className="w-12 h-12 text-slate-300 mb-2" />
            <h3 className="font-medium text-slate-700">No legal aid centers found</h3>
            <p className="text-slate-500 text-sm mt-1">We couldn't find any legal aid centers in your area.</p>
            <Button className="mt-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground">Try a different location</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {centers.map((center, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-900">{center.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      <MapPin className="inline w-3.5 h-3.5 mr-1" />
                      {center.distance} • {center.address}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {center.services.map((service, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <a 
                      href={`tel:${center.phone}`}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <Phone className="w-3.5 h-3.5 mr-1" />
                      Call
                    </a>
                    <a 
                      href={getGoogleMapsUrl(center.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      Directions
                    </a>
                    {center.website && (
                      <a 
                        href={center.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500 text-center">
          Need more help? Call our helpline at <a href="tel:18008742425" className="text-blue-600 hover:underline">1-800-TRIBAL-HELP</a>
        </p>
      </div>
    </div>
  );
}
