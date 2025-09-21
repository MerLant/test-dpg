import clsx from "clsx";
import { createSignal, createUniqueId, JSX } from "solid-js";
import styles from "./contribution-square.module.css";
import type { ContributionSquareProps } from "~/models";

const LEVELS = ["level0", "level1", "level2", "level3", "level4"] as const;
const levelIndex = (v: number) =>
	v <= 0 ? 0 : Math.min(4, (((v - 1) / 10) | 0) + 1);

const fmtWeekday = new Intl.DateTimeFormat("ru-RU", {
	weekday: "long",
	timeZone: "UTC",
});
const fmtMonth = new Intl.DateTimeFormat("ru-RU", {
	month: "long",
	timeZone: "UTC",
});
const humanRuDateUTC = (d: Date) =>
	`${fmtWeekday.format(d)}, ${fmtMonth.format(d)} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

export default function ContributionSquare(props: ContributionSquareProps) {
	const [localSelected, setLocalSelected] = createSignal(false); // для неконтролируемого режима
	const isSelected = () => props.selected ?? localSelected();

	const count = () => props.contribution ?? 0;
	const lvlClass = () => styles[LEVELS[levelIndex(count())]];
	const iso = () => props.date.toISOString().slice(0, 10);
	const tipId = createUniqueId();

	const toggleSelect = () => {
		if (props.onSelect) props.onSelect(props.date);
		else setLocalSelected((v) => !v);
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (
		e
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleSelect();
		}
	};

	return (
		<div
			class={clsx(styles.square, lvlClass())}
			role="gridcell"
			data-level={count()}
			tabIndex={0}
			aria-selected={isSelected() ? "true" : "false"}
			aria-describedby={isSelected() ? tipId : undefined}
			onClick={toggleSelect}
			onKeyDown={onKeyDown}
		>
			<div
				id={tipId}
				class={styles.tooltip}
				role="tooltip"
				aria-hidden={isSelected() ? "false" : "true"}
			>
				<span class={styles.tooltipTitle}>
					{count()} contribution{count() === 1 ? "" : "s"}
				</span>
				<time class={styles.tooltipDate} dateTime={iso()}>
					{humanRuDateUTC(props.date)}
				</time>
			</div>
		</div>
	);
}
