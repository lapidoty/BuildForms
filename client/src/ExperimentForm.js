
import React, { Component } from 'react';
import gql from "graphql-tag";
import {graphql} from "react-apollo";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { browserHistory } from 'react-router';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const addNewForm = gql`
mutation($formId: String! , $name: String! , $fields: [inputField]!){
  createForm(formId: $formId , name: $name , fields: $fields ) 
}`;


class ExperimentForm extends Component {
    createForm = async form => {
        await this.props.createFormDB({
          variables:{
            formId: '_' + Math.random().toString(36).substr(2, 9),
            name: form.Form_Name,
            fields: form.Form
          }
        })
        this.props.updateMethod();
        browserHistory.goBack()
      };

	constructor(props){
		super(props);
		this.state = {
			label: this.props.experiment ? this.props.experiment.label :'',
      Input_Name: this.props.experiment ? this.props.experiment.Input_Name:'',
      kind: this.props.experiment ? this.props.experiment.kind:'',
      Form_Name: this.props.experiment ? this.props.experiment.Form_Name:'',
      data: this.props.experiment ? this.props.experiment.data:'',
      Form: []
		};
	}
 
	handleChange = (event) => {
		event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
	};
   
	submit = ( event ) => {
		event.preventDefault();
		const field = {
            label: this.state.label.trim(),
            kind: this.state.kind.trim(),
            Input_Name: this.state.Input_Name.trim(),
            data: this.state.Input_Name.trim()
      
    }

    const refresfData = {
        label: this.props.experiment ? this.props.experiment.label :'',
      Input_Name: this.props.experiment ? this.props.experiment.Input_Name:'',
      kind: this.props.experiment ? this.props.experiment.kind:'',
      Form_Name: this.props.experiment ? this.props.experiment.Form_Name:'',
      data: this.props.experiment ? this.props.experiment.data:'',
      Form : this.state.Form.push(field)
    };
    this.setState({label: '' , kind :'' , Input_Name :''})
    this.setState({ refresfData });
  };

  
	render() {
	    return (
        <div style = {{ margin: "auto" , width: 400}}>
      <Paper>
        <div>
          <center>
          <div>
			<form>
          <h1> Form Builder </h1> 
				<TextField
         id="label"
         label="Enter Label Name"
					name="label"
					value={this.state.label}
          onChange={this.handleChange}
          margin="normal"
					InputLabelProps={{
            shrink: true,
        }}
			    /><br />
				<TextField
        id="Input Name"
        label="Enter Input Name"
					name="Input_Name"
					value={this.state.Input_Name}
					onChange={this.handleChange}
					InputLabelProps={{
            shrink: true,
        }}
			    /><br/>
          <div style = {{ margin: "auto" , width: 180}}>
          <FormControl fullWidth={true}>
          <InputLabel shrink={true} >Type</InputLabel>
          <Select 
          
            value={this.state.kind}
            onChange={this.handleChange}
            inputProps={{
              name: 'kind',
              id: 'Input type',
            }}
          >
            <MenuItem value={"text"}>text</MenuItem>
            <MenuItem value={"tel"}>tel</MenuItem>
            <MenuItem value={"number"}>number</MenuItem>
            <MenuItem value={"email"}>email</MenuItem>
            <MenuItem value={"date"}>date</MenuItem>
          </Select>
        </FormControl>
        </div>
        <br/><br/>
				<Button 	label="Add Field" variant="contained" color="default"
					onClick={this.submit}
				>
        Add Field
        </Button>
				<Button 
					label="Cancel" variant="contained" color="default"
					onClick={browserHistory.goBack}
          style={{marginLeft: 10}}>
          Cancel
          </Button>
         
			</form>
      </div>
      <br/>
      
      <Table>
        <TableHead>
          <TableRow>
          <TableCell  >Field Label</TableCell>
            <TableCell >Input Name</TableCell>
            <TableCell >Input type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.Form.map((row , index) => {
            return (
              <TableRow key={index}>
                <TableCell >{row.label}</TableCell>
                <TableCell > {row.Input_Name}</TableCell>
                <TableCell > {row.kind}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    
   
    <div>
    <br/>
          <TextField
        id="Form Name"
        label="Enter Form Name"
					name="Form_Name"
					value={this.state.Form_Name}
					onChange={this.handleChange}
					InputLabelProps={{
            shrink: true,
        }}
			    /><br/><br/>
				<Button 	label="Done" variant="contained" color="default"
					onClick={() => this.createForm(this.state)}
				>
        Done
        </Button><br/><br/>
        </div>
        </center>
      </div>
      
      </Paper>
    </div>
	 	);
	}
}

export default graphql(addNewForm , {name:"createFormDB"})(ExperimentForm);
