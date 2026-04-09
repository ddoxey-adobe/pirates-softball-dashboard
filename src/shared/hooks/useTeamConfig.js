import useStorage from './useStorage';
import { DEFAULT_TEAM_CONFIG } from '@app/theme';

const TEAM_CONFIG_KEY = 'team-config-v1';

/**
 * useTeamConfig — Provides the current team config and a setter.
 *
 * Falls back to DEFAULT_TEAM_CONFIG when nothing is stored.
 */
export default function useTeamConfig() {
  const [config, setConfig] = useStorage(TEAM_CONFIG_KEY, DEFAULT_TEAM_CONFIG);

  const updateConfig = (partial) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  return { config, updateConfig };
}
