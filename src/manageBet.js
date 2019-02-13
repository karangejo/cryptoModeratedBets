import React, { Component } from 'react';
import Bet from './bet';
import {Form, Button, Input, Message, Card, Grid, Segment} from 'semantic-ui-react';
import web3 from './web3';

let bet;

// this file contains a class for managing an instance of a bet contract
// and also displays information about the contract

class ManageBet extends Component {



  state = {
    betAddress: '',
    moderatorAddress: '',
    pendingModeratorAddress: '',
    bettorAddress: '',
    betteAddress: '',
    amount: 0,
    betStatement: '',
    balance: 0,
    voteCount: 0,
    loading1:false,
    loading2:false,
    loading3:false,
    loading4:false,
    loading5:false,
    loading6:false,
    errorMessage: '',
    dontShowError:true,
    settleErrorMessage: '',
    winnerAddress: ''
  }

 // component must update according to different props that are passed
  componentWillReceiveProps(props){
      this.setData();
  }

  componentDidMount(){
    this.setData();
  }

  // get and set all the data from the contract to state variables
  async setData(){
    const address = this.props.betAddress;
    bet = Bet(address);
    const summary = await bet.methods.summary().call();

    this.setState({betAddress: address
                  ,bettorAddress: summary[0]
                  ,betteAddress: summary[1]
                  ,pendingModeratorAddress: summary[2]
                  ,moderatorAddress: summary[3]
                  ,amount: summary[4]
                  ,balance: summary[5]
                  ,betStatement: summary[6]
                  ,voteCount: summary[7]
                });

  }

  // these cards display all the information for this instance of the contract
  renderCards(){

    const items = [
    {
      header: this.state.betAddress,
      description: 'Contract Address',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.bettorAddress,
      description: 'Initial Bettor\'s Address',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.betteAddress,
      description: 'Counter Bettor\'s Address',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.betStatement,
      description: 'Bet Statement',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.amount,
      description: 'Bet Amount',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.balance,
      description: 'Contract Balance',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.moderatorAddress,
      description: 'Approved Moderator\'s Address',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.pendingModeratorAddress,
      description: 'Pending Moderator\'s Address',
      fluid: true, raised: true, color: "green"
    },
    {
      header: this.state.voteCount,
      description: 'Moderator Vote Count',
      fluid: true, raised: true, color: "green"
    },
  ]

    return <Card.Group items={items} />;
  }



  // render the controls for interacting with the contract
  renderControls(){
    return(
      <div>
      <Message error header="Oops!" content={this.state.errorMessage} hidden={this.state.dontShowError}/>
      <Button.Group vertical basic>
        <Button loading={this.state.loading1} primary animated  onClick={this.depositBetAmount} error={this.state.errorMessage.toString()}>
           <Button.Content visible>Deposit Bet Amount</Button.Content>
            <Button.Content hidden>Address must Match Initial Bettor</Button.Content>
        </Button>
        <Button loading={this.state.loading2} primary animated  onClick={this.acceptTheBet} error={this.state.errorMessage.toString()}>
           <Button.Content visible>Accept Bet</Button.Content>
            <Button.Content hidden>Are you Sure?</Button.Content>
        </Button>
        <Button loading={this.state.loading3} primary animated  onClick={this.becomeModerator} error={this.state.errorMessage.toString()}>
           <Button.Content visible>Become Moderator</Button.Content>
            <Button.Content hidden>Are you Sure?</Button.Content>
        </Button>
        <Button loading={this.state.loading4} positive primary animated  onClick={this.approveModerator} error={this.state.errorMessage.toString()}>
           <Button.Content visible>Approve Moderator</Button.Content>
            <Button.Content hidden>Are you Sure?</Button.Content>
        </Button>
        <Button loading={this.state.loading5} primary animated  onClick={this.disapproveModerator} error={this.state.errorMessage.toString()}>
           <Button.Content visible>Disapprove Moderator</Button.Content>
            <Button.Content hidden>Are you Sure?</Button.Content>
        </Button>
      </Button.Group>
      <Form onSubmit={this.settleBet} error={!!this.state.settleErrorMessage}>
        <Form.Field>
          <label>Winner's Address (only moderator can do this)</label>
          <Input
            label="address"
            labelPosition="right"
            value={this.state.winnerAddress}
            onChange={event =>
              this.setState({winnerAddress: event.target.value})}
          />
        </Form.Field>
          <Message error header="Oops!" content={this.state.settleErrorMessage}/>
          <Button loading={this.state.loading6} primary>Create</Button>
        </Form>
      </div>
    );
  }

  // the following are event handlers with async/await web3 calls to ethereum
  // to interact with the contract
  // errors are displayed if any occur
  depositBetAmount = async (event) => {
    event.preventDefault();
    this.setState({loading1:true,errorMessage:'',dontShowError:true});
    try {
      const accounts = await web3.eth.getAccounts();
      await bet.methods.depositBetAmount()
        .send({from: accounts[0],value:this.state.amount});
    } catch (err) {
      this.setState({errorMessage:err.message,dontShowError:false});
    }
    this.setState({loading1:false});
  }

  acceptTheBet = async (event) => {
    event.preventDefault();
    this.setState({loading2:true,errorMessage:'',dontShowError:true});
    try {
      const accounts = await web3.eth.getAccounts();
      await bet.methods.acceptTheBet()
        .send({from: accounts[0],value:this.state.amount});
    } catch (err) {
      this.setState({errorMessage:err.message,dontShowError:false});
    }
    this.setState({loading2:false});
  }

  becomeModerator = async (event) => {
    event.preventDefault();
    this.setState({loading3:true,errorMessage:'',dontShowError:true});
    try {
      const accounts = await web3.eth.getAccounts();
      await bet.methods.becomeModerator()
        .send({from: accounts[0]});
    } catch (err) {
      this.setState({errorMessage:err.message,dontShowError:false});
    }
    this.setState({loading3:false});
  }

  approveModerator = async (event) => {
    event.preventDefault();
    this.setState({loading4:true,errorMessage:'',dontShowError:true});
    try {
      const accounts = await web3.eth.getAccounts();
      await bet.methods.approveModerator()
        .send({from: accounts[0]});
    } catch (err) {
      this.setState({errorMessage:err.message,dontShowError:false});
    }
    this.setState({loading4:false});
  }

  disapproveModerator = async (event) => {
    event.preventDefault();
    this.setState({loading5:true,errorMessage:'',dontShowError:true});
    try {
      const accounts = await web3.eth.getAccounts();
      await bet.methods.disapproveModerator()
        .send({from: accounts[0]});
    } catch (err) {
      this.setState({errorMessage:err.message,dontShowError:false});
    }
    this.setState({loading5:false});
  }

  settleBet = async (event) => {
    event.preventDefault();
    this.setState({loading6:true,settleErrorMessage:''});
    try {
      const accounts = await web3.eth.getAccounts();
      await bet.methods.settleBet(this.state.winnerAddress)
        .send({from: accounts[0]});
    } catch (err) {
      this.setState({settleErrorMessage:err.message});
    }
    this.setState({loading6:false});
  }

 // render the information cards and the controls in a grid
  render(){
    return(
      <Grid padded={true} columns='equal'>
        <Grid.Column>
          <Segment raised={true} color="green">
            <h2> Selected Bet Information </h2>
            {this.renderCards()}
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment raised={true} color="yellow">
            <h2> Selected Bet Controls </h2>
            {this.renderControls()}
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default ManageBet;
