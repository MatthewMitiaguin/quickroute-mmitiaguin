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

// Functions 

async function searchAddress(params: SearchParams): Promise<SearchResponse> {
    try {
        const response = await api.get(`/search/${params.query}.json`, {
            params: {
              limit: params.limit,
              countrySet: params.countrySet
            }
          });
        return {
            results: response.data.results.map((item: any) => ({
                street: item.address.streetName || '',
                city: item.address.municipality || '',
                state: item.address.countrySubdivision || '',
                postcode: item.address.postalCode || '',
                country: item.address.country || ''
              })),
              total: response.data.summary.numResults
        };
        } 
        catch (error) {
          console.error('Error:', error);
          throw new Error('Search addres error');
        }
}
  
async function testSearch() {
    try {
        const result = await searchAddress({
        query: "Haines Street Melbourne",
        countrySet: "AU",
        limit: 5
        });
        
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('Search error:', error);
    }
}

testSearch();
  

