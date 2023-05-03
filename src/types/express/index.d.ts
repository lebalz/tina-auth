import { User as pUser } from '../../auth/azure-ad';

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface User extends pUser {
    }
  }
}