export interface Application {
    name: string;
    description: string;
    imageUrl: string;       
    targetUrl: string;
    type: string;
    versionNumber: number;
    isDefaultApplicationOnLogin: boolean;
    ordinal: number;
    

}