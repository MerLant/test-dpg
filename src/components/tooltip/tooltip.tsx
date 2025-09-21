import clsx from "clsx";
import styles from "./tooltip.module.css";
import type { TooltipProps } from "~/models";

export default function Tooltip(props: TooltipProps) {
	return (
		<div
			id={props.id}
			class={clsx(styles.tooltip, props.class)}
			role="tooltip"
			aria-hidden={props.open ? "false" : "true"}
			data-open={props.open ? "true" : "false"}
		>
			{props.children}
		</div>
	);
}
