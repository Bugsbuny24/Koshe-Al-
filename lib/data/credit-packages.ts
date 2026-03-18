// ── Credit packages ───────────────────────────────────────────────────────────
// Source-of-truth for purchasable credit packages.
// `shopierUrl` is optional — when absent the buy button renders as disabled
// with a "Yakında" label so the UI can gracefully handle unlaunched packages.

export type CreditPackageDef = {
  id: string;
  name: string;
  credits: number;
  /** Price in Turkish Lira (display string, e.g. "₺199") */
  priceTRY: string;
  isPopular?: boolean;
  /** Payment link. Leave undefined until the Shopier product is live. */
  shopierUrl?: string;
};

export const CREDIT_PACKAGES_DEF: CreditPackageDef[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    priceTRY: "₺199",
    isPopular: false,
    shopierUrl: "https://www.shopier.com/TradeVisual/45264454",
  },
  {
    id: "growth",
    name: "Growth",
    credits: 300,
    priceTRY: "₺499",
    isPopular: true,
    shopierUrl: "https://www.shopier.com/TradeVisual/45264598",
  },
  {
    id: "power",
    name: "Power",
    credits: 1000,
    priceTRY: "₺1.299",
    isPopular: false,
    // shopierUrl: undefined — not yet launched, button will show "Yakında"
  },
];
