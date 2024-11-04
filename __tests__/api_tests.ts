import { AddressService, getNestedValue, apiTransformation } from '../src/address_api';
import { ProviderConfig, AddressResult } from '../src/types';
import dotenv from 'dotenv';

dotenv.config();

describe('AddressService', () => {
    it('Throw error if API key not provided', () => {
        expect(() => new AddressService('')).toThrow('API Key not provided');
        expect(() => new AddressService(undefined as any)).toThrow('API Key not provided');
    });
});

// Nested value function
describe('getNestedValue', () => {
    // Sample API response format based on TomTom/Garmin structure
    it('Get data', () => {
        const testAddress = {
            address: {
                streetNumber: '2/118',
                streetName: 'Haines Street',
                municipalitySubdivision: 'North Melbourne',
                municipality: 'Melbourne',
                countrySubdivision: 'Victoria',
                postalCode: '3051',
                country: 'Australia'
            },
            score: 8.33333
        };
        expect(getNestedValue(testAddress, ['address', 'streetNumber'])).toBe('2/118');
        expect(getNestedValue(testAddress, ['address', 'streetName'])).toBe('Haines Street');
        expect(getNestedValue(testAddress, ['address', 'municipalitySubdivision'])).toBe('North Melbourne');
        expect(getNestedValue(testAddress, ['address', 'municipality'])).toBe('Melbourne');
        expect(getNestedValue(testAddress, ['address', 'countrySubdivision'])).toBe('Victoria');
        expect(getNestedValue(testAddress, ['address', 'postalCode'])).toBe('3051');
        expect(getNestedValue(testAddress, ['address', 'country'])).toBe('Australia');
        expect(getNestedValue(testAddress, ['score'])).toBe(8.33333);
        
    });
    it('Get incomplete address', () => {
        const incompleteAddress = {
            address: {
                streetNumber: '',
                streetName: 'Haines Street',
                municipalitySubdivision: '',
                municipality: 'Melbourne',
                countrySubdivision: 'Victoria',
                postalCode: '3051',
                country: 'Australia'
            },
            score: 8.33333
        }
        expect(getNestedValue(incompleteAddress, ['address', 'streetNumber'])).toBe('');
        expect(getNestedValue(incompleteAddress, ['address', 'municipalitySubdivision'])).toBe('');
    });
    it('Handle empty response', () => {
        const emptyAddress = {}
        expect(getNestedValue(emptyAddress, ['address', 'streetNumber'])).toBe('');
    });
});

// API Transformation function

describe('apiTransformation', () => {
    const mapping: ProviderConfig['responseMapping'] = {
        streetNumber: ['address', 'streetNumber'],
        street: ['address', 'streetName'],
        suburb: ['address', 'municipalitySubdivision'],
        city: ['address', 'municipality'],
        state: ['address', 'countrySubdivision'],
        postcode: ['address', 'postalCode'],
        country: ['address', 'country'],
        score: ['score']
    };

    it('transform address', () => {
        const testApiResponse = {
            address: {
                streetNumber: '2/118',
                streetName: 'Haines Street',
                municipalitySubdivision: 'North Melbourne',
                municipality: 'Melbourne',
                countrySubdivision: 'Victoria',
                postalCode: '3051',
                country: 'Australia'
            },
            score: 6.66666
        };

        const toCheckAgainst: AddressResult = {
            streetNumber: '2/118',
            street: 'Haines Street',
            suburb: 'North Melbourne',
            city: 'Melbourne',
            state: 'Victoria',
            postcode: '3051',
            country: 'Australia',
            score: 6.66666
        };

        expect(apiTransformation(testApiResponse, mapping)).toEqual(toCheckAgainst);
    });

    it('handle empty fields and populate defaults(australia)', () => {
        const mockResponse = {
            address: {
                streetName: 'Haines Street',
                municipality: 'Melbourne',
            }
        };

        const result = apiTransformation(mockResponse, mapping);

        expect(result).toEqual({
            streetNumber: '',
            street: 'Haines Street',
            suburb: '',
            city: 'Melbourne',
            state: '',
            postcode: '',
            country: 'Australia',
            score: 0
        });
    });
});

// Search function tests

describe('AddressService', () => {
    let addressService: AddressService;
    const apiKey = process.env.TOMTOM_API_KEY;
    addressService = new AddressService(apiKey!);

    it('return results', async () => {
        const response = await addressService.search('Haines Stret Melb');
        expect(response).toHaveProperty('results');
        expect(response).toHaveProperty('total');
        
        const firstResult = response.results[0];
        expect(firstResult).toMatchObject({
            streetNumber: expect.any(String),
            street: expect.any(String),
            city: expect.any(String),
            state: expect.any(String),
            postcode: expect.any(String),
            country: 'Australia',
            score: expect.any(Number)
        });
    });

    it('Selected API Provider', async () => {
        const service = new AddressService(process.env.TOMTOM_API_KEY!, 'tomtom');
        const response = await service.search('Collins Street Melbourne');
        expect(response.results.length).toBeGreaterThan(0);
    });
});