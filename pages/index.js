import React, { useState, useEffect, useCallback } from "react";
import {
	Card,
	Button,
	Layout,
	TextContainer,
	TextField,
	Form,
	FormLayout
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

function Index({ childIdeas, childCounts, likeCounts, userLikes }) {
	const isLoggedIn = false;
	const loggedInUserId = "";
	return (
		<IdeaContainer
			parentIdeas={childIdeas}
			childCounts={childCounts}
			likeCounts={likeCounts}
			userLikes={userLikes}
			isLoggedIn={isLoggedIn}
			loggedInUserId={loggedInUserId}
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
		this.addCard = this.addCard.bind(this);
		this.removeCard = this.removeCard.bind(this);
		this.parentIdeas = props.parentIdeas;
		this.childCounts = props.childCounts;
		this.userLikes = props.userLikes;
		this.isLoggedIn = props.isLoggedIn;
		this.loggedInUserId = props.loggedInUserId;
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
					heading={idea.heading}
					content={idea.content}
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

			let newCards = [];

			generation++;

			newIdeas.childIdeas.map(idea => {
				newCards.push(
					<IdeaWrapper
						key={idea.id}
						id={idea.id}
						generation={generation}
						heading={idea.title}
						content={idea.content}
						childCount={newIdeas.childCounts[idea.id]}
						likeCount={newIdeas.likeCounts[idea.id]}
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
			sketches,
			generation,
			childCount
		) => {
			const protocol = location.protocol;
			const host = location.host;
			const pageRequest = `${protocol}//${host}/api/ideas/addIdea?heading=${heading}&content=${content}&type=${type}&parentId=${parentId}$sketches=${sketches}`;
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
						heading={heading}
						content={content}
						childCount={0}
						likeCount={0}
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
					heading={props.heading}
					content={props.content}
					generation={props.generation}
					childCount={props.childCount}
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

function LeftMenu(props) {
	const urlLike =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/likenew1.png?v=1580691867";
	const urlLiked =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/likenew2.png?v=1580691867";

	return (
		<div
			style={{
				width: props.width,
				marginLeft: props.layer
			}}
		>
			<div className={"Like-Button-Div"}>
				{!props.isLiked ? (
					<LeftMenuLikeImg
						imageUrl={urlLike}
						handleLikeClick={props.handleLikeClick}
					/>
				) : (
					<LeftMenuLikeImg
						imageUrl={urlLiked}
						handleLikeClick={props.handleLikeClick}
					/>
				)}
			</div>
			<LeftMenuLikeCount likeCount={props.likeCount} />

			<style jsx>
				{`
					.Like-Button-Div:hover {
						background-color: grey;
					}
				`}
			</style>
		</div>
	);
}

function LeftMenuLikeImg(props) {
	return (
		<a href="#">
			<img
				src={props.imageUrl}
				alt="like image"
				onClick={props.handleLikeClick}
				style={{
					width: "80%",
					height: "auto",
					marginLeft: "auto",
					marginRight: "auto"
				}}
			></img>
		</a>
	);
}

function LeftMenuLikeCount(props) {
	return (
		<div>
			<p
				style={{
					width: "80%",
					height: "auto",
					marginLeft: "auto",
					marginRight: "auto"
				}}
			>
				{props.likeCount}
			</p>
		</div>
	);
}

function IdeaCard(props) {
	const [isContributing, setIsContributing] = useState(false);
	const handleContributeClick = useCallback(() => {
		setIsContributing(true);
	}, []);
	const handleContributeTextSubmit = (type, heading, content, sketches) => {
		setIsContributing(false);
		props.handleContributeTextSubmit(
			type,
			heading,
			content,
			props.id,
			sketches,
			props.generation,
			props.childCount
		);
	};
	return (
		<div style={{ width: "100%" }}>
			<Card sectioned>
				<CardCollapsibleText
					heading={props.heading}
					content={props.content}
				/>
				<CardFooterMenu handleContributeClick={handleContributeClick} />
				<CardContributePopup
					isActive={isContributing}
					handleContributeTextSubmit={handleContributeTextSubmit}
				/>
			</Card>
		</div>
	);
}

function CardCollapsibleText(props) {
	return (
		<div>
			<TextContainer spacing="tight">
				<ShowMore>{props.content}</ShowMore>
			</TextContainer>
		</div>
	);
}

function CardFooterMenu(props) {
	return (
		<div>
			<CardContributeButton
				handleContributeClick={props.handleContributeClick}
			/>
			<CardMoreOptionsButton />
		</div>
	);
}

function CardContributeButton(props) {
	return (
		<div>
			<Button plain outline="true" onClick={props.handleContributeClick}>
				Contribute
			</Button>
		</div>
	);
}

function CardMoreOptionsButton(props) {
	return <div></div>;
}

function CardContributePopup(props) {
	let cssDisplay = "";
	props.isActive ? (cssDisplay = "block") : (cssDisplay = "none");

	//start passing the needed vars
	return (
		<div style={{ display: cssDisplay }}>
			<Form
				onSubmit={props.handleContributeTextSubmit(
					heading,
					content,
					type,
					sketches
				)}
			>
				<FormLayout>
					<CardContributeType />
					<CardContributeHeading />
					<CardContributeContent />
					<CardContributeSketches />
					<Button submit>Save</Button>
				</FormLayout>
			</Form>
		</div>
	);
}

function CardContributeTextField(props) {
	const [value, setValue] = useState("");

	const handleChange = useCallback(newValue => setValue(newValue), []);

	return <TextField value={value} onChange={handleChange} multiline={3} />;
}

function ContributionsButton(props) {
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

export default Index;
