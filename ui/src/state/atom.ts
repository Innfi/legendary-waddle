import { atom } from 'jotai';

export const dateKeyAtom = atom(new Date().toISOString().slice(2, 10).replace(/-/g, ''));
