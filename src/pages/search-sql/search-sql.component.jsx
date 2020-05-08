import React from 'react';

import bodybuilder from 'bodybuilder'; 
import axios from 'axios'; 

import SearchBox from '../../components/search-box/search-box.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component'; 
import SearchResultsTbl from '../../components/search-results-tbl/search-results-tbl.component';

import BaseApiUrl from '../../components/apis/aloeveracalls';

import './search-sql.styles.scss';
//import { element } from 'prop-types';
//import createRowData from '../../components/search-results-tbl/createRowData';
 

class SearchSql extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search_Colors:[],
            sqlSearchValue:'',
            dbSqls:[],
            areaOptions: [],
            schemaOptions: [],
            authorOptions: [] ,
            tableOptions: [] , 
            selectedArea: [] ,
            selectedSchema: [] ,
            selectedAuthor: [] ,
            selectedTables: [] 
        }
    }

    
    handleChange = event => {
       // console.log( event);
      
        const { name, value } = event.target;

        this.setState({ [name]: value });

       // console.log(event.target);
     //   console.log(name, value);
    
      };

    handleSearchBoxChange = (returnValues) => {

        console.log(returnValues); 
        
        console.log(returnValues.map( returnValue => returnValue.value )); 

        const searchValues = returnValues.map ( returnValue => 
                                ({ groupName: returnValue.groupName ,
                                   groupValue: returnValue.value
                                })
                            ) ;
        

        switch ( searchValues[0].groupName) {
            case 'sqlarea'  :  this.setState( {selectedArea: searchValues} ); break; 
            case 'sqlschema':  this.setState( {selectedSchema: searchValues} ); break; 
            case 'sqlowner' :  this.setState( {selectedAuthor: searchValues} ); break;
            case 'sqltables':  this.setState( {selectedTables: searchValues} ); break;
            default: 
        }
        console.log( this.state ) ;
      }

    GetAllData = async event => {
        
        const response = await BaseApiUrl.get('/usersqlcollector'); 
        this.setState( { dbSqls: response.data.sqls} ) ;
      }

    GetAllTables = async event => {

        console.log('INSIDE ALL TABLES');

        const response = await BaseApiUrl.get('/aloeverametadata/tables'); 

        const tmp_all_tables = response.data.aloevera_tables.map( (tableName) => ({
                                                                                name: tableName.table_name ,
                                                                                  id: tableName.id ,
                                                                               value: tableName.table_name ,
                                                                               label: tableName.table_name ,
                                                                           groupName: 'sqltables'
                                                                            }));
        
        if ( tmp_all_tables.length > 0 ) {
            this.setState( {tableOptions: tmp_all_tables})
        }

        console.log('PRINT ALL TABLES')
        console.log(tmp_all_tables);
    }
    
    handleMetadata = async (groupName) => {
        
        console.log(groupName) ;
       // const response = await BaseApiUrl.get('/aloeverametadata/' + groupName);
        const response = await BaseApiUrl.get('/aloeverametadata'); 

        console.log(response) ;

        const all_metadata_options = response.data.aloeveraMetadata.map ( areaItem =>
                                                                        ({ name: areaItem.attr_name , 
                                                                            id: areaItem.id, 
                                                                        value: areaItem.attr_name,
                                                                        label: areaItem.attr_name,
                                                                        groupName: areaItem.group_name
                                                                        })
                                                                    ) ;
        
        console.log( all_metadata_options); 

        if ( all_metadata_options.length > 0 ) {

            const tmp_areaoptions = all_metadata_options.filter ( item => item.groupName ==='sqlarea') ; 
            const tmp_schemaOptions = all_metadata_options.filter ( item => item.groupName ==='sqlschema') ;  
            const tmp_authorOptions = all_metadata_options.filter ( item => item.groupName ==='sqlowner') ;  

            this.setState ({
                areaOptions: tmp_areaoptions,
                schemaOptions: tmp_schemaOptions,
                authorOptions: tmp_authorOptions
                }) ; 
        }

       // this.setState ( {options: result} ) ;
        console.log( 'Inside search sql component did mount');
        console.log( this.state);
    }

    handleSearchSubmit = event => {
        console.log('Inside Search Submit') ;

        const tmp_array = [ ...this.state.selectedArea, ...this.state.selectedSchema, ...this.state.selectedAuthor, ...this.state.selectedTables] ;
        //console.log(tmp_array); 

        const tmp = tmp_array.map ( searchTerm => 
                         ( { 'groupName' :  searchTerm.groupName , 'groupValue' : searchTerm.groupValue } )) ;
        
        console.log(tmp);

        let queryBody = bodybuilder();
        tmp.forEach(filter => {
              queryBody = queryBody.addFilter('term', filter.groupName , filter.groupValue.toLowerCase());  
        });

        if ( this.state.sqlSearchValue ) {
            const searchString = this.state.sqlSearchValue; 

            queryBody = queryBody.orFilter('match','sqlscript',searchString)
                                 .orFilter('match','sqlcomments',searchString)
                                 .orFilter('match','sqlname',searchString)
                                 .filterMinimumShouldMatch(1)
        }
        
        console.log(queryBody.build());
        console.log(JSON.stringify(queryBody.build(), null, 2)) ; 

        axios
            .post('http://localhost:9200/contact/_search',JSON.stringify(queryBody.build()),{
                headers: {
                  'Content-Type': 'application/json'
                }
              }
              )
            .then( res => {
                console.log(res.data.hits.hits.map( (tmp) =>  tmp._source)) ;
                console.log ( this.state);
                //         this.setState( { dbSqls: response.data.sqls} ) ;
                this.setState( {dbSqls: res.data.hits.hits.map( (tmp) =>  ({...tmp._source , id: tmp._source.sqlid} ) )} );
            });

    }

    handleCancelSubmit = event => {
        console.log('Inside Search Cancel') ;
        console.log ( this.state);
    }

    handleSearchCancel = event => {
        console.log('inside handle cancel') 
        const newPageUrl = '/selectsql' 
        window.open(newPageUrl, "_blank") 
    }

    componentDidMount() {
        
        this.handleMetadata('');         
        this.GetAllData(); 
        this.GetAllTables() ; 

      }

    render() {

        const { sqlSearchValue, dbSqls , areaOptions, schemaOptions , authorOptions, tableOptions } = this.state ; 

        console.log( 'dbsqls is (from parent):'  ) ;
        console.log (dbSqls) ;

        console.log ( this.state);

        return (
            <div className='grid-container'>
                       <div className='grid-header'>
                                <FormInput 
                                    type='textarea'
                                    name='sqlSearchValue'
                                    value={sqlSearchValue}
                                    onChange={this.handleChange}
                                    label='Free text search'
                                    rows='1'
                                    required
                                    style={{width: "700px", alignItems:"center"}}
                                />
                       </div> 
                       <div className='search-box-form'>
                            <div className='grid-search-box'>
                                    <br />
                                    {
                                        areaOptions.length > 0   && tableOptions.length > 0   ? 
                                        <div>
                                            <SearchBox 
                                                sboxOptions={areaOptions} 
                                                sboxHandleChange={this.handleSearchBoxChange} 
                                                searchLabel={'Select Business Area'}
                                            />
                                            <br /> 
                                            <SearchBox 
                                                sboxOptions={schemaOptions} 
                                                sboxHandleChange={this.handleSearchBoxChange} 
                                                searchLabel={'Select Schema'}
                                            />
                                            <br /> 
                                            <SearchBox 
                                                sboxOptions={tableOptions} 
                                                sboxHandleChange={this.handleSearchBoxChange}
                                                searchLabel={'Select Tables'} 
                                            />
                                            <br /> 
                                            <SearchBox 
                                                sboxOptions={authorOptions} 
                                                sboxHandleChange={this.handleSearchBoxChange}
                                                searchLabel={'Select Owner'} 
                                            />
                                        </div> 
                                    : null 
                                    }                            
                                    <div className='buttons'>
                                        <CustomButton onClick= {this.handleSearchSubmit}>Submit</CustomButton>
                                        <br />
                                        <CustomButton onClick = {this.handleSearchCancel}>Cancel</CustomButton>
                                    </div>
                            </div>
                        </div>
                       <div className='grid-search-results'>
                            <h2 className='title'>Search Box</h2>
                            
                            { dbSqls.length > 0 ?  
                                <div> 
                                    { console.log('INSIDE SEARCH RESULTS RENDER'+ dbSqls.length) 
                                    }
                                    <SearchResultsTbl rows={this.state.dbSqls} />  
                                </div>
                                : 
                                <h2 className='title'>LOADING</h2> }
                       </div>
                        <div className='grid-footer'> 
                        </div>
            </div>
        );
    }
}

export default SearchSql;