/**
 * ReWear Valuation Engine
 * Transparent, rule-based algorithmic swap valuation and match fairness calculator
 */

// Category Base Values (in INR)
const CATEGORY_BASE_VALUES = {
  'Jackets': 2200,
  'Hoodies': 1400,
  'Sweaters': 1300,
  'Sarees': 2500,
  'Kurtas': 1100,
  'Ethnic Wear': 2400,
  'Dresses': 1600,
  'Jeans': 1500,
  'Trousers': 1200,
  'Shirts': 1100,
  'T-Shirts': 700,
  'Tops': 850,
  'Skirts': 950,
  'Sportswear': 1350,
  'Other': 1000,
};

// Brand Tier Multipliers
const BRAND_TIERS = {
  // Premium / Designer / Heritage
  'fabindia': 1.25,
  'levi\'s': 1.30,
  'levis': 1.30,
  'zara': 1.20,
  'mango': 1.20,
  'nike': 1.35,
  'adidas': 1.30,
  'puma': 1.20,
  'tommy hilfiger': 1.45,
  'calvin klein': 1.45,
  'ralph lauren': 1.50,
  'superdry': 1.35,
  'marks & spencer': 1.25,
  'manyavar': 1.40,
  'biba': 1.25,
  'w': 1.15,

  // Contemporary High Street
  'h&m': 1.0,
  'hm': 1.0,
  'uniqlo': 1.15,
  'allen solly': 1.10,
  'van heusen': 1.15,
  'peter england': 0.95,
  'louis philippe': 1.25,
  'westside': 0.95,
  'max': 0.85,
  'pantaloons': 0.90,
  'reliance trends': 0.85,
  'zudio': 0.80,
};

// Condition Multipliers
const CONDITION_MULTIPLIERS = {
  'NEW_WITH_TAGS': 1.0,
  'LIKE_NEW': 0.85,
  'EXCELLENT': 0.72,
  'GOOD': 0.58,
  'FAIR': 0.42,
};

// Age Multipliers
const AGE_MULTIPLIERS = {
  '< 6 months': 1.0,
  '6-12 months': 0.90,
  '1-2 years': 0.78,
  '2+ years': 0.65,
};

// Material Multipliers
const MATERIAL_MULTIPLIERS = {
  'Pure Silk': 1.35,
  'Linen': 1.20,
  'Organic Cotton': 1.15,
  'Leather': 1.40,
  'Denim': 1.10,
  'Wool': 1.25,
  'Cotton': 1.0,
  'Polyester': 0.85,
  'Viscose / Rayon': 0.90,
  'Blend': 0.95,
};

/**
 * Calculates estimated swap value based on item characteristics
 */
export const calculateEstimatedValue = ({
  category = 'Other',
  brand = '',
  condition = 'GOOD',
  purchaseAge = '1-2 years',
  material = 'Cotton',
  originalPrice = null,
}) => {
  const normalizedCategory = Object.keys(CATEGORY_BASE_VALUES).find(
    (c) => c.toLowerCase() === category.toLowerCase()
  ) || 'Other';
  const baseValue = CATEGORY_BASE_VALUES[normalizedCategory];

  const cleanBrand = (brand || '').toLowerCase().trim();
  const brandFactor = BRAND_TIERS[cleanBrand] || 1.0;

  const conditionFactor = CONDITION_MULTIPLIERS[condition] || 0.60;
  const ageFactor = AGE_MULTIPLIERS[purchaseAge] || 0.75;
  const materialFactor = MATERIAL_MULTIPLIERS[material] || 1.0;

  let calculatedValue;

  if (originalPrice && originalPrice > 0) {
    // If original retail price is provided, factor it realistically
    const retailDepreciation = originalPrice * conditionFactor * ageFactor * 0.75;
    calculatedValue = Math.round(retailDepreciation / 50) * 50;
  } else {
    // Algorithmic rule-based valuation
    const rawValuation = baseValue * brandFactor * conditionFactor * ageFactor * materialFactor;
    calculatedValue = Math.round(rawValuation / 50) * 50;
  }

  // Ensure minimum floor of ₹200
  calculatedValue = Math.max(200, calculatedValue);

  const rangeLow = Math.round((calculatedValue * 0.88) / 50) * 50;
  const rangeHigh = Math.round((calculatedValue * 1.12) / 50) * 50;

  return {
    estimatedValue: calculatedValue,
    suggestedRange: {
      min: rangeLow,
      max: rangeHigh,
    },
    factors: {
      baseValue,
      brandFactor,
      conditionFactor,
      ageFactor,
      materialFactor,
    },
    disclaimer:
      'This estimated swap value is an algorithmic recommendation based on category, brand, condition, and material. It is non-binding and intended to facilitate fair negotiations between community members.',
  };
};

/**
 * Compares two items for swap fairness
 */
export const compareSwapItems = (offeredItem, requestedItem) => {
  const valueA = offeredItem.estimatedValue || 0;
  const valueB = requestedItem.estimatedValue || 0;

  const difference = Math.abs(valueA - valueB);
  const higherValue = Math.max(valueA, valueB) || 1;
  const percentageDifference = Math.round((difference / higherValue) * 100);

  let fairnessCategory = 'Close Match';
  let fairnessColor = 'green';
  let fairnessDescription = 'Both items have very similar estimated values for an equitable exchange.';

  if (percentageDifference > 35) {
    fairnessCategory = 'Large Difference';
    fairnessColor = 'amber';
    fairnessDescription =
      'There is a noticeable value difference between these items. Consider discussing bundle options or clarifying conditions in chat.';
  } else if (percentageDifference > 15) {
    fairnessCategory = 'Moderate Difference';
    fairnessColor = 'blue';
    fairnessDescription =
      'The values are reasonably close and well within customary peer-to-peer negotiation range.';
  }

  return {
    offeredValue: valueA,
    requestedValue: valueB,
    difference,
    percentageDifference,
    fairnessCategory,
    fairnessColor,
    fairnessDescription,
    higherValuedItem: valueA > valueB ? 'offered' : valueB > valueA ? 'requested' : 'equal',
  };
};
