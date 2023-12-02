import React, { useState } from 'react';
import './styles.scss'; // Import your CSS file for styling

const SpinnerButton = ({ isLoading, content }) => {
    return (
        isLoading ? <span className="spinner"></span> : content
    );
};

export default SpinnerButton;