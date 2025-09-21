import clsx from "clsx";
import styles from "./tooltip.module.css";
import { TooltipProps } from "~/models";

export default function Tooltip(props: TooltipProps) {
	return (
		<div
			id={props.id}
			class={clsx(styles.tooltip, props.class)}
			role="tooltip"
			aria-hidden={props.open ? "false" : "true"}
			data-open={props.open ? "true" : "false"}
		>
			<span class={styles.tooltipTitle}>{props.title}</span>
			<time class={styles.tooltipDate} dateTime={props.dateTime}>
				{props.dateLabel}
			</time>
		</div>
	);
}
