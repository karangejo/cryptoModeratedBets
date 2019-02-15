import React, { Component } from 'react';
import factory from './factory';
import{Card,Grid,Segment,Menu,Dropdown} from 'semantic-ui-react';
import NewBet from './newBet';
import ManageBet from './manageBet';
import HowToUse from './howToUse';


class App extends Component {


  state = {
    bets: [],
    statements: [],
    amounts: [],
  };

// get the initial information from our betFactory contract on Ethereum and store it in state variables
  async componentDidMount(){
      const bets = await factory.methods.getDeployedBets().call();
      const amounts = await factory.methods.getDeployedAmounts().call();
      const statements = [];
      for(var i = 0;i<bets.length;i++){
        var statement = await factory.methods.statements(i).call();
        statements[i] =statement;
      }
      this.setState({bets,statements,amounts,selectedBet:bets[0]});
  }

// render the information from all deployed bets to different Cards
 renderBets(){
   const items = this.state.bets.map((address,index) => {
      var [a,b,c,d,e] = address.match(/.{1,9}/g);
      var s = ' ';
      var fAddress = a+s+b+s+c+s+d+s+e;
     return {
       header: `Contract Address: ${fAddress}`,
       meta: `Bet Statement: ${this.state.statements[index]}`,
       description: `Bet Amount in Wei: ${this.state.amounts[index]}`,
       fluid: true,
       raised: true,
       color: 'orange'
     };
   });
   return <Card.Group items= {items} />;
  }

  // helper function to make sure we don't have to click on the menu twice...
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //render a menu where users can choose which bet contract they want to interact with
  //using the controls below
  renderMenu(){
    const items = this.state.bets.map((address,index) => {
      return <Dropdown.Item key={index} onClick={async (data) => {
                                                const address = data.target.textContent;
                                                this.setState({selectedBet:address});
                                                await this.sleep(2000);
                                                this.setState({selectedBet:address})}}>

              {address}
            </Dropdown.Item>
    });
    return items;
  }

  //renders the controls for a selected bet contract
  showControls(){
    return <ManageBet betAddress={this.state.selectedBet} />;
  }


  render() {
    return (
      <div style={{backgroundColor: "#101010"}}>
      <hr/>
      <Grid padded={true} centered={true}>
      <Segment padded="very" circular={true}  color ="purple" raised={true} textAlign="center">
        <h1>Crypto Moderated Bets</h1>
      </Segment>
      </Grid>
      <Grid padded={true} columns='equal'>
        <Grid.Column>
          <Segment raised={true} color="orange">
            <h2>Bets</h2>
            {this.renderBets()}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment raised ={true} color="red">
            <h2>How To Use This Site</h2>
            <HowToUse/>
            <NewBet/>
          </Segment>
        </Grid.Column>
      </Grid>
      <Grid padded={true} centered={true}>
      <Segment circular={true} raised={true} color="blue">
      <Menu vertical>
        <Dropdown item text='Choose Bet Contract'>
          <Dropdown.Menu>
            {this.renderMenu()}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
      </Segment>
      </Grid>
      {
      this.state.selectedBet && this.state.bets &&
      this.showControls()
    }
      </div>
    );
  }
}

export default App;
