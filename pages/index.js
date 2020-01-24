import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Stack,
  Layout,
  TextContainer,
  Heading
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

function Index({ childIdeas, childCounts }) {
  return <IdeaContainer parentIdeas={childIdeas} childCounts={childCounts} />;
}

class IdeaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.initializeCards = this.initializeCards.bind(this);
    this.updateCards = this.updateCards.bind(this);
    this.parentIdeas = props.parentIdeas;
    this.childCounts = props.childCounts;
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
          layer={0}
          title={idea.title}
          content={idea.content}
          childCount={this.childCounts[idea.id]}
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
            layer={0}
            title={idea.title}
            content={idea.content}
            childCount={newIdeas.childCounts[idea.id]}
            onClick={this.updateCards}
          />
        );
      });

      newCards.sort((a, b) => b.props.likeCount - a.props.likeCount);

      const insertIndex =
        1 +
        this.state.cards.findIndex(element => element.props.id === parentId);

      let cardArr = this.state.cards;
      cardArr.splice(insertIndex, 0, ...newCards);

      this.setState({ cards: cardArr });
    }
  };

  render() {
    return <Layout>{this.state.cards}</Layout>;
  }
}

function IdeaCardWithButton(props) {
  const leftPercentage = JSON.stringify(props.generation * 2) + "%";

  return (
    <Layout.Section>
      <IdeaCard
        id={props.id}
        generation={props.generation}
        layer={leftPercentage}
        title={props.title}
        content={props.content}
      />
      <IdeaCardButton
        id={props.id}
        generation={props.generation}
        layer={leftPercentage}
        childCount={props.childCount}
        onClick={props.onClick}
      />
    </Layout.Section>
  );
}

function IdeaCard(props) {
  const styles = { marginLeft: props.layer };

  return (
    <div style={styles}>
      <Card sectioned>
        <CollapsibleText title={props.title} content={props.content} />
      </Card>
    </div>
  );
}

function IdeaCardButton(props) {
  let displayMode = "";
  if (props.childCount === 0) displayMode = "none";
  else displayMode = "flex";

  const [isVisible, setIsVisible] = useState(displayMode);

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
          return props.onClick(props.id, props.childCount, props.generation);
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
      <Heading>{props.title}</Heading>
      <ShowMore>{props.content}</ShowMore>
    </TextContainer>
  );
}

export default Index;
