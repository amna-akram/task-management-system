import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./task-list.styles.scss";
import TaskCard from "../task-card/task-card";
import { getTasks, updateTask } from "../../utils/db";
import socketIOClient from "socket.io-client";
import { useAuth } from "../../context-providers/auth-context";

import { useState, useEffect } from "react";

const TaskList = ({ onTasksUpdateHandler }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  if (!localStorage.getItem("group")) {
    localStorage.setItem("group", user.groupId);
  }

  const fetchTasks = async () => {
    const tsks = await getTasks(userGroupid);
    const sortedTasks = tsks.sort(
      (task1, task2) => task1.priority - task2.priority
    );
    setTasks(sortedTasks);
  };

  const userGroupid = localStorage.getItem("group");
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:3002");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server.");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error.message);
    });

    socket.on("data", (newData) => {
      console.log("data updated event received");
      const groupTasks = newData.filter((task) => {
        return task.groupId == userGroupid;
      });
      const sortedTasks = groupTasks.sort(
        (task1, task2) => task1.priority - task2.priority
      );
      onTasksUpdateHandler(sortedTasks.length);
      setTasks(sortedTasks);
    });

    socket.on("taskAddedSuccess", (newTask) => {
      if (newTask.groupId == localStorage.getItem("group")) {
        toast.success(
          `A new task "${newTask.title}" has been created by ${newTask.created_by} `,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      }
    });

    socket.on("taskDeletedSuccess", (data) => {
      const taskName = data.taskName;
      const deletedBy = data.deletedBy;
      const groupId = data.groupId;
      if (
        deletedBy !== localStorage.getItem("username") &&
        groupId == localStorage.getItem("group")
      ) {
        toast.error(`The task "${taskName}" has been deleted by ${deletedBy}`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const reOrderTasks = async (deletedTaskPriority) => {
    const updatedTasks = tasks
      .filter((task) => task.priority > deletedTaskPriority)
      .map((task) => ({ ...task, priority: task.priority - 1 }));

    //Updating db synchronously to avoid race conditions
    for (const task of updatedTasks) {
      try {
        await updateTask(task.id, task);
        console.log(`Task with ID ${task.id} updated successfully.`);
      } catch (error) {
        console.error(`Error updating task with ID ${task.id}:`, error.message);
      }
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, movedTask);

    updatedTasks.forEach((task, index) => {
      task.priority = index + 1;
    });

    //Updating db synchronously to avoid race conditions
    for (const task of updatedTasks) {
      try {
        await updateTask(task.id, task);
        console.log(`Task with ID ${task.id} updated successfully.`);
      } catch (error) {
        console.error(`Error updating task with ID ${task.id}:`, error.message);
      }
    }
  };

  return (
    <>
      <div className="task-list">
        {tasks.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  id="tasks"
                  className="tasks"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks.map((task) => (
                    <TaskCard task={task} reOrderTasks={reOrderTasks} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div>
            No Tasks Yet, Create a New one by Clicking at the Plus Icon!
          </div>
        )}
      </div>
    </>
  );
};

export default TaskList;
