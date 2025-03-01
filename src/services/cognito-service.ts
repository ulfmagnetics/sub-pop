import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import { cognitoConfig } from '../constants';

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.clientId,
});

export const signIn = (username: string, password: string): Promise<any> => {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        resolve({ challenge: 'NEW_PASSWORD_REQUIRED', cognitoUser });
      },
    });
  });
};

export const getCurrentUser = (): CognitoUser | null => {
  return userPool.getCurrentUser();
};

export const signOut = (): void => {
  const user = getCurrentUser();
  if (user) {
    user.signOut();
  }
};
