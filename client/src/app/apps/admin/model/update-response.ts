import { HttpEventType } from "@angular/common/http";

export interface UpdateResponse {
    errorMessage?: string;
    isOk: boolean;
    httpEventType: HttpEventType | null;
    bytesTransferred: number | null;
    totalBytesToTransfer: number | null;
    
}