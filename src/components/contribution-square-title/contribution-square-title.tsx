import { ContributionSquareTitleProps } from "~/models";

export default function ContributionSquareTitle(
	props: ContributionSquareTitleProps
) {
	return <span class={props.class}>{props.children}</span>;
}
