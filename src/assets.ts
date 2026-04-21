/**
 * Centralized image asset management.
 * Add new images here to make them easily accessible throughout the app.
 */

export const IMAGES = {
  // Brand Assets
  logo: '/images/logo.png',
  
  // Placeholders for future use
  hero_dentist: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
  doctor_portrait: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000',
  
  // Clinic Photos
  reception: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
  treatment_room: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
};

/**
 * Helper to get image path with fallback
 * @param path Public path to the image
 */
export const getImagePath = (path: string) => {
  return path;
};
