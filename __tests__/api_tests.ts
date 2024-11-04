import { AddressService } from '../src/address_api';
import dotenv from 'dotenv';

dotenv.config();

describe('AddressService', () => {
    it('Throw error if API key not provided', () => {
        expect(() => new AddressService('')).toThrow('API Key not provided');
        expect(() => new AddressService(undefined as any)).toThrow('API Key not provided');
    });
});