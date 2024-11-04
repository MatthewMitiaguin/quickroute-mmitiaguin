import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import { AddressService } from './address_api';

const ssmClient = new SSMClient({});

let addressService: AddressService | null = null;

async function initializeAddressService() {
  if (!addressService) {
    const command = new GetParameterCommand({
      Name: "/address-service/tomtom-api-key"
    });
    
    const response = await ssmClient.send(command);
    const apiKey = response.Parameter?.Value;
    
    if (!apiKey) {
      throw new Error('Failed to retrieve API key');
    }
    
    addressService = new AddressService(apiKey);
  }
  return addressService;
}

export async function handler(event: any) {
  try {
    const service = await initializeAddressService();
    
    const results = await service.search("Haines Street");
    
    return {
      statusCode: 200, 
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}