import axios from 'axios';
import dotenv from 'dotenv';

// API Connection
dotenv.config();

const api = axios.create({
    baseURL: 'https://api.tomtom.com/search/2',
    params: {
      key: process.env.TOMTOM_API_KEY
    }
  });

// Types

type AustralianState = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "NT" | "ACT";

type SearchParams = {
    query: string;
    countrySet: 'AU';
    limit?: number;
};
  
type AddressResult = {
    streetNumber?: number;
    street: string;
    city: string;
    state: AustralianState;
    postcode: number;
    country: string;
};
  
type SearchResponse = {
    results: AddressResult[];
    total: number;
};



async function searchAddress(params: SearchParams): Promise<SearchResponse> {
    try {
        const {query} = params;

        return {
            results: [{
                streetNumber: 100,
                street: query,
                city: "Melbourne",
                state: "VIC",
                postcode: 3000,
                country: "Australia"
            }],
            total: 1
        };
    } catch (error) {
        throw new Error("Search failed");
    }
}
  
const search = {
    query: "Haines Street",
    countrySet: "AU"
};
  
searchAddress(search).then(console.log);
