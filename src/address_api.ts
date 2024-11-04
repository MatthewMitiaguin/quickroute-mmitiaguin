import axios from 'axios';
import { AustralianState, SearchParams, SearchResponse, AddressResult } from './types';

// Functions
function apiTransformation(item: any): AddressResult {
    return {
        streetNumber: item.address.streetNumber || '',
        street: item.address.streetName || '',
        suburb: item.address.municipalitySubdivision || '',
        city: item.address.municipality || '',
        state: (item.address.countrySubdivision || 'VIC') as AustralianState,
        postcode: item.address.postalCode || 0,
        country: item.address.country || 'Australia',
        score: item.score
        
    };
}

export class AddressService {
    private readonly apiKey: string;
    private readonly api;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('API Key not provided');
        }
        
        this.apiKey = apiKey;
        
        this.api = axios.create({
            baseURL: 'https://api.tomtom.com/search/2',
            params: {
                key: this.apiKey
            }
        });
    }

    async search(query: string): Promise<SearchResponse> {
        try {
            const searchParams: SearchParams = {
                query,
                countrySet: 'AU',
                limit: 5
            };
    
            const response = await this.api.get(`/search/${searchParams.query}.json`, {
                params: {
                    limit: searchParams.limit,
                    countrySet: searchParams.countrySet,
                    typeahead: true
                }
            });
            
            return {
                results: response.data.results.map(apiTransformation),
                total: response.data.summary.numResults
            };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Search addres error');
        }
    }
}