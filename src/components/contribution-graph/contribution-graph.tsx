import { For, createSignal, onMount, onCleanup, createMemo } from "solid-js";
import {
	createFetch,
	withAbort,
	withTimeout,
	withRetry,
	withCache,
	withCatchAll,
} from "@solid-primitives/fetch";
import { ContributionSquare } from "~/components";
import styles from "./contribution-graph.module.css";
import type { Cell } from "~/models";

const DAY = 86_400_000;
const WEEKS = 51;
const ROWS = 7;
const WEEKDAY_LABELS = ["Пн", "", "Ср", "", "Пт", "", ""];
const MONTH_LABELS: Record<number, string> = {
	0: "Янв.",
	1: "Февр.",
	2: "Март",
	3: "Апр.",
	4: "Май",
	5: "Июнь",
	6: "Июль",
	7: "Авг.",
	8: "Сент.",
	9: "Окт.",
	10: "Нояб.",
	11: "Дек.",
};
type MonthSegment = { label: string; start: number; span: number };
const CELLS = WEEKS * ROWS;

const toUtcMidnight = (d: Date) =>
	new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const startOfWeekMondayUTC = (dUTC: Date) => {
	const dow = dUTC.getUTCDay();
	const sinceMonday = (dow + 6) % 7;
	return new Date(dUTC.getTime() - sinceMonday * DAY);
};

export default function ContributionGraph() {
	const [selectedTs, setSelectedTs] = createSignal<number | null>(null);

	const fetchCache: Record<string, unknown> = {};

	const [contribs] = createFetch<Record<string, number>>(
		"https://dpg.gg/test/calendar.json",
		undefined,
		{ initialValue: {} as Record<string, number> },
		[
			withAbort(),
			withTimeout(8000),
			withRetry(2, (retry: number) => 500 * 2 ** (retry - 1)),
			withCache({ cache: fetchCache, expires: 1000 * 60 * 60 }),
			withCatchAll(),
		]
	);

	let rootEl!: HTMLDivElement;

	const items = createMemo<Cell[]>(() => {
		const todayUTC = toUtcMidnight(new Date());
		const thisWeekMon = startOfWeekMondayUTC(todayUTC);
		const startTs = thisWeekMon.getTime() - (WEEKS - 1) * ROWS * DAY;
		const data = contribs() || {};

		const out: Cell[] = new Array(CELLS);
		for (let i = 0; i < CELLS; i++) {
			const ts = startTs + i * DAY;
			const date = new Date(ts);
			const iso = date.toISOString().slice(0, 10);
			out[i] = { ts, date, contribution: data[iso] ?? 0 };
		}
		return out;
	});

	const monthSegments = createMemo<MonthSegment[]>(() => {
		const cells = items();
		if (!cells.length) return [];

		const segments: MonthSegment[] = [];
		let currentMonth = cells[0]?.date?.getUTCMonth() ?? -1;
		let currentStart = 0;

		const monthStartingInColumn = (columnIndex: number) => {
			for (let row = 0; row < ROWS; row++) {
				const cell = cells[columnIndex * ROWS + row];
				if (!cell) break;
				if (cell.date.getUTCDate() === 1) return cell.date.getUTCMonth();
			}
			return undefined;
		};

		for (let col = 1; col < WEEKS; col++) {
			const cell = cells[col * ROWS];
			if (!cell) break;
			const nextMonth = monthStartingInColumn(col);
			if (nextMonth !== undefined) {
				segments.push({
					label: MONTH_LABELS[currentMonth] ?? "",
					start: currentStart,
					span: Math.max(1, col - currentStart),
				});
				currentMonth = nextMonth;
				currentStart = col;
			}
		}

		if (currentMonth !== -1) {
			segments.push({
				label: MONTH_LABELS[currentMonth] ?? "",
				start: currentStart,
				span: Math.max(1, WEEKS - currentStart),
			});
		}

		if (!segments.length) {
			segments.push({
				label: MONTH_LABELS[currentMonth] ?? "",
				start: 0,
				span: WEEKS,
			});
		}

		return segments.filter((segment) => segment.label && segment.span > 0);
	});

	const handleSelect = (dt: Date) => {
		const ts = toUtcMidnight(dt).getTime();
		setSelectedTs((prev) => (prev === ts ? null : ts));
	};

	onMount(() => {
		const onDocPointerDown = (e: PointerEvent) => {
			if (!selectedTs()) return;
			const target = e.target as Node | null;
			if (target && !rootEl.contains(target)) setSelectedTs(null);
		};
		const onDocKeyDown = (e: KeyboardEvent) => {
			if (!e.defaultPrevented && e.key === "Escape" && selectedTs()) {
				setSelectedTs(null);
			}
		};

		document.addEventListener("pointerdown", onDocPointerDown, true);
		document.addEventListener("keydown", onDocKeyDown);
		onCleanup(() => {
			document.removeEventListener("pointerdown", onDocPointerDown, true);
			document.removeEventListener("keydown", onDocKeyDown);
		});
	});

	return (
		<div class={styles.wrapper}>
			<div class={styles.cornerSpacer} aria-hidden="true" />
			<div
				class={styles.monthRow}
				aria-hidden="true"
				style={{ "grid-template-columns": `repeat(${WEEKS}, minmax(0, 1fr))` }}
			>
				<For each={monthSegments()}>
					{(segment) => (
						<span
							class={styles.monthLabel}
							style={{ "grid-column": `${segment.start + 1} / span ${segment.span}` }}
						>
							{segment.label}
						</span>
					)}
				</For>
			</div>
			<div class={styles.weekdayColumn} aria-hidden="true">
				<For each={WEEKDAY_LABELS}>
					{(label) => (
						<span class={styles.weekdayLabel}>{label}</span>
					)}
				</For>
			</div>
			<div
				ref={rootEl}
				class={styles.root}
				role="grid"
				aria-rowcount={ROWS}
				aria-colcount={WEEKS}
				aria-label="График контрибуций за 51 неделю"
			>
				<For each={items()}>
					{(it) => (
						<ContributionSquare
							contribution={it.contribution}
							date={it.date}
							selected={selectedTs() === it.ts}
							onSelect={handleSelect}
						/>
					)}
				</For>
			</div>
		</div>
	);
}
