import React, { useState, useEffect, useCallback } from "react";
import {
	Banner,
	Stack,
	Thumbnail,
	List,
	DropZone,
	Card,
	Button,
	TextContainer,
	TextField,
	Form,
	FormLayout,
	Caption,
	Modal as ImageUploadModal
} from "@shopify/polaris";
import ShowMore from "react-show-more";
import Carousel, { Modal as VisualRepsModal, ModalGateway } from "react-images";

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
	let cssBackgroundColor = "";
	let cssColor = "";

	switch (props.type) {
		case "Original Idea":
			cssBackgroundColor = "#FEAD9A";
			cssColor = "#583C35";
			break;
		case "Suggestion":
			cssBackgroundColor = "#BBE5B3";
			cssColor = "#414F3E";
			break;
		case "Searching":
			cssBackgroundColor = "#FFEA8A";
			cssColor = "#595130";
			break;
		case "Comment":
			cssBackgroundColor = "#DFE3E8";
	}

	return (
		<div
			style={{
				backgroundColor: cssBackgroundColor,
				color: cssColor,
				borderRadius: "4px"
			}}
		>
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
		if (createdAt.getUTCFullYear() !== now.getUTCFullYear()) {
			timeDifference = now.getUTCFullYear() - createdAt.getUTCFullYear();
			setTimeDisplay(
				timeDifference.toString() +
					" year" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCMonth() !== now.getUTCMonth()) {
			timeDifference = now.getUTCMonth() - createdAt.getUTCMonth();
			setTimeDisplay(
				timeDifference.toString() +
					" month" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCDay() !== now.getUTCDay()) {
			timeDifference = now.getUTCDay() - createdAt.getUTCDay();
			setTimeDisplay(
				timeDifference.toString() +
					" day" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCHours() !== now.getUTCHours()) {
			timeDifference = now.getUTCHours() - createdAt.getUTCHours();
			setTimeDisplay(
				timeDifference.toString() +
					" hour" +
					pluralize(timeDifference) +
					" ago"
			);
		} else if (createdAt.getUTCMinutes() !== now.getUTCMinutes()) {
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
	let boxArr = [];
	props.isParent
		? (boxArr = [
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
		: (boxArr = [
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

	const [selected, setSelected] = useState("");

	const handleSelection = type => {
		setSelected(type);
	};

	return <Stack distribution="equalSpacing">{boxArr}</Stack>;
}

function TypeBox(props) {
	let explanation = "";
	let cssBorder = "";
	let cssBackgroundColorHover = "";
	let cssColor = "";

	switch (props.type) {
		case "Original Idea":
			explanation = "original idea explanation";
			if (props.disabled) {
				cssBorder = "1px solid black";
			} else {
				cssBorder = "1px solid #DE3618";
				cssBackgroundColorHover = "#FEAD9A";
			}
			cssColor = "#583C35";
			break;
		case "Suggestion":
			explanation = "suggestion explanation";
			if (props.disabled) {
				cssBorder = "1px solid black";
			} else {
				cssBorder = "1px solid #50B83C";
				cssBackgroundColorHover = "#BBE5B3";
			}
			cssColor = "#414F3E";
			break;
		case "Comment":
			explanation = "comment explanation";
			if (props.disabled) {
				cssBorder = "1px solid black";
			} else {
				cssBorder = "1px solid #C4CDD5";
				cssBackgroundColorHover = "#DFE3E8";
			}
			break;
		case "Searching":
			explanation = "searching explanation";
			if (props.disabled) {
				cssBorder = "1px solid black";
			} else {
				cssBorder = "1px solid #EEC200";
				cssBackgroundColorHover = "#FFEA8A";
			}
			cssColor = "#595130";
	} //change the algo

	let cssBackgroundColor = "";
	if (props.selected === props.type) {
		cssBackgroundColor = cssBackgroundColorHover;
	}

	return (
		<div>
			<div
				className="Type-Box-Div"
				style={{
					width: "24%",
					border: cssBorder,
					color: cssColor,
					backgroundColor: cssBackgroundColor
				}}
				onClick={props.handleSelection(props.type)}
			>
				<div>
					<p>{props.type}</p>
				</div>
				<div>
					<p>{explanation}</p>
				</div>
			</div>
			<style jsx>
				.Type-Box-Div:hover
				{`
					backgroundcolor: ${cssBackgroundColorHover};
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
