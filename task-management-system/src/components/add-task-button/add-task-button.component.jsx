import React from 'react';
import './add-task-button.styles.scss';
import { FiPlus } from 'react-icons/fi';

const AddTaskButton = ({ clickHandler }) => {
  return (
    <button className="add-task-button" onClick={clickHandler}>
      <FiPlus className="plus-icon" />
    </button>
  );
};

export default AddTaskButton;
