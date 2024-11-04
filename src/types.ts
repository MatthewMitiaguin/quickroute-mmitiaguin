// src/types.ts
export type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export type SearchParams = {
    query: string;
    countrySet: 'AU';
    limit?: number;
};

export type AddressResult = {
    streetNumber?: string;
    street: string;
    suburb?: string;
    city: string;
    state: AustralianState;
    postcode: string;
    country: string;
    score?: number;
};

export type SearchResponse = {
    results: AddressResult[];
    total: number;
};