import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'reactstrap';
import {
  FaCalendar,
  FaCheck,
  FaGreaterThan,
  FaMedium,
  FaTasks,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import {
  useCurrentUser,
  useTelegramUser,
  useWebApp,
} from '../../../hooks/telegram';
import {
  completeTask,
  getTasks,
  getUserByTelegramID,
} from '../../../lib/server';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import logo from '../../../assets/images/logo.png';

import './tasks.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const webApp = useWebApp();
  const currentUser = useCurrentUser();
  const telegramUser = useTelegramUser();

  const fetchTask = async () => {
    const user = await getUserByTelegramID(telegramUser.id);
    const tks = await getTasks(user.id);
    setTasks(tks);
  };

  useEffect(() => {
    if (!telegramUser) return;
    fetchTask();
  }, [telegramUser]);

  useEffect(() => {
    if (currentUser) {
      const lastCheckInAt = new Date(currentUser.lastCheckinDate);
      const today = new Date();
      const isSameDay = lastCheckInAt.toDateString() === today.toDateString();
      setCheckedIn(isSameDay);
    }
  }, [currentUser]);

  const handleTaskClick = (task) => {
    // Open task link
    if (task.link.indexOf('t.me') >= 0) {
      webApp.openTelegramLink(task?.link);
    } else {
      webApp.openLink(task.link);
    }

    // Set loading state for the specific task
    setLoadingTaskId(task.id);

    setTimeout(async () => {
      try {
        const result = await completeTask(currentUser.id, task?.id, 'no proof');
        toast.success(result.message);
        fetchTask(); // Refresh tasks after completion
      } catch (error) {
        toast.error(error?.response?.data?.error || 'An error occurred');
      } finally {
        // Clear loading state after API call
        setLoadingTaskId(null);
      }
    }, 3000);
  };

  const taskIcons = {
    telegram: <FaTelegram className="task-icon" />,
    twitter: <FaTwitter className="task-icon" />,
    youtube: <FaYoutube className="task-icon" />,
    tiktok: <FaTiktok className="task-icon" />,
    medium: <FaMedium className="task-icon" />,
    others: <FaTasks className="task-icon" />,
  };

  return (
    <div className="task-page">
      <TelegramBackButton />
      <Container>
        <Row>
          <div className="title">
            <h3>Tasks</h3>
          </div>
          <div className="sub-title">
            <p>Each task must be fully completed in order to earn rewards!!!</p>
          </div>
        </Row>

        <Row>
          <h3 className="mt-3" style={{ fontSize: '16px' }}>
            Daily Tasks
          </h3>
          <Col xs={12}>
            <Link
              to="/dashboard/rewards"
              className="task-card d-flex justify-content-between align-items-center mt-3"
              style={{ textDecoration: 'none' }}
            >
              <div className="task-info d-flex align-items-center">
                <div className="task-icon">
                  <FaCalendar />
                </div>
                <div className="info d-flex flex-column">
                  <span className="task-title">Daily Checkin</span>
                  <span className="task-reward">
                    <img src={logo} alt="" width={20} height={20} /> 947.65
                    GPLTL
                  </span>
                </div>
              </div>
              <div className="task-status">
                {checkedIn ? <FaCheck /> : <FaGreaterThan />}
              </div>
            </Link>
          </Col>
        </Row>

        <Row>
          <h3 className="mt-3" style={{ fontSize: '16px' }}>
            One-Time Tasks
          </h3>
          {tasks.map((task) => (
            <Col xs={12} key={task.id}>
              <div
                onClick={() => handleTaskClick(task)}
                className="task-card d-flex justify-content-between align-items-center mt-3"
              >
                <div className="task-info d-flex align-items-center">
                  <div className="task-icon">{taskIcons[task.type]}</div>
                  <div className="info d-flex flex-column">
                    <span className="task-title">{task.name}</span>
                    <span className="task-reward">
                      <img src={logo} alt="" width={20} height={20} />{' '}
                      {task.reward} GPLTL
                    </span>
                  </div>
                </div>
                <div className="task-status">
                  {loadingTaskId === task.id ? (
                    <Spinner color="primary" />
                  ) : task.completed ? (
                    <FaCheck />
                  ) : (
                    <FaGreaterThan />
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {currentUser.username === 'emmyojay' ||
        currentUser.username === 'Ossypechos' ? (
          <Link className="mt-5 add-task-liank" to="/dashboard/create-task">
            Add Task
          </Link>
        ) : (
          ''
        )}
      </Container>
    </div>
  );
}

export default Tasks;
