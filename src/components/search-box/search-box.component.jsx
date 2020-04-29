import React from 'react';
import Select from 'react-select';

import './search-box.styles.scss' ;

class SearchBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: '',
            sboxOptions: []
        };

        this.handleChange = this.handleChange.bind(this);
    }

    

    componentDidMount() {
         this.setState( {sboxOptions: this.props.sboxOptions}) ; 
         this.setState( {selectedValue:null}) ;

    }

    handleChange = (event) => {
        if (event) {
            this.setState({selectedValue: event.value});
            console.log(event.map((event) => event.value ));
        }
        else {
            this.setState({selectedValue: []});
 
        } 

        this.props.sboxHandleChange= this.state.selectedValue;
    }



render() {

        return (
        <div className='group'>
            <Select
                closeMenuOnSelect={false}
                defaultValue={[this.state.sboxOptions[4], this.state.sboxOptions[5]]}
                placeholder={this.props.searchLabel}
                isMulti
                options={this.state.sboxOptions}
                onChange={this.props.sboxHandleChange}
            />
        </div>
        )
    }
}

export default SearchBox; 

