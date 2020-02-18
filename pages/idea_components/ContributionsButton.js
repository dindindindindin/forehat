import React, { useState } from "react";
import { Button } from "@shopify/polaris";

function ContributionsButton(props) {
	let cssDisplay = ""; //revise
	if (props.childCount === 0) cssDisplay = "none";
	else cssDisplay = "flex";

	const [isVisible, setIsVisible] = useState(cssDisplay);

	const styles = {
		justifyContent: "center",
		marginLeft: props.layer,
		display: isVisible
	};
	let plural = "s";
	if (props.childCount === 1) plural = "";

	return (
		<div style={styles}>
			<Button
				plain
				outline="true"
				onClick={() => {
					setIsVisible("none");
					return props.handleContributionsClick(
						props.id,
						props.childCount,
						props.generation
					);
				}}
			>
				{props.childCount} contribution{plural + " \u21B4"}
			</Button>
		</div>
	);
}
