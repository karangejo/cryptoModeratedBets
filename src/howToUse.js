import React, { Component } from 'react';
import{Card} from 'semantic-ui-react';

let text;

class HowToUse extends Component {
  componentDidMount(){
    text = ["This is an Application for creating moderated bets using ethereum cryptocurrency."
                + " It is deployed on Rinkeyby test network."
                + " All the current bets are displayed on the previous Tab."
                + " To make a bet scroll below and enter a clear bet statement and the amount you want to bet in wei."
                + " You then must deposit the bet amount to be held by the smart contract"
                + " after that just wait till someone accepts your bet."
                + " Once a bet has been accepted then a moderator must be choosen."
                + " The moderator must be approved by both bettors."
                + " If one of the betttors disapproves of the moderator then a new one will have to apply and be sucessfully choosen."
                + " Once a moderator has been accepted by both parties the said moderator should observe the outcome of the bet statement."
                + " Once the outcome is clear the moderator can then declare a winner and send thet balance of the contract to the winning address"]

  }

  render(){
    return(
      <Card fluid={true}>
          <Card.Content>
            <Card.Description>{text}</Card.Description>
          </Card.Content>
      </Card>
    );
  }
}

export default HowToUse;
