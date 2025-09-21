import { ContributionSquare } from "../contribution-square";
import styles from "./contribution-graph.module.css";

export default function ContributionGraph() {
	return (
		<div class={styles.root}>
			<ContributionSquare
				contribution={0}
				date={new Date("2002-10-10")}
			/>
			<ContributionSquare
				contribution={1}
				date={new Date("2002-10-10")}
			/>
			<ContributionSquare
				contribution={10}
				date={new Date("2002-10-10")}
			/>
			<ContributionSquare
				contribution={20}
				date={new Date("2002-10-10")}
			/>
			<ContributionSquare
				contribution={30}
				date={new Date("2002-10-10")}
			/>
		</div>
	);
}
