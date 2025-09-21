import { For, createSignal, onMount, onCleanup, createMemo } from "solid-js";
import { ContributionSquare } from "../contribution-square";
import styles from "./contribution-graph.module.css";
import { Cell } from "~/models";

const DAY = 86_400_000;
const WEEKS = 51;
const ROWS = 7;

const toUtcMidnight = (d: Date) =>
	new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const startOfWeekMondayUTC = (dUTC: Date) => {
	const dow = dUTC.getUTCDay();
	const sinceMonday = (dow + 6) % 7;
	return new Date(dUTC.getTime() - sinceMonday * DAY);
};

export default function ContributionGraph() {
	const [selectedTs, setSelectedTs] = createSignal<number | null>(null);
	let rootEl!: HTMLDivElement;

	const items = createMemo<Cell[]>(() => {
		const todayUTC = toUtcMidnight(new Date());
		const thisWeekMon = startOfWeekMondayUTC(todayUTC);
		const startTs = thisWeekMon.getTime() - (WEEKS - 1) * ROWS * DAY;

		const out: Cell[] = new Array(WEEKS * ROWS);
		for (let i = 0; i < out.length; i++) {
			const ts = startTs + i * DAY;
			out[i] = { ts, date: new Date(ts), contribution: 0 };
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
		<div
			ref={rootEl}
			class={styles.root}
			role="grid"
			aria-rowcount={ROWS}
			aria-colcount={WEEKS}
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
	);
}
