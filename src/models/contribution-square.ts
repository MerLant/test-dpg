import type { JSX } from "solid-js";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

type SelectChangePayload = {
	id?: string | number;
	selected: boolean;
};

export interface ContributionSquareProps {
	id?: string | number;
	contribution?: number;
	lvl?: ContributionLevel;
	title?: string | JSX.Element;
	description?: string | JSX.Element;
	titleSlot?: JSX.Element;
	descriptionSlot?: JSX.Element;
	selected?: boolean;
	defaultSelected?: boolean;
	onSelectChange?: (payload: SelectChangePayload) => void;
	ariaLabel?: string;
	class?: string;
}

export type { ContributionLevel, SelectChangePayload };
