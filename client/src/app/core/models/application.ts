export interface Application {
    name: string,
    friendlyName: string,
    description: string | null;
    imageUrl: string;
    targetUrl: string;
    requiresRoleNames: string[];
}
