import { Title } from "@solidjs/meta";
import { ContributionGraph, ContributionTutorial } from "~/components";

export default function Home() {
	return (
		<main>
			<Title>Hello World</Title>
			<h1>Hello world!</h1>
			<ContributionGraph />
			<ContributionTutorial />
		</main>
	);
}
