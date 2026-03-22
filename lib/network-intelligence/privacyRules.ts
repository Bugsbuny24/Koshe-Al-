import type { PrivacyGuard, PrivacyLevel } from '@/types/network-intelligence';

export const PRIVACY_LEVEL_LABELS: Record<PrivacyLevel, string> = {
  fully_anonymized: 'Fully Anonymized',
  aggregated_only: 'Aggregated Only',
  no_data: 'No Data',
};

export const PRIVACY_GUARDS: PrivacyGuard[] = [
  {
    id: 'pg-no-individual-data',
    rule_name: 'No Individual User Data in Benchmarks',
    description:
      'Benchmark metrics are derived exclusively from anonymized aggregate data. No individual user activity is ever included.',
    enforced: true,
    exclusions: [
      'Individual user IDs',
      'Individual workflow records',
      'Personal identifiable information',
      'Session-level data',
    ],
  },
  {
    id: 'pg-minimum-sample-size',
    rule_name: 'Minimum Sample Size Before Aggregation',
    description:
      'No aggregate metric is published unless it is derived from a minimum of 50 data points, preventing reverse-engineering of individual contributions.',
    enforced: true,
    exclusions: ['Samples below 50 data points', 'Single-contributor aggregates'],
  },
  {
    id: 'pg-no-company-identifiable',
    rule_name: 'No Company-Identifiable Data in Patterns',
    description:
      'Pattern insights never include company names, account identifiers, or any data that could be attributed to a specific organisation.',
    enforced: true,
    exclusions: [
      'Company names',
      'Account IDs',
      'Workspace identifiers',
      'Custom field names that could identify a company',
    ],
  },
  {
    id: 'pg-opt-in-comparison',
    rule_name: 'Opt-In Only for Benchmark Comparison',
    description:
      'Users may only participate in benchmark comparison if they explicitly opt in. No data is contributed to benchmarks without active consent.',
    enforced: true,
    exclusions: [
      'Users who have not opted in',
      'Trial account data',
      'Data from before opt-in date',
    ],
  },
];

export const PRIVACY_POLICY_SUMMARY = `
Cross-Company Intelligence uses privacy-first design at every layer. All insights are derived from
fully anonymized, aggregated data only. No individual user, session, or company-identifiable
information is ever used in benchmarks or pattern detection. A minimum sample size of 50 is
enforced before any aggregate metric is published. Benchmark comparison participation is strictly
opt-in. These rules are enforced programmatically and are not configurable by end users.
`.trim();

export function isDataAllowed(privacyLevel: PrivacyLevel): boolean {
  return privacyLevel === 'fully_anonymized' || privacyLevel === 'aggregated_only';
}
