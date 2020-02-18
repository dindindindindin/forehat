import React from "react";
import fetch from "isomorphic-unfetch";
import IdeaContainer from "./idea_components";

Index.getInitialProps = async ({ req, query }) => {
	const protocol = req
		? `${req.headers["x-forwarded-proto"]}:`
		: location.protocol;
	const host = req ? req.headers["x-forwarded-host"] : location.host;
	const pageRequest = `${protocol}//${host}/api/ideas?parent=${null}`;
	const res = await fetch(pageRequest);
	const json = await res.json();

	//const isLoggedIn
	//const loggedInUserId
	//const loggedInUsername

	//make graphql call for customer username for each idea and return with json
	// const ownerUsernames
	return json;
};

function Index({ childIdeas, childCounts, likeCounts, userLikes }) {
	const isLoggedIn = false;
	const loggedInUserId = "";
	const loggedInUsername = "";
	const ownerUsernames = {};

	return (
		<IdeaContainer
			parentIdeas={childIdeas}
			childCounts={childCounts}
			likeCounts={likeCounts}
			userLikes={userLikes}
			ownerUsernames={ownerUsernames}
			isLoggedIn={isLoggedIn}
			loggedInUserId={loggedInUserId}
			loggedInUsername={loggedInUsername}
		>
			<style global jsx>
				{`
					.Polaris-Card__Section {
						padding-top: 7px;
					}
				`}
			</style>
		</IdeaContainer>
	);
}

export default Index;
