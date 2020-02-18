import React, { useState, useCallback } from "react";
import { Layout } from "@shopify/polaris";
import { render } from "react-dom";
import fetch from "isomorphic-unfetch";

import LeftMenu from "./LeftMenu";
import IdeaCard from "./IdeaCard";
import ContributionsButton from "./ContributionsButton";

class IdeaContainer extends React.Component {
	constructor(props) {
		super(props);
		this.initializeCards = this.initializeCards.bind(this);
		this.updateCards = this.updateCards.bind(this);
		this.addCard = this.addCard.bind(this);
		this.removeCard = this.removeCard.bind(this);
		this.parentIdeas = props.parentIdeas;
		this.childCounts = props.childCounts;
		this.userLikes = props.userLikes;
		this.ownerUsernames = props.ownerUsernames;
		this.isLoggedIn = props.isLoggedIn;
		this.loggedInUserId = props.loggedInUserId;
		this.loggedInUsername = props.loggedInUsername;
		this.state = { cards: this.initializeCards() };
	}

	initializeCards = () => {
		let initialCards = [];

		this.parentIdeas.map(idea => {
			initialCards.push(
				<IdeaWrapper
					key={idea.id}
					id={idea.id}
					generation={0}
					type={idea.idea_types.type} //check the structure
					heading={idea.heading}
					content={idea.content}
					ownerId={idea.users.id} //check the structure
					ownerUsername={this.ownerUsernames[idea.id]}
					createdAt={idea.ideas.created_at}
					visualRepUrls={idea.visualRepUrls} //revise
					childCount={this.childCounts[idea.id]}
					likeCount={this.likeCounts[idea.id]}
					isLoggedIn={this.isLoggedIn}
					isLiked={this.userLikes[idea.id]}
					loggedInUserId={this.loggedInUserId}
					handleContributeTextSubmit={this.addCard}
					handleContributionsClick={this.updateCards}
				/>
			);
		});

		initialCards.sort((a, b) => b.props.likeCount - a.props.likeCount);
		return initialCards;
	};

	updateCards = async (parentId, childCount, generation) => {
		if (childCount > 0) {
			const protocol = location.protocol;
			const host = location.host;
			const pageRequest = `${protocol}//${host}/api/ideas?parent=${parentId}`;
			const res = await fetch(pageRequest);
			const newIdeas = await res.json();

			//make graphql call for customer username for each idea

			let newCards = [];

			generation++;

			newIdeas.childIdeas.map((idea, index) => {
				newCards.push(
					<IdeaWrapper
						key={idea.id}
						id={idea.id}
						generation={generation}
						type={idea.idea_types.type} //check the structure
						heading={idea.title}
						content={idea.content}
						childCount={newIdeas.childCounts[idea.id]}
						likeCount={newIdeas.likeCounts[idea.id]}
						ownerId={idea.users.id} //check the structure
						ownerUsername={this.ownerUsernames[idea.id]}
						createdAt={idea.ideas.created_at}
						visualRepUrls={idea.visualRepUrls} //revise
						isLoggedIn={this.isLoggedIn}
						isLiked={this.userLikes[idea.id]}
						loggedInUserId={this.loggedInUserId}
						handleContributeTextSubmit={this.addCard}
						handleContributionsClick={this.updateCards}
					/>
				);
			});

			newCards.sort((a, b) => b.props.likeCount - a.props.likeCount);

			const insertIndex =
				1 +
				this.state.cards.findIndex(
					element => element.props.id === parentId
				);

			let cardArr = this.state.cards;
			cardArr.splice(insertIndex, 0, ...newCards);

			this.setState({ cards: cardArr });
		}

		addCard = async (
			type,
			heading,
			content,
			parentId,
			visualRepUrls,
			generation,
			childCount
		) => {
			const protocol = location.protocol;
			const host = location.host;
			const pageRequest = `${protocol}//${host}/api/ideas/addIdea?heading=${heading}&content=${content}&type=${type}&parentId=${parentId}$visualRepUrls=${visualRepUrls}`;
			const res = await fetch(pageRequest);
			const ideaJson = await res.json();

			console.log(ideaJson);
			generation++;

			const newCard = () => {
				return (
					<IdeaWrapper
						key={ideaJson.id}
						id={ideaJson.id}
						generation={generation}
						type={type}
						heading={heading}
						content={content}
						childCount={0}
						likeCount={0}
						ownerId={this.loggedInUserId}
						ownerUsername={this.loggedInUsername}
						createdAt={ideaJson.created_at}
						visualRepUrls={visualRepUrls}
						isLoggedIn={this.isLoggedIn}
						isLiked={false}
						loggedInUserId={this.loggedInUserId}
						handleContributeTextSubmit={this.addCard}
						handleContributionsClick={this.updateCards}
					/>
				);
			};

			const insertIndex =
				1 +
				childCount +
				this.state.cards.findIndex(
					element => element.props.id === parentId
				);

			let cardArr = this.state.cards;
			cardArr.splice(insertIndex, 0, newCard);

			this.setState({ cards: cardArr });
		};
		removeCard = async _event => {};
	};

	render() {
		return <Layout>{this.state.cards}</Layout>;
	}
}

function IdeaWrapper(props) {
	const firstLayer = (props.generation * 3).toString() + "em";
	const secondLayer = "3em";

	const [likeCount, setLikeCount] = useState(props.likeCount);
	const [isLiked, setIsLiked] = useState(() => {
		if (props.isLiked === true) {
			return true;
		} else return false;
	});

	const handleLikeClick = useCallback(async () => {
		if (props.isLoggedIn) {
			if (!isLiked) {
				const protocol = location.protocol;
				const host = location.host;
				const pageRequest = `${protocol}//${host}/api/ideas/addLike?idea=${props.id}&user=${props.loggedInUserId}`;
				await fetch(pageRequest);
				setLikeCount(likeCount++);
				setIsLiked(true);
			} else {
				const protocol = location.protocol;
				const host = location.host;
				const pageRequest = `${protocol}//${host}/api/ideas/removeLike?idea=${props.id}&user=${props.loggedInUserId}`;
				await fetch(pageRequest);
				setLikeCount(likeCount--);
				setIsLiked(false);
			}
		} else {
			//login window opens
		}
	}, []);

	return (
		<Layout.Section>
			<div style={{ display: "flex" }}>
				<LeftMenu
					layer={firstLayer}
					width={secondLayer}
					isLiked={props.isLiked}
					handleLikeClick={handleLikeClick}
					likeCount={likeCount}
				/>

				<IdeaCard
					id={props.id}
					type={props.type}
					heading={props.heading}
					content={props.content}
					generation={props.generation}
					childCount={props.childCount}
					visualRepUrls={props.visualRepUrls}
					ownerUsername={props.ownerUsername}
					loggedInUsername={props.loggedInUsername}
					handleContributeTextSubmit={
						props.handleContributeTextSubmit
					}
				/>
			</div>
			<ContributionsButton
				id={props.id}
				generation={props.generation}
				layer={firstLayer}
				childCount={props.childCount}
				handleContributionsClick={props.handleContributionsClick}
			/>
		</Layout.Section>
	);
}

export default IdeaContainer;
