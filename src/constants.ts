// Cognito user pool config
export const cognitoConfig = {
  region: process.env.VUE_APP_COGNITO_REGION || 'us-east-1',
  userPoolId: process.env.VUE_APP_COGNITO_USER_POOL_ID || '',
  clientId: process.env.VUE_APP_COGNITO_CLIENT_ID || '',
};

// Define a static map of categories
export const CategoryMap = Object.freeze({
  streaming: 'Streaming',
  software: 'Software',
  gaming: 'Gaming',
  creators: 'Creators (Patreon, Substack, etc.)',
  puzzles: 'Puzzles/Crosswords',
  news: 'News and Magazines',
  other: 'Other',
});
