import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
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

export const refreshSession = (): Promise<CognitoUserSession> => {
  const cognitoUser = getCurrentUser();
  if (!cognitoUser) {
    return Promise.reject(new Error('No current user'));
  }

  return new Promise((resolve, reject) => {
    cognitoUser.getSession((err: Error, session: null | CognitoUserSession) => {
      if (err) {
        return reject(err);
      }
      if (session === null) {
        return reject(new Error('Session is null'));
      }

      if (session.isValid()) {
        return resolve(session);
      }

      cognitoUser.refreshSession(
        session.getRefreshToken(),
        (err, newSession) => {
          if (err) {
            return reject(err);
          }
          resolve(newSession);
        }
      );
    });
  });
};
