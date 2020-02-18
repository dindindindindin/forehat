import React from "react";

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

export default LeftMenu;
