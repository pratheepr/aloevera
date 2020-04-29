import React from 'react';
//import PropTypes from 'prop-types';

class WrapperFormatter extends React.Component {
   /* static propTypes = {
        value: PropTypes.string.isRequired
    };
    static defaultProps = {
        value : ''
    }
    */
    /**
     *
     * @returns {*}
     */
    render() {
        //console.log(this.props)
        return (<p style={{whiteSpace:'pre-wrap'}}>{this.props.value}</p>)
    }
}

export default WrapperFormatter ;