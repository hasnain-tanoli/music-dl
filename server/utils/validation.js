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