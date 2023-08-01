import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./task-card.styles.scss";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FaTrash } from "react-icons/fa";
import { deleteTask, updateTask } from "../../utils/db";
const TaskCard = ({ task, reOrderTasks }) => {
  const {
    id,
    title,
    description,
    completed,
    groupId,
    priority,
    created_by,
    created_at,
  } = task;

  const showDeleteToastMessage = () => {
    toast.warning("Task Deleted Successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const showUpdateToastMessage = () => {
    toast.success("Task Status Changed Successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const onDelete = async () => {
    const deleted_by = localStorage.getItem("username");
    try {
      await deleteTask(id, title, deleted_by, groupId);
      showDeleteToastMessage();
      await reOrderTasks(priority);
    }
    catch {
      console.log("an error occured while deleting the item")
    }
  };

  const showConfirmationDialog = () => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this task?",
      buttons: [
        {
          label: "Yes",
          onClick: () => onDelete(id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const onCompleteToggleClick = async () => {
    try {
      await updateTask(id, {
        ...task,
        completed: !completed,
      });
      showUpdateToastMessage();
    }
    catch {
      console.log("an error occured while changing the status of task")
    }
  };
  return (
    <Draggable key={id} draggableId={id} index={priority - 1}>
      {(provided) => (
        <div
          className={`task-card ${completed ? "completed" : ""}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="task-card-header">
            <span className="task-title">{title}</span>
          </div>
          <div className="task-description">{description}</div>
          <div className="created-info">
            <p>Created by: {created_by}</p>
            <p>Created at: {created_at}</p>
          </div>
          <div className="task-actions">
            <button className="complete-button" onClick={onCompleteToggleClick}>
              {completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
          <div className="delete-button-container">
            <button className="delete-button" onClick={showConfirmationDialog}>
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
