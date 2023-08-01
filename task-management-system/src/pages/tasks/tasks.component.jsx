import { useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./tasks.styles.scss";
import AddTaskButton from "../../components/add-task-button/add-task-button.component";
import TaskList from "../../components/task-list/task-list.component";
import ModalForm from "../../components/modal-form/modal-form.component";
import { addTask } from "../../utils/db";
import Header from "../../components/header/header.component";
import { getCurrentDateTime } from "../../utils/helper_functions";
function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalTasks, setTotalTasks] = useState();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onTasksUpdateHandler = (num) => {
    setTotalTasks(num);
  };

  const generateRandomId = () =>
    `${Math.random().toString(36).substr(2, 6)}-${Date.now()}`;

  const showToastMessage = () => {
    toast.success("New Task Added Successfully !", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const handleSubmitForm = async (formData) => {
    console.log("Form data:", formData);
    const groupValue = localStorage.getItem("group");
    const groupInt = parseInt(groupValue, 10);
    try {
      await addTask({
        id: generateRandomId(),
        groupId: groupInt,
        priority: totalTasks + 1,
        created_by: localStorage.getItem("username"),
        created_at: getCurrentDateTime(),
        completed: false,
        ...formData,
      });
      showToastMessage();
    }
    catch {
      console.log("an error occured while adding the new task")
    }
  };

  return (
    <div>
      <Header />
      <div className="add-button-container">
        <AddTaskButton clickHandler={handleOpenModal} />
      </div>
      <TaskList onTasksUpdateHandler={onTasksUpdateHandler} />
      {isModalOpen && (
        <ModalForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitForm}
        />
      )}
    </div>
  );
}

export default Tasks;
