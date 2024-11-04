import axios from 'axios';
import { AustralianState, SearchParams, SearchResponse, AddressResult, AddressProvider, ProviderConfig } from './types';
import { PROVIDER_CONFIGS } from './address_provider';

// Functions
function getNestedValue(obj: any, path: string[]): any {
    return path.reduce((current, key) => (current && current[key] !== undefined ? current[key] : ''), obj);
}

function apiTransformation(item: any, mapping: ProviderConfig['responseMapping']): AddressResult {
    const result: AddressResult = {
        streetNumber: getNestedValue(item, mapping.streetNumber) || '',
        street: getNestedValue(item, mapping.street) || '',
        suburb: getNestedValue(item, mapping.suburb) || '',
        city: getNestedValue(item, mapping.city) || '',
        state: (getNestedValue(item, mapping.state) || 'VIC') as AustralianState,
        postcode: getNestedValue(item, mapping.postcode) || '',
        country: getNestedValue(item, mapping.country) || 'Australia',
        score: getNestedValue(item, mapping.score) || 0
    };
    return result;
}

export class AddressService {
    private readonly apiKey: string;
    private readonly api;
    private readonly provider: ProviderConfig;

    constructor(apiKey: string, provider: AddressProvider = 'tomtom') {
        if (!apiKey) {
            throw new Error('API Key not provided');
        }

        this.apiKey = apiKey;
        this.provider = PROVIDER_CONFIGS[provider];
        
        this.api = axios.create({
            baseURL: this.provider.baseURL,
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
            const encodedQuery = encodeURIComponent(searchParams.query);
            const response = await this.api.get(`/search/${encodedQuery}.json`, {
                params: {
                    limit: searchParams.limit,
                    countrySet: searchParams.countrySet,
                    typeahead: true
                }
            });
            
            return {
                results: response.data.results.map(
                    (item: any) => apiTransformation(item, this.provider.responseMapping)
                ),
                total: response.data.summary.numResults
            };
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Search addres error');
        }
    }
}