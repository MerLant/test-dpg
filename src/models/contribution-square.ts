export interface ContributionSquareProps {
	date: Date;
	contribution: number;
	selected?: boolean;
	onSelect?: (date: Date) => void;
}
