import { AddressService } from './src/address_api'; 
import dotenv from 'dotenv';

dotenv.config();

async function testAddressService() {
    try {
        const apiKey = process.env.TOMTOM_API_KEY;
        if (!apiKey) {
            throw new Error('API KEY not provided');
        }
        const addressService = new AddressService(apiKey);

        console.log('Testing Address Api\n');

        const results = await addressService.search('Unit 2 118 Haines Street North Melbourne');
        console.log('Results:', JSON.stringify(results, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

testAddressService();