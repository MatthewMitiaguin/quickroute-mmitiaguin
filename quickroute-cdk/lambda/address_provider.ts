import { AddressProvider, ProviderConfig } from "./types";

export const PROVIDER_CONFIGS: Record<AddressProvider, ProviderConfig> = {
  tomtom: {
    baseURL: "https://api.tomtom.com/search/2",
    pathTemplate: "/search/{query}.json",
    responseMapping: {
      streetNumber: ["address", "streetNumber"],
      street: ["address", "streetName"],
      suburb: ["address", "municipalitySubdivision"],
      city: ["address", "municipality"],
      state: ["address", "countrySubdivision"],
      postcode: ["address", "postalCode"],
      country: ["address", "country"],
      score: ["score"],
    },
  },
  garmin: {
    baseURL: "https://api.garmin.com/search/2",
    pathTemplate: "/search/{query}.json",
    responseMapping: {
      streetNumber: ["address", "streetNumber"],
      street: ["address", "streetName"],
      suburb: ["address", "municipalitySubdivision"],
      city: ["address", "municipality"],
      state: ["address", "countrySubdivision"],
      postcode: ["address", "postalCode"],
      country: ["address", "country"],
      score: ["score"],
    },
  },
};
