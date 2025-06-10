import { atom } from 'recoil';

export interface AppState {
  placeholder1: string;
  placeholder2: number;
}

export const defaultAppState = atom<AppState>({
  key: 'app_state',
  default: {
    placeholder1: 'fixme',
    placeholder2: 1,
  },
});
