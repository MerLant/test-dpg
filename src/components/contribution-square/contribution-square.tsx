import clsx from "clsx";
import { Show, createMemo, createSignal, createUniqueId, JSX } from "solid-js";
import styles from "./contribution-square.module.css";
import type { ContributionSquareProps } from "~/models";
import { Tooltip } from "~/components";

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
	const [localSelected, setLocalSelected] = createSignal(false);

	const isSelected = createMemo(() => props.selected ?? localSelected());
	const count = createMemo(() => props.contribution ?? 0);
	const lvlClass = createMemo(() => styles[LEVELS[levelIndex(count())]]);
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
			tabIndex={0}
			aria-selected={isSelected() ? "true" : "false"}
			aria-describedby={isSelected() ? tipId : undefined}
			onClick={toggleSelect}
			onKeyDown={onKeyDown}
		>
			<Show when={isSelected()}>
				<Tooltip
					id={tipId}
					open
					title={`${count()} contribution${count() === 1 ? "" : "s"}`}
					dateTime={props.date.toISOString().slice(0, 10)}
					dateLabel={humanRuDateUTC(props.date)}
				/>
			</Show>
		</div>
	);
}
