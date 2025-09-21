import clsx from "clsx";
import { createMemo } from "solid-js";
import { ContributionSquareProps } from "~/models";
import styles from "./contribution-square.module.css";

function levelFor(n: number): 0 | 1 | 2 | 3 | 4 {
	if (n <= 0) return 0;
	if (n <= 9) return 1;
	if (n <= 19) return 2;
	if (n <= 29) return 3;
	return 4;
}

export default function ContributionSquare(props: ContributionSquareProps) {
	const lvl = createMemo(() => levelFor(props.contribution ?? 0));

	const levelClass = createMemo(
		() =>
			[
				styles.level0,
				styles.level1,
				styles.level2,
				styles.level3,
				styles.level4,
			][lvl()]
	);

	return (
		<div
			class={clsx(styles.square, levelClass())}
			role="gridcell"
			data-level={lvl()}
		/>
	);
}
