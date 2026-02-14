// Configuration file for the HBnB Front-End Application
// Update these values according to your environment

const CONFIG = {
    // API Base URL - Update this to match your backend API
    API_BASE_URL: 'http://127.0.0.1:5001/api/v1',
    
    // Cookie settings
    COOKIE_DAYS: 7,
    
    // Default images
    DEFAULT_PLACE_IMAGE: 'images/logo.png',
    
    // Number of place images available (for random selection)
    PLACE_IMAGES_COUNT: 3
};

// Export config (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
