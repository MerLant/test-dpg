import type { JSX } from "solid-js";

export type TooltipBaseProps = {
	id: string;
	open: boolean;
	class?: string;
};

export type TooltipContentProps = {
	children: JSX.Element;
};

export type TooltipProps = TooltipBaseProps & TooltipContentProps;
