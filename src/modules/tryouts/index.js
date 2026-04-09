export { default } from './TryoutsPanel';

export const moduleConfig = {
  id: 'tryouts',
  label: 'Tryouts',
  icon: '\uD83E\uDD4E',
  enabled: true,
  mode: 'standalone',  // Can take over the entire UI
  permissions: ['head_coach', 'assistant', 'league_director'],
};
