import React, {useCallback, useState, useEffect} from 'react';
import {
    Card,
    Button,
    Stack,
    Layout,
    TextContainer,
    Heading
} from '@shopify/polaris';
import ShowMore from 'react-show-more';
import {render} from 'react-dom';


const Index = () => <IdeaContainer/>;

function ideaCreator() {
    const ideas = [];
    for (let i = 0; i < 20; i++) {
        ideas.push(
            {
                id: i,
                title: 'Let\'s test this component. Hello there! ' + JSON.stringify(i),
                content: () => {
                    let num = Math.floor(Math.random() * 10) + 5;
                    let accumulated = "";
                    for (let i = 0; i < num; i++) {
                        accumulated += "random text for test "
                    }
                    return accumulated;
                },
                author: "dincer",
                likeCount: (Math.floor(Math.random() * 10) + 3),
                childIdeaCount: (Math.floor(Math.random() * 10)),
                parentId: () => {
                    let num = Math.floor(Math.random() * 20);
                    if (num === i) {
                        num = null;
                    } else if (num < 5) {
                        num = null;
                    }
                    return num;
                }

            }
        )
    }
    return ideas;
}

class IdeaContainer extends React.Component {
    constructor(props) {
        super(props);

        this.ideas = ideaCreator();
        this.state = {
            cards: () => {
                let parentIdeas = this.ideas.filter(idea => {
                    return idea.parentId() === null;
                });
                console.log("hello");
                let parentIdea;
                let initialCards = [];
                for (parentIdea of parentIdeas) {
                    console.log(parentIdea.parentId());
                    let children = this.ideas.filter(idea => {
                        return idea.parentId() === parentIdea.id;
                    });
                    initialCards.push(<IdeaCardWithButton key={parentIdea.id} layer={0}
                                                          title={parentIdea.title} content={parentIdea.content()}
                                                          childCount={children.length} handleClick={this.updateCards()}/>
                    );
                }
                 return [...initialCards];
            }
        };
        this.updateCards = this.updateCards.bind(this);

    }
    updateCards (parentId) {
        let newCards = this.ideas.filter(idea => {
            return idea.parentId() === parentId;
        });

        this.setState({cards: this.state.cards.splice(parentId, 0, newCards)});
    };
    render(){
        return(
        <Layout>{this.state.cards}</Layout>
    )}
}

function IdeaCardWithButton(props) {
    const leftPercentage = JSON.stringify(props.layer * 2) + '%';

    return (
        <Layout.Section>
            <IdeaCard layer={leftPercentage} title={props.title} content={props.content}/>
            <IdeaCardButton key={props.key} layer={leftPercentage} childCount={props.childCount}
                            handleClick={props.handleClick}/>
        </Layout.Section>
    );
}

function IdeaCard(props) {

    const styles = {marginLeft: props.layer};

    return (

        <div style={styles}>
            <Card sectioned>
                <CollapsibleText title={props.title} content={props.content}/>
            </Card>
        </div>

    );
}

function IdeaCardButton(props) {
    const styles = {display: "flex", justifyContent: "center", marginLeft: props.layer};

    return (
        <div style={styles}>
            <Button size="slim" onClick={props.handleClick(props.key)}>{props.childCount} child ideas</Button>
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
