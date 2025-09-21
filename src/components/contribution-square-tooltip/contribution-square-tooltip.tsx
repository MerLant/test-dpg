import clsx from "clsx";
import styles from "./contribution-square-tooltip.module.css";
import {
	ContributionSquareDescription,
	ContributionSquareTitle,
	Tooltip,
} from "~/components";
import { ContributionSquareTooltipProps } from "~/models";
import { Show } from "solid-js";

export default function ContributionSquareTooltip(
	props: ContributionSquareTooltipProps
) {
	return (
		<Tooltip
			id={props.id}
			open={props.open}
			class={clsx(styles.tooltip, props.class)}
		>
			<div class={styles.content}>
				<Show when={props.title}>
					<ContributionSquareTitle class={styles.title}>
						{props.title}
					</ContributionSquareTitle>
				</Show>
				<Show when={props.description}>
					<ContributionSquareDescription class={styles.description}>
						{props.description}
					</ContributionSquareDescription>
				</Show>
			</div>
		</Tooltip>
	);
}
