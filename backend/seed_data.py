from database import SessionLocal
import models
from datetime import datetime, timezone

def seed_properties():
    db = SessionLocal()
    
    # Check if properties already exist
    existing_count = db.query(models.Property).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} properties. Skipping seed.")
        db.close()
        return
    
    properties_data = [
        {
            'name': 'Luxury Penthouse',
            'budget': 15000000,
            'configurations': '4 BHK',
            'location': 'Bandra West, Mumbai',
            'price_per_sqft': 35000,
            'carpet_area': 2800,
            'developer': 'Oberoi Realty',
            'description': 'Stunning penthouse with panoramic views of the Arabian Sea',
            'tags': ['Sea View', 'Premium', 'Penthouse'],
            'gmaps_link': 'https://maps.google.com/?q=Bandra+West+Mumbai'
        },
        {
            'name': 'Premium Villa',
            'budget': 25000000,
            'configurations': '5 BHK',
            'location': 'Whitefield, Bangalore',
            'price_per_sqft': 12000,
            'carpet_area': 4500,
            'developer': 'Brigade Group',
            'description': 'Spacious villa with private garden and swimming pool',
            'tags': ['Villa', 'Garden', 'Pool'],
            'gmaps_link': 'https://maps.google.com/?q=Whitefield+Bangalore'
        },
        {
            'name': 'Modern Apartment',
            'budget': 8500000,
            'configurations': '3 BHK',
            'location': 'Andheri East, Mumbai',
            'price_per_sqft': 28000,
            'carpet_area': 1800,
            'developer': 'Godrej Properties',
            'description': 'Contemporary design with premium amenities',
            'tags': ['Modern', 'Amenities'],
            'gmaps_link': 'https://maps.google.com/?q=Andheri+East+Mumbai'
        },
        {
            'name': 'Sky Tower Residence',
            'budget': 12000000,
            'configurations': '3 BHK',
            'location': 'Powai, Mumbai',
            'price_per_sqft': 32000,
            'carpet_area': 2100,
            'developer': 'Lodha Group',
            'description': 'High-rise luxury apartment with lake view',
            'tags': ['Lake View', 'High Rise'],
            'gmaps_link': 'https://maps.google.com/?q=Powai+Mumbai'
        },
        {
            'name': 'Garden Mansion',
            'budget': 35000000,
            'configurations': '6 BHK',
            'location': 'Koramangala, Bangalore',
            'price_per_sqft': 15000,
            'carpet_area': 5200,
            'developer': 'Prestige Group',
            'description': 'Exclusive mansion with expansive gardens',
            'tags': ['Mansion', 'Luxury', 'Garden'],
            'gmaps_link': 'https://maps.google.com/?q=Koramangala+Bangalore'
        },
        {
            'name': 'Urban Studio',
            'budget': 4500000,
            'configurations': '2 BHK',
            'location': 'Gurgaon, Delhi NCR',
            'price_per_sqft': 18000,
            'carpet_area': 1200,
            'developer': 'DLF Limited',
            'description': 'Compact and efficient urban living space',
            'tags': ['Compact', 'Urban'],
            'gmaps_link': 'https://maps.google.com/?q=Gurgaon+Delhi+NCR'
        },
        {
            'name': 'Riverside Apartments',
            'budget': 9800000,
            'configurations': '3 BHK',
            'location': 'Pune, Maharashtra',
            'price_per_sqft': 22000,
            'carpet_area': 2200,
            'developer': 'Kolte Patil',
            'description': 'Serene living by the riverside with modern amenities',
            'tags': ['River View', 'Peaceful', 'Modern'],
            'gmaps_link': 'https://maps.google.com/?q=Pune+Maharashtra'
        },
        {
            'name': 'Green Valley Homes',
            'budget': 6700000,
            'configurations': '2 BHK',
            'location': 'Navi Mumbai, Maharashtra',
            'price_per_sqft': 25000,
            'carpet_area': 1500,
            'developer': 'Hiranandani',
            'description': 'Eco-friendly homes with lush greenery',
            'tags': ['Eco-Friendly', 'Green', 'Family'],
            'gmaps_link': 'https://maps.google.com/?q=Navi+Mumbai'
        },
        {
            'name': 'Tech Park Residency',
            'budget': 11500000,
            'configurations': '3 BHK',
            'location': 'Electronic City, Bangalore',
            'price_per_sqft': 19000,
            'carpet_area': 2400,
            'developer': 'Sobha Limited',
            'description': 'Close to IT parks with excellent connectivity',
            'tags': ['IT Hub', 'Connectivity', 'Modern'],
            'gmaps_link': 'https://maps.google.com/?q=Electronic+City+Bangalore'
        },
        {
            'name': 'Royal Heights',
            'budget': 18000000,
            'configurations': '4 BHK',
            'location': 'South Delhi, Delhi',
            'price_per_sqft': 45000,
            'carpet_area': 3000,
            'developer': 'Emaar India',
            'description': 'Luxury living in the heart of South Delhi',
            'tags': ['Luxury', 'Central', 'Premium'],
            'gmaps_link': 'https://maps.google.com/?q=South+Delhi'
        },
        {
            'name': 'Coastal Paradise',
            'budget': 22000000,
            'configurations': '4 BHK',
            'location': 'Worli, Mumbai',
            'price_per_sqft': 55000,
            'carpet_area': 3200,
            'developer': 'Lodha Group',
            'description': 'Beachfront property with stunning ocean views',
            'tags': ['Beach Front', 'Luxury', 'Sea View'],
            'gmaps_link': 'https://maps.google.com/?q=Worli+Mumbai'
        },
        {
            'name': 'Hill View Villas',
            'budget': 14500000,
            'configurations': '3 BHK',
            'location': 'Lonavala, Maharashtra',
            'price_per_sqft': 16000,
            'carpet_area': 2600,
            'developer': 'Shapoorji Pallonji',
            'description': 'Weekend homes with breathtaking hill views',
            'tags': ['Hill View', 'Weekend Home', 'Peaceful'],
            'gmaps_link': 'https://maps.google.com/?q=Lonavala+Maharashtra'
        },
        {
            'name': 'Smart City Flats',
            'budget': 7200000,
            'configurations': '2 BHK',
            'location': 'Thane, Mumbai',
            'price_per_sqft': 24000,
            'carpet_area': 1600,
            'developer': 'Rustomjee',
            'description': 'Smart homes with IoT integration',
            'tags': ['Smart Home', 'Technology', 'Modern'],
            'gmaps_link': 'https://maps.google.com/?q=Thane+Mumbai'
        },
        {
            'name': 'Airport Residency',
            'budget': 10500000,
            'configurations': '3 BHK',
            'location': 'Andheri West, Mumbai',
            'price_per_sqft': 30000,
            'carpet_area': 2000,
            'developer': 'K Raheja Corp',
            'description': 'Near airport with excellent connectivity',
            'tags': ['Airport', 'Connectivity', 'Business'],
            'gmaps_link': 'https://maps.google.com/?q=Andheri+West+Mumbai'
        },
        {
            'name': 'Heritage Apartments',
            'budget': 13000000,
            'configurations': '3 BHK',
            'location': 'Indiranagar, Bangalore',
            'price_per_sqft': 26000,
            'carpet_area': 2300,
            'developer': 'Prestige Group',
            'description': 'Classic architecture with modern amenities',
            'tags': ['Heritage', 'Classic', 'Premium'],
            'gmaps_link': 'https://maps.google.com/?q=Indiranagar+Bangalore'
        },
        {
            'name': 'Golf Course Villas',
            'budget': 28000000,
            'configurations': '5 BHK',
            'location': 'DLF City, Gurgaon',
            'price_per_sqft': 35000,
            'carpet_area': 4800,
            'developer': 'DLF Limited',
            'description': 'Luxurious villas overlooking golf course',
            'tags': ['Golf Course', 'Luxury', 'Sports'],
            'gmaps_link': 'https://maps.google.com/?q=DLF+City+Gurgaon'
        },
        {
            'name': 'Metro Connect Homes',
            'budget': 5800000,
            'configurations': '2 BHK',
            'location': 'Noida, Uttar Pradesh',
            'price_per_sqft': 20000,
            'carpet_area': 1400,
            'developer': 'Supertech',
            'description': 'Well-connected to metro stations',
            'tags': ['Metro', 'Connectivity', 'Affordable'],
            'gmaps_link': 'https://maps.google.com/?q=Noida+Uttar+Pradesh'
        },
        {
            'name': 'Lake View Towers',
            'budget': 16500000,
            'configurations': '4 BHK',
            'location': 'Bellandur, Bangalore',
            'price_per_sqft': 28000,
            'carpet_area': 3100,
            'developer': 'Brigade Group',
            'description': 'Towers with stunning lake views',
            'tags': ['Lake View', 'High Rise', 'Premium'],
            'gmaps_link': 'https://maps.google.com/?q=Bellandur+Bangalore'
        },
        {
            'name': 'City Center Plaza',
            'budget': 9200000,
            'configurations': '2 BHK',
            'location': 'Connaught Place, Delhi',
            'price_per_sqft': 38000,
            'carpet_area': 1700,
            'developer': 'Tata Housing',
            'description': 'Prime location in the heart of the city',
            'tags': ['Central', 'Prime', 'Commercial Hub'],
            'gmaps_link': 'https://maps.google.com/?q=Connaught+Place+Delhi'
        },
        {
            'name': 'Sunset Residency',
            'budget': 19500000,
            'configurations': '4 BHK',
            'location': 'Marine Drive, Mumbai',
            'price_per_sqft': 48000,
            'carpet_area': 3400,
            'developer': 'Oberoi Realty',
            'description': 'Iconic location with breathtaking sunset views',
            'tags': ['Sea View', 'Iconic', 'Luxury'],
            'gmaps_link': 'https://maps.google.com/?q=Marine+Drive+Mumbai'
        }
    ]
    
    print("Seeding properties...")
    for prop_data in properties_data:
        tags = prop_data.pop('tags')
        
        # Create property
        db_property = models.Property(**prop_data)
        db.add(db_property)
        db.flush()
        
        # Add tags
        for tag in tags:
            db_tag = models.PropertyTag(
                property_id=db_property.property_id,
                tag_name=tag
            )
            db.add(db_tag)
    
    db.commit()
    print(f"Seeded {len(properties_data)} properties successfully!")
    db.close()

if __name__ == "__main__":
    seed_properties()
