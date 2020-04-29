import React from 'react';

import { Multiselect } from 'multiselect-react-dropdown';

import './multiselector.styles.scss';

class Multiselector extends React.Component {
    constructor(props) {
        super();
    
        this.state = {
          options:[]
        };
      }

    componentDidMount() {

        console.log(this.props);
        
        this.setState ({ ...this.props });
    }


    handleSelection = event => {
      console.log(event);
      
    }

    onSelect = ( selectedList ) => {
      console.log(selectedList);
      this.props.onSqlAreaChange(selectedList);
    }


    render() {
        console.log(this.state);
        

        return (
            <div className='group'>
              <div className='form-input'>
                <Multiselect className='form-input-label'
                    options={this.state.options} // Options to display in the dropdown
                    selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
                    onSelect={this.onSelect} //{this.onSelect} // Function will trigger on select event
                    onRemove={this.onRemove} // Function will trigger on remove event
                    displayValue="name" // Property name to display in the dropdown options
                    placeholder='Select SQL Area'
                    closeOnSelect='true'
                    disablePreSelectedValues='true '
                />
              </div>
            </div>
        );
    }

}

export default Multiselector;