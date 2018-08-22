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
import { BrowserRouter as Router , Link} from 'react-router-dom';
import Route from 'react-router-dom/Route';

import ExperimentForm from './ExperimentForm';
import DisplayForm from './DisplayForm';
import displaySubmits from './displaySubmits';


const rows = gql`
{
  forms {
    id
    formId
    name
    fields{
      label
      kind
    }
  }
    fullfiledForms{
    formId
    }
}`;





class App extends Component {

  update = () => {
    this.props.data.refetch();
  }
  render() {
    const {data: {loading , forms , fullfiledForms}} = this.props;

    if(loading){
      return null;
    }

    //if(loading === false && typeof forms === "undefined"){
      //document.location.reload(true);
    //}

    return (
      <Router>
      <div>
      
        <Route path="/" exact strict render={
          () => {
            return (
             
              <div>
        
             <center> <h1> Form Builder </h1> </center>
      
      <div style={{ display: "flex"}}>
        <div style = {{ margin: "auto" , width: 800}}>
        <Paper>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell  >Form Id</TableCell>
            <TableCell >Form Name</TableCell>
            <TableCell >#Submissions</TableCell>
            <TableCell >Submit Page</TableCell>
            <TableCell >Submissions Page</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.map((row , index) => {
            return (
              <TableRow key={row.id}>
                <TableCell > { index } </TableCell>
                <TableCell > {row.name} </TableCell>
                <TableCell>
                   {fullfiledForms.filter(rowf => {return (rowf.formId === row.formId)}).length}
                    </TableCell>
                    
               <TableCell > 

                 <Button component={Link} to={"/DisplayForm/".concat(row.formId)}  color="default" >
                 VIEW     
                </Button> </TableCell>

                <TableCell > 

                <Button component={Link} to={"/displaySubmits/".concat(row.formId)}  color="default" >
                VIEW     
                </Button> </TableCell>
               
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
    </div>
    
        </div>
        <div style={{ padding: 20 }}>
        <center>
        
          <Button component={Link} to="/Builder" variant="contained" color="default" >
          Add new Form        
        </Button> 
        </ center>
        </div>
        
 </div>
            );
           
          }
          
        }/>

         <Route path="/Builder" exact strict render={
                ()=>{
                  return(
                  <ExperimentForm updateMethod={this.update} />  
                  )
                }}/>
                 <Route path="/DisplayForm/:formId" exact strict render={
                ()=>{
                  return(
                  <DisplayForm updateMethod={this.update} />  
                  )
                }}/>

          {/*<Route path="/DisplayForm/:formId" exact strict component={DisplayForm}/>*/}
          <Route path="/displaySubmits/:formId" exact strict component={displaySubmits}/>

   </div>       
 </ Router>
    );
  }
}

export default graphql(rows)(App);
