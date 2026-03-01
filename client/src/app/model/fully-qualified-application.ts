import { Application } from "./application";
import {ApplicationMetaData} from './application-meta-data';

export interface FullyQualifiedApplication {
  application: Application,
  applicationMetaData: ApplicationMetaData
}
