import React, { useState, useEffect, useCallback } from "react";
import {
	Banner,
	Stack,
	Thumbnail,
	List,
	DropZone,
	Card,
	Button,
	Layout,
	TextContainer,
	TextField,
	Form,
	FormLayout,
	Badge,
	Caption,
	Modal as ImageUploadModal
} from "@shopify/polaris";
import ShowMore from "react-show-more";
import Carousel, { Modal as VisualRepsModal, ModalGateway } from "react-images";
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

function LeftMenu(props) {
	const likeUrl =
		"https://cdn.shopify.com/s/files/1/0326/3198/0163/files/likenew1.png?v=1580691867";
	const likedUrl =
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
					<LeftMenuLikeIcon
						src={likeUrl}
						handleLikeClick={props.handleLikeClick}
					/>
				) : (
					<LeftMenuLikeIcon
						src={likedUrl}
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

function LeftMenuLikeIcon(props) {
	return (
		<img
			src={props.src}
			alt="like image"
			onClick={props.handleLikeClick}
			style={{
				width: "80%",
				height: "auto",
				marginLeft: "auto",
				marginRight: "auto"
			}}
		></img>
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
	const handleContributeTextSubmit = (
		type,
		heading,
		content,
		visualRepUrls
	) => {
		setIsContributing(false);
		props.handleContributeTextSubmit(
			type,
			heading,
			content,
			props.id,
			visualRepUrls,
			props.generation,
			props.childCount
		);
	};
	return (
		<div style={{ width: "100%" }}>
			<Card sectioned>
				<CardHeader
					type={props.type}
					ownerUsername={props.ownerUsername}
					createdAt={props.createdAt}
					visualRepUrls={props.visualRepUrls}
				/>
				<CardCollapsibleText
					heading={props.heading}
					content={props.content}
				/>
				<CardFooter handleContributeClick={handleContributeClick} />

				<CardContributeForm
					isContributing={isContributing}
					handleContributeTextSubmit={handleContributeTextSubmit}
				/>
			</Card>
		</div>
	);
}

function CardHeader(props) {
	return (
		<div style={{ display: "flex" }}>
			<div style={{ width: "100%" }}>
				<IdeaType type={props.type} />
				<OwnerUsername ownerUsername={props.ownerUsername} />
				<TimeElapsed createdAt={props.createdAt} />
			</div>
			<div>
				<VisualRepCount visualRepCount={props.visualRepUrls.length} />
				<VisualRepsButton visualRepUrls={props.visualRepUrls} />
			</div>
		</div>
	);
}

function IdeaType(props) {
	let backgroundColor = "";

	switch (props.type) {
		case "Original Idea":
			backgroundColor = "";
			break;
		case "Suggestion":
			backgroundColor = "";
			break;
		case "Searching":
			backgroundColor = "";
			break;
		case "Comment":
			backgroundColor = "";
	}

	return (
		<div style={{ backgroundColor: "#73AD21", borderRadius: "4px" }}>
			<Caption>{props.type + " - "}</Caption>
		</div>
	);
}

function OwnerUsername(props) {
	return (
		<div>
			<Caption>{props.ownerUsername + " - "}</Caption>
		</div>
	);
}

function TimeElapsed(props) {
	const createdAt = new Date(
		Date.parse(props.createdAt.replace(/[-]/g, "/"))
	);
	const now = new Date(Date.now);

	const pluralize = timeDifference => {
		if (timeDifference > 0) return "s";
		else return "";
	};

	let timeDifference;
	const [timeDisplay, setTimeDisplay] = useState("");

	const handleTimelapse = useCallback(() => {
		if (createdAt.getUTCFullYear !== now.getUTCFullYear) {
			timeDifference = now.getUTCFullYear() - createdAt.getUTCFullYear();
			setTimeDisplay(
				timeDifference.toString() +
					" year" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCMonth !== now.getUTCMonth) {
			timeDifference = now.getUTCMonth() - createdAt.getUTCMonth();
			setTimeDisplay(
				timeDifference.toString() +
					" month" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCDay !== now.getUTCDay) {
			timeDifference = now.getUTCDay() - createdAt.getUTCDay();
			setTimeDisplay(
				timeDifference.toString() +
					" day" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCHours !== now.getUTCHours) {
			timeDifference = now.getUTCHours() - createdAt.getUTCHours();
			setTimeDisplay(
				timeDifference.toString() +
					" hour" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCMinutes !== now.getUTCMinutes) {
			timeDifference = now.getUTCMinutes() - createdAt.getUTCMinutes();
			setTimeDisplay(
				timeDifference.toString() +
					" minute" +
					pluralize(timeDifference) +
					" ago"
			);
		} else {
			setTimeDisplay("recently");
		}
	});

	useEffect(() => {
		const interval = setInterval(() => {
			handleTimelapse();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<Caption>{timeDisplay}</Caption>
		</div>
	);
}

function VisualRepCount(props) {
	let cssDisplay; //revise
	if (props.visualRepCount < 1) cssDisplay = "none";
	else cssDisplay = "block";

	return <div style={{ display: cssDisplay }}>{props.visualRepCount}</div>;
}

function VisualRepsButton(props) {
	const [active, setActive] = useState(false);
	const toggleModal = useCallback(active => setActive(!active), [active]);

	const visualRepsButtonSrc = "";
	return (
		<div>
			<div className="VisualReps-Button-Div">
				<img
					src={visualRepsButtonSrc}
					alt="visual representations button icon"
					onClick={toggleModal}
					style={{
						width: "80%",
						height: "auto",
						marginLeft: "auto",
						marginRight: "auto"
					}}
				/>
			</div>
			<VisualRepsOverlay
				active={active}
				visualRepUrls={props.visualRepUrls}
				toggleModal={toggleModal}
			/>
			<style jsx>
				{`
					.VisualReps-Button-Div:hover {
						background-color: grey;
					}
				`}
			</style>
		</div>
	);
}

function VisualRepsOverlay(props) {
	let srcObjArr = props.visualRepUrls.map(visualRepUrl => {
		return { src: visualRepUrl };
	});

	return (
		<ModalGateway>
			{props.active ? (
				<VisualRepsModal onClose={props.toggleModal}>
					<Carousel views={srcObjArr} />
				</VisualRepsModal>
			) : null}
		</ModalGateway>
	);
}

function CardCollapsibleText(props) {
	//seperate head and content on showmore
	return (
		<div>
			<TextContainer spacing="tight">
				<ShowMore>
					<strong>{props.heading}</strong> - {props.content}
				</ShowMore>
			</TextContainer>
		</div>
	);
}

function CardFooter(props) {
	return (
		<div>
			<ContributeButton
				handleContributeClick={props.handleContributeClick}
			/>
			<MoreOptionsButton />
		</div>
	);
}

function ContributeButton(props) {
	return (
		<div>
			<Button
				plain
				outline="true"
				isParent={false}
				onClick={props.handleContributeClick}
			>
				Contribute
			</Button>
		</div>
	);
}

function MoreOptionsButton(props) {
	return (
		<div>
			<p>more opts</p>
		</div>
	);
}

function CardContributeForm(props) {
	let cssDisplay = ""; //revise
	props.isContributing ? (cssDisplay = "block") : (cssDisplay = "none");

	return (
		<div style={{ display: cssDisplay }}>
			<Form
				onSubmit={_event =>
					props.handleContributeTextSubmit(
						heading, //revise
						content,
						type,
						visualRepUrls
					)
				}
			>
				<FormLayout>
					<ContributeType isParent={props.isParent} />
					<ContributeHeading />
					<ContributeContent />
					<ContributeVisualRepsButton />
					<Button submit>Save</Button>
				</FormLayout>
			</Form>
		</div>
	);
}

function ContributeType(props) {
	const [boxArr, setBoxArr] = useState([]);
	const [selected, setSelected] = useState("");

	const handleSelection = type => {
		setSelected(type);
	};

	return props.isParent
		? setBoxArr([
				//convert to stack?
				<TypeBox
					type={"Original Idea"}
					selected
					handleSelection={handleSelection}
				/>,
				<TypeBox
					type={"Searching"}
					selected
					handleSelection={handleSelection}
				/>,
				<TypeBox type={"Suggestion"} disabled />,
				<TypeBox type={"Comment"} disabled />
		  ])
		: setBoxArr([
				<TypeBox
					type={"Suggestion"}
					selected
					handleSelection={handleSelection}
				/>,
				<TypeBox
					type={"Comment"}
					selected
					handleSelection={handleSelection}
				/>,
				<TypeBox
					type={"Searching"}
					selected
					handleSelection={handleSelection}
				/>,
				<TypeBox type={"Original Idea"} disabled />
		  ]);
}

function TypeBox(props) {
	let explanation = "";
	let cssHoverBorder = "";
	let cssColor = "";
	switch (props.type) {
		case "Original Idea":
			explanation = "original idea explanation";
			cssHoverBorder = "1px solid blue";
			cssColor = "blue";
			break;
		case "Suggestion":
			explanation = "suggestion explanation";
			cssHoverBorder = "1px solid green";
			cssColor = "green";
			break;
		case "Comment":
			explanation = "comment explanation";
			cssHoverBorder = "1px solid purple";
			cssColor = "purple";
			break;
		case "Searching":
			explanation = "searching explanation";
			cssHoverBorder = "1px solid yellow";
			cssColor = "yellow";
	}

	let cssBorder = "";

	if (props.selected === props.type) {
		cssBorder = cssHoverBorder;
	} else cssBorder = "grey";

	return (
		<div>
			<div
				className="Type-Box-Div"
				style={{ width: "25%", border: cssBorder, color: cssColor }}
				onClick={props.handleSelection(props.type)}
			>
				<div>
					<p>{props.title}</p>
				</div>
				<div>
					<p>{explanation}</p>
				</div>
			</div>
			<style global jsx>
				.Type-Box-Div:hover
				{`
					border: ${cssHoverBorder};
				`}
			</style>
		</div>
	);
}
function ContributeHeading(props) {
	const [value, setValue] = useState("");

	const handleChange = useCallback(newValue => setValue(newValue), []);

	return <TextField value={value} onChange={handleChange} />; //add label
}

function ContributeContent(props) {
	const [value, setValue] = useState("");

	const handleChange = useCallback(newValue => setValue(newValue), []);

	return <TextField value={value} onChange={handleChange} multiline={3} />; //add label
}
function ContributeVisualRepsButton(props) {
	const [active, setActive] = useState(false);
	const toggleActive = useCallback(active => {
		setActive(!active);
	}, []);
	return (
		<div>
			<Button onClick={toggleActive}>Upload Visuals</Button>
			<DropZoneModal active={active} toggleActive={toggleActive} />
		</div>
	);
}
function DropZoneModal(props) {
	//continue for api call to upload (to assets?)
	const [files, setFiles] = useState([]);
	const [rejectedFiles, setRejectedFiles] = useState([]);
	const hasError = rejectedFiles.length > 0;

	const handleDrop = useCallback(
		(_droppedFiles, acceptedFiles, rejectedFiles) => {
			setFiles(files => [...files, ...acceptedFiles]);
			setRejectedFiles(rejectedFiles);
		},
		[]
	);

	const fileUpload = !files.length && <DropZone.FileUpload />;
	const uploadedFiles = files.length > 0 && (
		<Stack vertical>
			{files.map((file, index) => (
				<Stack alignment="center" key={index}>
					<Thumbnail
						size="small"
						alt={file.name}
						source={window.URL.createObjectURL(file)}
					/>
					<div>
						{file.name} <Caption>{file.size} bytes</Caption>
					</div>
				</Stack>
			))}
		</Stack>
	);

	const errorMessage = hasError && (
		<Banner
			title="The following images couldn’t be uploaded:"
			status="critical"
		>
			<List type="bullet">
				{rejectedFiles.map((file, index) => (
					<List.Item key={index}>
						{`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
					</List.Item>
				))}
			</List>
		</Banner>
	);

	return (
		<ImageUploadModal
			large
			open={props.active}
			onClose={props.toggleActive}
		>
			<ImageUploadModal.Section>
				<Stack vertical>
					{errorMessage}
					<DropZone accept="image/*" type="image" onDrop={handleDrop}>
						{uploadedFiles}
						{fileUpload}
					</DropZone>
				</Stack>
			</ImageUploadModal.Section>
		</ImageUploadModal>
	);
}

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

export default Index;
