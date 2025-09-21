import { ContributionSquareDescriptionProps } from "~/models";

export default function ContributionSquareDescription(
	props: ContributionSquareDescriptionProps
) {
	return <span class={props.class}>{props.children}</span>;
}
