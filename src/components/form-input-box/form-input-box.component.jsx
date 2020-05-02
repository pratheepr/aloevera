import React from 'react';

import './form-input-box.styles.scss';

const FormInputBox = ({ handleChange, label, ...otherProps }) => {
  
    return (
      <div className='group'>
        <input className='form-input-box' onChange={handleChange} {...otherProps} />
        {label ? (
          <label
            className={`${
              otherProps.value.length ? 'shrink' : ''
            } form-input-box-label`}
          >
            {label}
          </label>
        ) : null}
      </div>
      )

};

export default FormInputBox;
