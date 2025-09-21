import clsx from "clsx";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import type { JSX } from "solid-js";
import styles from "./contribution-square.module.css";
import type { ContributionLevel, ContributionSquareProps } from "~/models";
import { ContributionSquareTooltip } from "~/components";

const LEVELS = ["level0", "level1", "level2", "level3", "level4"] as const;

const contributionToLevel = (value: number): ContributionLevel => {
	if (value <= 0) return 0;
	const level = (((value - 1) / 10) | 0) + 1;
	return (level > 4 ? 4 : level) as ContributionLevel;
};

const buildDefaultTitle = (count: number) =>
	`${count} contribution${count === 1 ? "" : "s"}`;

export default function ContributionSquare(props: ContributionSquareProps) {
	const tipId = createUniqueId();
	const [localSelected, setLocalSelected] = createSignal(
		props.defaultSelected ?? false
	);

	const contribution = createMemo(() => props.contribution ?? 0);

	const resolvedLevel = createMemo<ContributionLevel>(
		() => props.lvl ?? contributionToLevel(contribution())
	);

	const levelClass = createMemo(() => styles[LEVELS[resolvedLevel()]]);

	const fallbackTitle = createMemo(() => buildDefaultTitle(contribution()));

	const tooltipTitle = createMemo<JSX.Element | string>(
		() => props.titleSlot ?? props.title ?? fallbackTitle()
	);

	const tooltipDescription = createMemo<JSX.Element | string | undefined>(
		() => props.descriptionSlot ?? props.description
	);

	const ariaLabel = createMemo(() => props.ariaLabel ?? fallbackTitle());

	const isSelected = createMemo(() => props.selected ?? localSelected());

	const setSelected = (nextSelected: boolean) => {
		if (props.selected === undefined) setLocalSelected(nextSelected);
		props.onSelectChange?.({ id: props.id, selected: nextSelected });
	};

	const toggleSelected = () => {
		setSelected(!isSelected());
	};

	const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (
		e
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			toggleSelected();
		}
	};

	return (
		<div
			class={clsx(styles.square, levelClass(), props.class)}
			role="gridcell"
			tabIndex={0}
			aria-label={ariaLabel()}
			aria-selected={isSelected() ? "true" : "false"}
			aria-describedby={isSelected() ? tipId : undefined}
			onClick={toggleSelected}
			onKeyDown={onKeyDown}
		>
			<ContributionSquareTooltip
				id={tipId}
				open={isSelected()}
				title={tooltipTitle()}
				description={tooltipDescription()}
				lvl={props.lvl}
				class={styles.tooltip}
			/>
		</div>
	);
}
