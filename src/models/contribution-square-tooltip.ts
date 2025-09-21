import type { JSX } from "solid-js";
import { ContributionLevel } from "./contribution-square";

export type ContributionSquareTooltipProps = {
	id: string;
	open: boolean;
	title?: string | JSX.Element;
	description?: string | JSX.Element;
	lvl?: ContributionLevel;
	class?: string;
};
