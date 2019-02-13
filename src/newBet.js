import React, { Component } from 'react';
import factory from './factory';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import web3 from './web3';

// Input for for creating a new bet

class NewBet extends Component {

  state = {
    betStatement: '',
    betAmount: 0,
    errorMessage: '',
    loading: false
  }

onSubmit = async (event) => {
  event.preventDefault();
  this.setState({loading:true,errorMessage:''});
  try {
    const accounts = await web3.eth.getAccounts();
    await factory.methods.createModeratedBet(this.state.betStatement,this.state.betAmount)
      .send({from: accounts[0]});
  } catch (err) {
    this.setState({errorMessage:err.message});
  }
  this.setState({loading:false});
}

  render(){
    return (
      <div>
      <h2>Create a New Bet</h2>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Bet Statement</label>
          <Input
            label="text"
            labelPosition="right"
            value={this.state.betStatement}
            onChange={event =>
              this.setState({betStatement: event.target.value})}
          />
        </Form.Field>
        <Form.Field>
          <label>Bet Amount</label>
          <Input
            label="wei"
            labelPosition="right"
            value={this.state.betAmount}
            onChange={event =>
              this.setState({betAmount: event.target.value})}
          />
        </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage}/>
          <Button loading={this.state.loading} primary>Create</Button>
        </Form>
        </div>
    );
  }
}

export default NewBet;
