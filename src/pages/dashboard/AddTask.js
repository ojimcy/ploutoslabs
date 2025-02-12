import React, { useState } from 'react';
import {
  Button,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from 'reactstrap';
import { toast } from 'react-hot-toast';

import { addTasks } from '../../lib/server'; // API function for creating tasks

const AddTask = () => {
  const [taskData, setTaskData] = useState({
    name: '',
    link: '',
    reward: '',
    type: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskTypes = [
    'telegram',
    'twitter',
    'youtube',
    'tiktok',
    'medium',
    'others',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !taskData.name ||
      !taskData.link ||
      !taskData.reward ||
      !taskData.type
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    // Ensure reward is a number (float)
    const rewardAsNumber = parseFloat(taskData.reward);
    if (isNaN(rewardAsNumber)) {
      toast.error('Reward must be a valid number');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await addTasks({
        ...taskData,
        reward: rewardAsNumber,
      });
      toast.success(response.message || 'Task added successfully');
      setTaskData({ name: '', link: '', reward: '', type: '' }); // Reset form
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-task-page">
      <Container>
        <h3 className="text-center">Add Task</h3>
        <p className="text-center">
          Fill out the form below to create a new task.
        </p>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="name">Task Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={taskData.name}
              onChange={handleChange}
              placeholder="Enter task name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="name">Description</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={taskData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="link">Task Link</Label>
            <Input
              id="link"
              name="link"
              type="url"
              value={taskData.link}
              onChange={handleChange}
              placeholder="Enter task link"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="reward">Reward</Label>
            <Input
              id="reward"
              name="reward"
              type="number"
              value={taskData.reward}
              onChange={handleChange}
              placeholder="Enter reward amount (e.g., 10 GPLTL)"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="type">Task Type</Label>
            <Input
              id="type"
              name="type"
              type="select"
              value={taskData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select a task type</option>
              {taskTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Input>
          </FormGroup>

          <Button
            color="primary"
            type="submit"
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="sm" /> : 'Add Task'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default AddTask;
