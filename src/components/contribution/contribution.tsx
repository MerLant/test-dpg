import { ContributionGraph, ContributionTutorial } from "~/components";
import styles from "./contribution.module.css";

export default function Contribution() {
	return (
		<div class={styles.wrapper}>
			<ContributionGraph />
			<div class={styles.tutorial}>
				<ContributionTutorial />
			</div>
		</div>
	);
}
