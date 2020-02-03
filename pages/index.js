import React, { useState, useEffect } from "react";
import {
	Card,
	Button,
	Stack,
	Layout,
	TextContainer,
	Henading
} from "@shopify/polaris";
import ShowMore from "react-show-more";
import { render } from "react-dom";
import fetch from "isomorphic-unfetch";

Index.getInitialProps = async ({ req, query }) => {
	const protocol = req
		? `${req.headers["x-forwarded-proto"]}:`
		: location.protocol;
	const host = req ? req.headers["x-forwarded-host"] : location.host;
	const pageRequest = `${protocol}//${host}/api/ideas?parent=${null}`;
	const res = await fetch(pageRequest);
	const json = await res.json();
	return json;
};

function Index({ childIdeas, childCounts, likeCounts }) {
	const isLoggedIn = false;
	return (
		<IdeaContainer
			parentIdeas={childIdeas}
			childCounts={childCounts}
			likeCounts={likeCounts}
			isLoggedIn={isLoggedIn}
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

class IdeaContainer extends React.Component {
	constructor(props) {
		super(props);
		this.initializeCards = this.initializeCards.bind(this);
		this.updateCards = this.updateCards.bind(this);
		this.parentIdeas = props.parentIdeas;
		this.childCounts = props.childCounts;
		this.isLoggedIn = props.isLoggedIn;
		this.state = { cards: this.initializeCards() };
	}

	initializeCards = () => {
		let initialCards = [];

		this.parentIdeas.map(idea => {
			initialCards.push(
				<IdeaCardWithButton
					key={idea.id}
					id={idea.id}
					generation={0}
					title={idea.title}
					content={idea.content}
					childCount={this.childCounts[idea.id]}
					likeCount={this.likeCounts[idea.id]}
					isLoggedIn={this.isLoggedIn}
					onClick={this.updateCards}
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

			let newCards = [];

			generation += 1;

			newIdeas.childIdeas.map(idea => {
				newCards.push(
					<IdeaCardWithButton
						key={idea.id}
						id={idea.id}
						generation={generation}
						title={idea.title}
						content={idea.content}
						childCount={newIdeas.childCounts[idea.id]}
						likeCount={newIdeas.likeCounts[idea.id]}
						isLoggedIn={this.isLoggedIn}
						onClick={this.updateCards}
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

			console.log(cardArr);
			this.setState({ cards: cardArr });
		}
	};

	render() {
		return <Layout>{this.state.cards}</Layout>;
	}
}

function IdeaCardWithButton(props) {
	const firstLayer = (props.generation * 3).toString() + "em";
	const secondLayer = "3em";
	const [likeCount, setLikeCount] = useState(props.likeCount);

	const handleLikeClick = isLiked => {
		if (props.isLoggedIn) {
			if (!isLiked) setLikeCount(likeCount++);
			else setLikeCount(likeCount--);
		} else {
		}
	};

	return (
		<Layout.Section>
			<div style={{ display: "flex" }}>
				<IdeaCardMenu
					layer={firstLayer}
					width={secondLayer}
					handleLikeClick={handleLikeClick}
				/>
				<IdeaCard title={props.title} content={props.content} />
			</div>
			<IdeaCardButton
				id={props.id}
				generation={props.generation}
				layer={firstLayer}
				childCount={props.childCount}
				onClick={props.onClick}
			/>
		</Layout.Section>
	);
}
function IdeaCardMenu(props) {
	const likeUrlFirst =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/likenew1.png?v=1580691867";
	const likeUrlSecond =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/likenew2.png?v=1580691867";
	const likeUrlThird =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/likenew3.png?v=1580691867";
	const commentUrlFirst =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/commentnew1.png?v=1580691867";
	const commentUrlSecond =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/commentnew2.png?v=1580691867";

	const [isMouseInsideLike, setIsMouseInsideLike] = useState(false);
	const [isMouseInsideComment, setIsMouseInsideComment] = useState(false);

	const handleEnter = isLike => {
		isLike ? setIsMouseInsideLike(true) : setIsMouseInsideComment(true);
	};
	const handleLeave = isLike => {
		isLike ? setIsMouseInsideLike(false) : setIsMouseInsideComment(false);
	};

	const handleLoggedInClick = () => {};

	return (
		<div
			style={{
				width: props.width,
				marginLeft: props.layer
			}}
		>
			<div>
				{isMouseInsideLike ? (
					<IdeaCardMenuImg
						isLike={true}
						link={"#"}
						imageUrl={likeUrlSecond}
						handleEnter={handleEnter}
						handleLeave={handleLeave}
						marginBottom={10}
					/>
				) : (
					<IdeaCardMenuImg
						isLike={true}
						imageUrl={likeUrlFirst}
						handleEnter={handleEnter}
						handleLeave={handleLeave}
						marginBottom={10}
					/>
				)}
			</div>
			<div>
				{isMouseInsideComment ? (
					<IdeaCardMenuImg
						isLike={false}
						imageUrl={commentUrlSecond}
						handleEnter={handleEnter}
						handleLeave={handleLeave}
						marginBottom={0}
					/>
				) : (
					<IdeaCardMenuImg
						isLike={false}
						imageUrl={commentUrlFirst}
						handleEnter={handleEnter}
						handleLeave={handleLeave}
						marginBottom={0}
					/>
				)}
			</div>
		</div>
	);
}

function IdeaCardMenuImg(props) {
	return (
		<a href="#">
			<img
				src={props.imageUrl}
				alt="like image"
				onMouseEnter={() => {
					return props.handleEnter(props.isLike);
				}}
				onMouseLeave={() => {
					return props.handleLeave(props.isLike);
				}}
				style={{
					width: "80%",
					height: "auto",
					marginLeft: "auto",
					marginRight: "auto",
					marginBottom: props.marginBottom,
					display: "block"
				}}
			></img>
		</a>
	);
}

function IdeaCard(props) {
	//  const styles = { marginLeft: props.layer };

	return (
		<div style={{ width: "100%" }}>
			<Card
				sectioned
				title={props.title}
				actions={[{ content: "# sketches attached" }]}
			>
				<CollapsibleText content={props.content} />
			</Card>
		</div>
	);
}

function IdeaCardButton(props) {
	let cssDisplay = "";
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
					return props.onClick(
						props.id,
						props.childCount,
						props.generation
					);
				}}
			>
				{props.childCount} child idea{plural + " \u21B4"}
			</Button>
		</div>
	);
}

function CollapsibleText(props) {
	return (
		<TextContainer spacing="tight">
			<ShowMore>{props.content}</ShowMore>
		</TextContainer>
	);
}

export default Index;
