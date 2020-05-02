import React from 'react';
import CSVReader from 'react-csv-reader';


import FormInput from '../../components/form-input/form-input.component'; 
import CustomButton from '../../components/custom-button/custom-button.component';
//import Multiselector from '../../components/multiselector/multiselector.component';
import BaseApiUrl from '../../components/apis/aloeveracalls';
import PopUp from '../../components/popup/popup';
import SearchBox from '../../components/search-box/search-box.component';

import { auth } from '../../firebase/firebase.utils'; 

import './insert-sql.styles.scss';
import './insert-sql-file-upload.styles.css';

class InsertSql extends React.Component {
    constructor() {
        super();

        this.state = {
            sqlArea:[],
            sqlStatement:'',
            sqlComments:'',
            options: [],
            sqlOwnerName:'',
            sqlName:'',
            PopUpSeen: false,
            loggedInUser:''
 
        };

    }

   /* [
        {name:'Sales', id:1} , 
        {name:'Calls', id:2} ,
        {name:'Cases', id:3} ,
        {name:'Marketing', id:4} ,
        {name:'Network', id:5}
        ]
        */ 

    areaOptions = [
        { value: 'SALES', label: 'SALES'},
        { value: 'CALLS', label: 'CALLS'},
        { value: 'CASES', label: 'CASES'},
        { value: 'MARKETING', label: 'MARKETING'},
        { value: 'NETWORK', label: 'NETWORK'}
    ];

    togglePop = () => {   
        this.setState({
            PopUpSeen: !this.state.PopUpSeen
        });
       };
     
    handleSearchBoxChange = (returnValues) => {

        if (returnValues) {

        console.log(returnValues);
        
        console.log(returnValues.map( returnValue => returnValue.value )); 
        this.setState({sqlArea:returnValues}); 
        }
        else {
            this.setState({sqlarea:[]});
        }

    }
    

    handleSubmit = async event => {
        event.preventDefault(); 

        console.log('Handle Submit');
        console.log( this.state.sqlArea) ;

      //  const tmp = sqlArea.map
        const { sqlArea, sqlName, sqlComments, sqlStatement, sqlOwnerName } = this.state; 

        const tmpSqlArea = sqlArea.map( val => val.name ).join(" , ") ;

        //const RepSqlStatement = sqlStatement.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

        const [ sqlname , sqlarea , sqlowner, sqlcomments , sqlscript ] = [ sqlName.toLowerCase() , tmpSqlArea.toLowerCase() , sqlOwnerName.toLowerCase(), sqlComments.toLowerCase(), sqlStatement.toLowerCase() ]

        const response = await BaseApiUrl.post('/usersqlcollector', { sqlname , sqlarea , sqlowner, sqlcomments , sqlscript });
    
        console.log(response);
 
        this.setState({
            sqlArea:[],
            sqlStatement:'',
            sqlComments:'',
            sqlOwnerName:'',
            PopUpTxt:'',
            sqlName:''
        });

        if (response.status === 200)
            this.setState( {PopUpTxt:' SQL statement successfully inserted'});
        else
            this.setState({PopUpTxt:' WTF Man! SQL fucked up!!'});

        this.togglePop();

      };

    handleChange = event => {
        const { name, value } = event.target;
    
        this.setState({ [name]: value });
      };

    handleCancel = event => {
        
        this.setState({
            sqlArea:[],
            sqlName:'',
            sqlStatement:'',
            sqlComments:'',
            sqlOwnerName:''
        });

    }

    handleSqlArea = (PropsSqlArea) => {
        this.setState({sqlArea:PropsSqlArea});
    }

    papaparseOptions = {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true
    };

    handleForce = (data, fileInfo) => {
        console.log(data);
    //    console.log( (  String( data.slice(-1)[0]) ).replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') );
      // const RepSqlStatement =  sqlStatement.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '') data.slice(-1)[0] 
        this.setState({ sqlStatement:  ( data.map ( v => String(v)).join(' ') ) });
    };

    handleMetadata = async (groupName) => {
        console.log(groupName) ;
        const response = await BaseApiUrl.get('/aloeverametadata/' + groupName); 

        var result =response.data.metadata_group_values.map ( groupData => 
                                ({ name: groupData.attr_name , 
                                     id: groupData.id, 
                                  value: groupData.attr_name,
                                  label: groupData.attr_name
                                 }))  ;

        this.setState ( {options: result} ) ;
        console.log (result) ;
        console.log( this.state);
    }


    componentWillMount() {

        this.handleMetadata('sqlarea');
        console.log('inside insert component'); 
        this.getAuthStatus();
        console.log('Print Logged in');
        console.log( this.state.loggedInUser); 
    }

    getAuthStatus = async () => {
        await auth.onAuthStateChanged((resp) => {
    
            // Pass response to a call back func to update state
            console.log(resp);
            //console.log(resp.displayName);

            this.updateUserState(resp);
        });
      }
    
      // update state
      updateUserState = (resp) => {
         this.setState({
            loggedInUser: resp.email
         })
      }
    
  
    render()
    {
        const {  sqlComments, sqlStatement, sqlOwnerName, sqlName , options } = this.state; 
                
        return(
            <div className='insert-sql'>
                <h2 className='title'>Insert SQL Page</h2>
                <div>
                    {this.state.PopUpSeen ? <PopUp toggle={this.togglePop} PopUpTxt={this.state.PopUpTxt} /> : null}
                </div>
                
                <form className='insert-sql-form' onSubmit={this.handleSubmit}>
                   
                   
                    { this.state.options.length > 0 
                    ?
                    <SearchBox 
                        sboxOptions={options} 
                        sboxHandleChange={this.handleSearchBoxChange} 
                        searchLabel={'Select SQL Area'} 
                    />
                    : null 
                    }
                    <FormInput 
                        type='textarea'
                        name='sqlName'
                        value={sqlName}
                        onChange={this.handleChange}
                        label='SQL Name'
                        rows='1'
                        required
                    />
                    <div>
                        <FormInput 
                            type='textarea'
                            name='sqlStatement'
                            value={sqlStatement}
                            onChange={this.handleChange}
                            label='SQL Statement'
                            rows='6'
                            required
                        />

                    <CSVReader
                            cssClass="custom-button-file-uploader "
                            cssInputClass="custom-button-file-uploader "
                            label="UPLOAD FROM FILE"
                            onFileLoaded={this.handleForce}
                            onError={this.handleDarkSideForce}
                            parserOptions={this.papaparseOptions}
                            inputId="ObiWan"
                            inputStyle=  {{color: 'red'}} //{{height: '50px', color: 'red', width: 'auto' }}//
                    />
                    </div> 

                    <FormInput 
                        type='textarea'
                        name='sqlComments'
                        value={sqlComments}
                        onChange={this.handleChange}
                        label='SQL Comments'
                        rows='2'
                        required
                    />
                    
                    <FormInput 
                        type='textarea'
                        name='sqlOwnerName'
                        value={sqlOwnerName}
                        onChange={this.handleChange}
                        label='Owner Name'
                        rows='1'
                        required
                        placeholder = {this.state.loggedInUser}
                    />

                    <div className='buttons'>
                        <CustomButton type='submit'>Submit</CustomButton>
                        <CustomButton onClick={this.handleCancel}>Cancel</CustomButton>
                    </div>

                </form>
             </div>
        )
    }

}

export default InsertSql;