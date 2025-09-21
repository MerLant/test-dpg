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
