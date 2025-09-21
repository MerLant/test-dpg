import clsx from "clsx";
import styles from "./contribution-square-tooltip.module.css";
import {
	ContributionSquareDescription,
	ContributionSquareTitle,
	Tooltip,
} from "~/components";
import { ContributionSquareTooltipProps } from "~/models";

export default function ContributionSquareTooltip(
	props: ContributionSquareTooltipProps
) {
	const title = () => {
		if (props.title === undefined || props.title === null) return null;
		if (typeof props.title === "string") {
			return (
				<ContributionSquareTitle class={styles.title}>
					{props.title}
				</ContributionSquareTitle>
			);
		}
		return props.title;
	};

	const description = () => {
		if (props.description === undefined || props.description === null) {
			return null;
		}
		if (typeof props.description === "string") {
			return (
				<ContributionSquareDescription class={styles.description}>
					{props.description}
				</ContributionSquareDescription>
			);
		}
		return props.description;
	};

	return (
		<Tooltip
			id={props.id}
			open={props.open}
			class={clsx(styles.tooltip, props.class)}
		>
			<div class={styles.content}>
				{title()}
				{description()}
			</div>
		</Tooltip>
	);
}
