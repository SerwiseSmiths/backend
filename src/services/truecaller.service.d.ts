interface TruecallerProfilePayload {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    countryCode?: string;
    requestNonce?: string;
    [key: string]: any;
}
export interface VerifiedTruecallerProfile extends TruecallerProfilePayload {
    rawJson: any;
}
/**
 * Verify Truecaller SDK response using Truecaller's public keys.
 * Expects base64-encoded payload and signature, and validates:
 * - Signature over payload using Truecaller public keys
 * - requestNonce from payload matches caller-provided requestNonce
 */
export declare const verifyTruecallerResponse: (params: {
    payload: string;
    signature: string;
    requestNonce: string;
}) => Promise<VerifiedTruecallerProfile>;
export {};
//# sourceMappingURL=truecaller.service.d.ts.map