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
  console.log(json);
  return json;
};

function Index({ ideas, childCount }) {
  return <IdeaContainer parentIdeas={ideas} childCount={childCount} />;
}

class IdeaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.updateCards = this.updateCards.bind(this);
    this.initializeCards = this.initializeCards.bind(this);
    this.parentIdeas = this.props.parentIdeas;
    this.childCounts = this.props.childCount;
    this.state = { cards: this.initializeCards() };
  }

  initializeCards = () => {
    console.log(this.parentIdeas);
    let initialCards = [];
    let idea;
    for (idea in this.parentIdeas) {
      initialCards.push(
        <IdeaCardWithButton
          key={idea.id}
          id={idea.id}
          layer={0}
          title={idea.title}
          content={idea.content}
          childCount={this.childCounts[idea.id]}
          onClick={this.updateCards}
        />
      );
    }

    //    initialCards.sort((a, b) => b.likeCount - a.likeCount);
    return initialCards;
  };

  updateCards = parentId => {
    const newIdeas = async ({ req, query }) => {
      const protocol = req
        ? `${req.headers["x-forwarded-proto"]}:`
        : location.protocol;
      const host = req ? req.headers["x-forwarded-host"] : location.host;
      const pageRequest = `${protocol}//${host}/api/ideas?parent=${parentId}`;
      const res = await fetch(pageRequest);
      const json = await res.json();
      return json;
    };

    const newCards = [];
    let idea;
    for (idea in newIdeas.ideas) {
      newCards.push({
        id: idea.id,
        obj: (
          <IdeaCardWithButton
            key={idea.id}
            id={idea.id}
            layer={0}
            title={idea.title}
            content={idea.content}
            childCount={newIdeas.childCounts[idea.id]}
            onClick={this.updateCards}
          />
        ),
        likeCount: idea.like_count
      });
    }

    newCards.sort((a, b) => b.likeCount - a.likeCount);

    const insertIndex = this.state.cards.find(
      element => element.id === parentId
    );

    const updatedCards = this.state.cards.splice(insertIndex, 0, newCards);
    this.setState({ cards: updatedCards });
  };

  render() {
    return <Layout>{this.state.cards}</Layout>;
  }
}

function IdeaCardWithButton(props) {
  const leftPercentage = JSON.stringify(props.layer * 2) + "%";

  return (
    <Layout.Section>
      <IdeaCard
        id={props.id}
        layer={leftPercentage}
        title={props.title}
        content={props.content}
      />
      <IdeaCardButton
        id={props.id}
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
  const styles = {
    display: "flex",
    justifyContent: "center",
    marginLeft: props.layer
  };

  return (
    <div style={styles}>
      <Button
        size="slim"
        onClick={e => {
          console.log(props.id);
          return props.onClick(e, props.id);
        }}
      >
        {props.childCount} child ideas
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
