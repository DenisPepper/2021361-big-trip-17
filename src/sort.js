import { SortSettings } from './settings';

const defaultCompare = () => 0;

export const sorting = (sort, points) => points.sort(SortSettings[sort] || defaultCompare);
