import { For, createSignal, onMount, onCleanup } from "solid-js";
import { ContributionSquare } from "../contribution-square";
import styles from "./contribution-graph.module.css";

export default function ContributionGraph() {
	const [selectedIso, setSelectedIso] = createSignal<string | null>(null);
	let rootEl: HTMLDivElement | undefined;

	const iso = (d: Date) => d.toISOString().slice(0, 10);
	const addDays = (d: Date, n: number) =>
		new Date(d.getTime() + n * 86400000);

	const base = new Date("2002-10-10T00:00:00Z");
	const items = [0, 1, 10, 20, 30].map((c, i) => ({
		contribution: c,
		date: addDays(base, i),
	}));

	const handleSelect = (dt: Date) => {
		const key = iso(dt);
		setSelectedIso((prev) => (prev === key ? null : key));
	};

	onMount(() => {
		const onDocPointerDown = (e: PointerEvent) => {
			if (!rootEl || !selectedIso()) return;
			const target = e.target as Node | null;
			if (target && !rootEl.contains(target)) setSelectedIso(null);
		};

		const onDocKeyDown = (e: KeyboardEvent) => {
			if (e.defaultPrevented) return;
			if (e.key === "Escape" && selectedIso()) {
				setSelectedIso(null);
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
		<div ref={rootEl} class={styles.root}>
			<For each={items}>
				{(it) => (
					<ContributionSquare
						contribution={it.contribution}
						date={it.date}
						selected={selectedIso() === iso(it.date)}
						onSelect={handleSelect}
					/>
				)}
			</For>
		</div>
	);
}
