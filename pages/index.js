import React, { useCallback, useState } from 'react';
import {
  Card,
  Button,
  Stack,
  Layout,
  TextContainer,
  Heading
} from '@shopify/polaris';
import ShowMore from 'react-show-more';
import { render } from 'react-dom';

const Index = () => <IdeaContainer />;

function IdeaContainer(props) {
  const cards = [];

  for (let i = 0; i < 3; i++) {
    cards.push(
      <IdeaCard key={'card' + JSON.stringify(i)} layer={i} />
    );
  }

  return <Layout>{cards}</Layout>;
}

function IdeaCard(props) {
  const leftPercentage = JSON.stringify(props.layer * 3.33) + '%';

  return (
    <Layout.Section>
      <div className="cardWrap">
        <Card sectioned>
          <CollapsibleText />
        </Card>
      </div>
      <style jsx>{`
				.cardWrap {
					marginleft: ${leftPercentage};
				}
			`}</style>
    </Layout.Section>
  );
}

function CollapsibleText(props) {
  return (
    <TextContainer spacing="tight">
      <Heading>{exampleText.heading}</Heading>
      <ShowMore>{exampleText.text}</ShowMore>
    </TextContainer>
  );
}

const exampleText = {
  heading: 'This is my first react component. Hello there!',
  text:
    "Let's see how this goes. I am trying my first component at the moment, and I hope my progress will be quick for a while acquiring professional responsive design skills. Currently I am intoxicated and these do NOT have to make sense at all. Let's proceed quickly for a custom filled text area.hooraay! We are almost there.We got this.We almost got this.Trust me.We got it. We ain't got it dawg. There goes the second paragraph. Tho we are on our way with our iron will. We will indeed complete this task. OK. I accept it will not be very easy. But what is easy anyway? Let's do what we can and use our time to its maximum.Do NOT stop typing! If you do, that means you just lost part of the most important thing in your life.I do NOT even have to say it, you know what it is.That was a very extra explanation instead of just saying 'time', but that is indeed what we need, ain it ?st component at the moment, and I hope my progress will be quick for a while acquiring professional responsive design skills. Currently I am intoxicated and these do NOT have to make sense at all. Let's proceed quickly for a custom filled text area.hooraay! We are almost there.We got this.We almost got this.Trust me.We got it. We ain't got it dawg. There goes the second paragraph. Tho we are on our way with our iron will. We will indeed complete this task. OK. I accept it will not be very easy. But what is easy anyway? Let's do what we can and use our time to its maximum.Do NOT stop typing! If you do, that means you just lost part of the most important thing in your life.I do NOT even have to say it, you know what it is.That was a very extra explanation instead of just saying 'time', but that is indeed what we need, ain it ?st component at the moment, and I hope my progress will be quick for a while acquiring professional responsive design skills. Currently I am intoxicated and these do NOT have to make sense at all. Let's proceed quickly for a custom filled text area.hooraay! We are almost there.We got this.We almost got this.Trust me.We got it. We ain't got it dawg. There goes the second paragraph. Tho we are on our way with our iron will. We will indeed complete this task. OK. I accept it will not be very easy. But what is easy anyway? Let's do what we can and use our time to its maximum.Do NOT stop typing! If you do, that means you just lost part of the most important thing in your life.I do NOT even have to say it, you know what it is.That was a very extra explanation instead of just saying 'time', but that is indeed what we need, ain it ?"
};

export default Index;
