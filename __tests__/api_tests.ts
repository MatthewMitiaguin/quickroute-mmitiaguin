import { AddressService, getNestedValue } from '../src/address_api';
import dotenv from 'dotenv';

dotenv.config();

describe('AddressService', () => {
    it('Throw error if API key not provided', () => {
        expect(() => new AddressService('')).toThrow('API Key not provided');
        expect(() => new AddressService(undefined as any)).toThrow('API Key not provided');
    });
});

describe('getNestedValue', () => {
    // Sample API response format based on TomTom/Garmin structure
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
    it('Get incomplete address', () => {
        expect(getNestedValue(incompleteAddress, ['address', 'streetNumber'])).toBe('');
        expect(getNestedValue(incompleteAddress, ['address', 'municipalitySubdivision'])).toBe('');
    });
    it('Get street name', () => {
        expect(getNestedValue(testAddress, ['address', 'streetName'])).toBe('Haines Street');
    });
    it('Get street number', () => {
        expect(getNestedValue(testAddress, ['address', 'streetNumber'])).toBe('2/118');
    });
    it('Get suburb', () => {
        expect(getNestedValue(testAddress, ['address', 'municipalitySubdivision'])).toBe('North Melbourne');
    });
    it('Get city', () => {
        expect(getNestedValue(testAddress, ['address', 'municipality'])).toBe('Melbourne');
    });
    it('Get state', () => {
        expect(getNestedValue(testAddress, ['address', 'countrySubdivision'])).toBe('Victoria');
    });
    it('Get postcode', () => {
        expect(getNestedValue(testAddress, ['address', 'postalCode'])).toBe('3051');
    });
    it('Get country', () => {
        expect(getNestedValue(testAddress, ['address', 'country'])).toBe('Australia');
    });
    it('Get score', () => {
        expect(getNestedValue(testAddress, ['score'])).toBe(8.33333);
    });
});