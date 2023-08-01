import axios from 'axios';

const baseUrl = 'http://localhost:3001/tasks';
const socketBaseUrl = 'http://localhost:3002/tasks';
const baseUrlUsers = 'http://localhost:3001/users';

export const getTasks = async (groupId) => {
  try {
    const response = await axios.get(`${baseUrl}?groupId=${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const addTask = async (taskData) => {
  console.log("taskData");
  console.log(taskData);
  try {
    const response = await axios.post(socketBaseUrl, taskData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId, taskTitle, deletedBy, groupId) => {
  try {
    const response = await axios.delete(`${socketBaseUrl}/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        taskName: taskTitle,
        deletedBy: deletedBy,
        groupId: groupId,
      }
    });
    return response;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updatedTaskData) => {
  try {
    const response = await axios.put(`${baseUrl}/${taskId}`, updatedTaskData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(baseUrlUsers, userData);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const getUser = async (userData) => {
  try {
    const response = await axios.get(`${baseUrlUsers}?username=${userData.username}&password=${userData.password}`);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}
