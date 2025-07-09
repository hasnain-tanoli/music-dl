export const validateSpotifyUrl = (url) => {
  const spotifyRegex = /^https:\/\/open\.spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+(\?.*)?$/;
  return spotifyRegex.test(url.trim());
};

export const extractSpotifyId = (url) => {
  const match = url.match(/\/([a-zA-Z0-9]+)(\?|$)/);
  return match ? match[1] : null;
};

export const getSpotifyType = (url) => {
  const match = url.match(/\/(track|album|playlist)\//);
  return match ? match[1] : null;
};

export const getSpotifyMetadata = async (url) => {
  try {
    const type = getSpotifyType(url);
    const id = extractSpotifyId(url);
    
    if (!type || !id) {
      throw new Error('Invalid Spotify URL');
    }

    // Using Spotify oEmbed API for metadata
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const data = await response.json();
    
    // Parse the HTML to extract more details
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.html, 'text/html');
    const iframe = doc.querySelector('iframe');
    const src = iframe?.src || '';
    
    // Extract image from thumbnail_url or use default
    const image = data.thumbnail_url || '/default-album.jpg';
    
    // Extract title and artist from the title
    const fullTitle = data.title || '';
    let title = fullTitle;
    let artist = 'Unknown Artist';
    
    if (type === 'track') {
      const parts = fullTitle.split(' by ');
      if (parts.length >= 2) {
        title = parts[0];
        artist = parts[1];
      }
    } else if (type === 'album' || type === 'playlist') {
      const parts = fullTitle.split(' by ');
      if (parts.length >= 2) {
        title = parts[0];
        artist = parts[1];
      } else {
        title = fullTitle;
        artist = type === 'playlist' ? 'Various Artists' : 'Unknown Artist';
      }
    }
    
    return {
      type,
      title: title.trim(),
      artist: artist.trim(),
      image,
      url,
      trackCount: type === 'track' ? 1 : null // Will be updated by backend
    };
  } catch (error) {
    console.error('Error fetching Spotify metadata:', error);
    
    // Fallback metadata
    const type = getSpotifyType(url);
    return {
      type: type || 'track',
      title: 'Unknown Title',
      artist: 'Unknown Artist',
      image: '/default-album.jpg',
      url,
      trackCount: type === 'track' ? 1 : null
    };
  }
};