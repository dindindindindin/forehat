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


function IdeaContainer(props) {
    const [cards, setCards] = useState([]);

    let tempCards = [];
    for (let i = 0; i < 3; i++) {
        tempCards.push(<IdeaCardWithButton key={'card' + JSON.stringify(i)} layer={i}/>);
    }

    function fillCards(){
        setCards([...cards, ...tempCards])
    }

    return <Layout>{tempCards}</Layout>;
}

function IdeaCardWithButton(props) {
    return (
        <Layout.Section>
            <IdeaCard {...props} />
            <IdeaCardButton/>
        </Layout.Section>
    );
}

function IdeaCard(props) {
    const leftPercentage = JSON.stringify(props.layer * 2) + '%';

    const styles = {marginLeft: leftPercentage};

    return (

        <div style={styles}>
            <Card sectioned>
                <CollapsibleText/>
            </Card>
        </div>

    );
}

function IdeaCardButton(props) {
    const styles = {display: "flex", justifyContent: "center"};

    return (
        <div style={styles}>
            <Button size="slim">3 child ideas</Button>
        </div>
    );
}

function CollapsibleText(props) {
    return (
        <TextContainer spacing="tight">
            <Heading>{exampleText.heading}</Heading>
            <ShowMore>{exampleText.context(100)}</ShowMore>
        </TextContainer>
    );
}

const exampleText = {
    heading: 'Let\'s test this component. Hello there!',
    context: (num) => {
        let accumulated = "";
        for (let i = 0; i < num; i++) {
            accumulated += "random text for test "
        }
        return accumulated;
    }
};

export default Index;
