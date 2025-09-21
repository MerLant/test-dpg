import { createSignal, onCleanup, onMount, For } from "solid-js";
import { ContributionSquare } from "~/components";
import styles from "./contribution-tutorial.module.css";
import type { SelectChangePayload } from "~/models";

type LegendItem = { id: number; lvl: 0 | 1 | 2 | 3 | 4; title: string };

const LEGEND: LegendItem[] = [
	{ id: 0, lvl: 0, title: "No contribution" },
	{ id: 1, lvl: 1, title: "1-9 contribution" },
	{ id: 2, lvl: 2, title: "10-19 contribution" },
	{ id: 3, lvl: 3, title: "20-29 contribution" },
	{ id: 4, lvl: 4, title: "30+ contribution" },
];

export default function ContributionTutorial() {
	const [selectedTs, setSelectedTs] = createSignal<number | null>(null);
	let rootEl!: HTMLDivElement;

	const handleSelectChange = (payload: SelectChangePayload) => {
		const id =
			typeof payload.id === "number" ? payload.id : Number(payload.id);
		if (Number.isNaN(id)) return;
		if (payload.selected) setSelectedTs(id);
		else setSelectedTs((prev) => (prev === id ? null : prev));
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
		<div class={styles.wrapper} ref={(el) => (rootEl = el)}>
			Меньше
			<div
				class={styles.squares}
				aria-hidden="true"
				onMouseLeave={() => setSelectedTs(null)}
			>
				<For each={LEGEND}>
					{(item) => (
						<div
							onMouseEnter={() => setSelectedTs(item.id)}
							onFocus={() => setSelectedTs(item.id)}
						>
							<ContributionSquare
								id={item.id}
								title={item.title}
								lvl={item.lvl}
								selected={selectedTs() === item.id}
								onSelectChange={handleSelectChange}
							/>
						</div>
					)}
				</For>
			</div>
			Больше
		</div>
	);
}
