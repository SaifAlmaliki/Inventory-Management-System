// Iraq provinces and cities data
export const IRAQ_PROVINCES = [
  "Baghdad",
  "Basra", 
  "Nineveh",
  "Erbil",
  "Sulaymaniyah",
  "Dohuk",
  "Kirkuk",
  "Anbar",
  "Karbala",
  "Najaf",
  "Babil",
  "Wasit",
  "Diyala",
  "Maysan",
  "Muthanna",
  "Qadisiyyah",
  "Dhi Qar"
];

export const IRAQ_CITIES_BY_PROVINCE: Record<string, string[]> = {
  "Baghdad": [
    "Baghdad", "Al-Karkh", "Al-Rusafa", "Al-Mansour", "Al-Karrada", 
    "Al-Jadriya", "Al-Adhamiya", "Al-Kadhimiya", "Al-Sadr City"
  ],
  "Basra": [
    "Basra", "Al-Zubair", "Al-Faw", "Abu Al-Khasib", "Al-Qurna", "Shatt Al-Arab"
  ],
  "Nineveh": [
    "Mosul", "Tal Afar", "Sinjar", "Al-Hamdaniya", "Al-Shikhan", "Al-Ba'aj"
  ],
  "Erbil": [
    "Erbil", "Soran", "Koisanjaq", "Mergasur", "Choman", "Rawanduz"
  ],
  "Sulaymaniyah": [
    "Sulaymaniyah", "Halabja", "Ranya", "Darbandikhan", "Kalar", "Dukan"
  ],
  "Dohuk": [
    "Dohuk", "Zakho", "Amedi", "Sumel", "Bardarash", "Al-Shikhan"
  ],
  "Kirkuk": [
    "Kirkuk", "Al-Hawija", "Dibis", "Al-Rashad", "Al-Daquq", "Al-Zab"
  ],
  "Anbar": [
    "Ramadi", "Fallujah", "Al-Qaim", "Hit", "Haditha", "Rutba"
  ],
  "Karbala": [
    "Karbala", "Al-Hindiya", "Ain Al-Tamr", "Al-Mahawil"
  ],
  "Najaf": [
    "Najaf", "Al-Kufa", "Al-Manathera", "Al-Mishkhab", "Al-Qadisiyyah"
  ],
  "Babil": [
    "Hillah", "Al-Mahawil", "Al-Musayyib", "Al-Hashimiya", "Al-Qasim"
  ],
  "Wasit": [
    "Kut", "Al-Suwaira", "Al-Aziziyah", "Al-Nu'maniya", "Al-Badra"
  ],
  "Diyala": [
    "Baqubah", "Al-Khalis", "Al-Muqdadiya", "Khanaqin", "Al-Saadiya"
  ],
  "Maysan": [
    "Amarah", "Al-Kahla", "Al-Maimouna", "Al-Majar Al-Kabir", "Al-Salam"
  ],
  "Muthanna": [
    "Samawah", "Al-Rumaitha", "Al-Salman", "Al-Khidhir", "Al-Samawa"
  ],
  "Qadisiyyah": [
    "Diwaniyah", "Al-Shamiya", "Al-Hamza", "Al-Diwaniyah", "Al-Afaq"
  ],
  "Dhi Qar": [
    "Nasiriyah", "Al-Rifai", "Al-Shatra", "Al-Nasir", "Al-Chibayish"
  ]
};

export interface LocationScore {
  score: number;
  reason: string;
}

/**
 * Calculate location-based priority score for product search
 * @param customerProvince Customer's province
 * @param customerCity Customer's city
 * @param dealerProvince Dealer's province
 * @param dealerCity Dealer's city
 * @returns LocationScore with priority score and reason
 */
export function calculateLocationScore(
  customerProvince: string,
  customerCity: string,
  dealerProvince: string,
  dealerCity: string
): LocationScore {
  // Same city = highest priority (score 100)
  if (customerProvince === dealerProvince && customerCity === dealerCity) {
    return {
      score: 100,
      reason: "Same city"
    };
  }

  // Same province = medium priority (score 50)
  if (customerProvince === dealerProvince) {
    return {
      score: 50,
      reason: "Same province"
    };
  }

  // Different province = lowest priority (score 10)
  return {
    score: 10,
    reason: "Different province"
  };
}

/**
 * Get all cities for a given province
 * @param province Province name
 * @returns Array of cities in the province
 */
export function getCitiesByProvince(province: string): string[] {
  return IRAQ_CITIES_BY_PROVINCE[province] || [];
}

/**
 * Get all available provinces
 * @returns Array of all Iraq provinces
 */
export function getAllProvinces(): string[] {
  return IRAQ_PROVINCES;
}

/**
 * Validate if a city belongs to a province
 * @param city City name
 * @param province Province name
 * @returns boolean indicating if city belongs to province
 */
export function isValidCityForProvince(city: string, province: string): boolean {
  const cities = getCitiesByProvince(province);
  return cities.includes(city);
}

/**
 * Sort products by location priority
 * @param products Array of products with dealer location info
 * @param customerProvince Customer's province
 * @param customerCity Customer's city
 * @returns Sorted products by location priority
 */
export function sortProductsByLocation<T extends { dealer: { province: string; city: string } }>(
  products: T[],
  customerProvince: string,
  customerCity: string
): T[] {
  return products.sort((a, b) => {
    const scoreA = calculateLocationScore(
      customerProvince,
      customerCity,
      a.dealer.province || "",
      a.dealer.city || ""
    );
    
    const scoreB = calculateLocationScore(
      customerProvince,
      customerCity,
      b.dealer.province || "",
      b.dealer.city || ""
    );

    return scoreB.score - scoreA.score; // Higher score first
  });
}
