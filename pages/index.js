import React, { useCallback, useState, useEffect } from "react";
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
import Link from "next/link";

const Index = ({ ideas, childCount }) => (
  <IdeaContainer parentIdeas={{ ideas }} childCount={{ childCount }} />
);

Index.getInitialProps = async ({ req, query }) => {
  const protocol = req
    ? '${req.headers["x-forwarded-proto"]}:'
    : location.protocol;
  const host = req ? req.headers["x-forwarded-host"] : location.host;
  const pageRequest =
    "${protocol}//${host}/api/ideas?parent=${query.parentId || null}";
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};

class IdeaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.updateCards = this.updateCards.bind(this);
    this.initializeCards = this.initializeCards.bind(this);
    this.parentIdeas = props.ideas;
    this.childCounts = props.childCounts;
    this.state = { cards: this.initializeCards() };
  }

  initializeCards = () => {
    let initialCards = {};

    this.parentIdeas.map(idea => {
      initialCards["ideaId"] = (
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
    });

    return initialCards;
  };

  updateCards(parentId) {
    /*  let newCards = this.dummyData.filter(idea => {
    return idea.parentId() === parentId;
  });

  this.setState({ cards: this.state.cards.splice(parentId, 0, newCards) });
*/

    const newCards = async ({ req, query }) => {
      const protocol = req
        ? '${req.headers["x-forwarded-proto"]}:'
        : location.protocol;
      const host = req ? req.headers["x-forwarded-host"] : location.host;
      const pageRequest = `${protocol}//${host}/api/ideas?parent=${parentId ||
        null}`;
      const res = await fetch(pageRequest);
      const json = await res.json();
      return json;
    };
  }

  render() {
    return <Layout>{this.state.cards}</Layout>;
  }
}

function IdeaCardWithButton(props) {
  const leftPercentage = JSON.stringify(props.layer * 2) + "%";

  return (
    <Layout.Section>
      <IdeaCard
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
