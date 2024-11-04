// src/types.ts
export type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

export type AddressProvider = 'tomtom' | 'garmin';

export type ProviderConfig = {
    baseURL: string;
    pathTemplate: string;
    responseMapping: {
        streetNumber: string[];
        street: string[];
        suburb: string[];
        city: string[];
        state: string[];
        postcode: string[];
        country: string[];
        score: string[];
    };
};

export type SearchParams = {
    query: string;
    countrySet: 'AU';
    limit: number;
};

export type AddressResult = {
    streetNumber: string;
    street: string;
    suburb: string;
    city: string;
    state: AustralianState;
    postcode: string;
    country: string;
    score: number;
};

export type SearchResponse = {
    results: AddressResult[];
    total: number;
};