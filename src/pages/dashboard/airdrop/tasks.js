import React, { useContext, useEffect, useState } from 'react';
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
import { useCheckInStatus } from '../../../lib/checkInStatus';
import { WebappContext } from '../../../context/telegram';

function Tasks() {
  const { setUser, user } = useContext(WebappContext);
  const [tasks, setTasks] = useState([]);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const webApp = useWebApp();
  const currentUser = useCurrentUser();
  const telegramUser = useTelegramUser();
  const { checkedIn, countdown } = useCheckInStatus(user);

  const fetchUserData = async () => {
    try {
      const user = await getUserByTelegramID(telegramUser.id);
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    if (telegramUser) {
      fetchUserData();
    }
  }, [telegramUser]);

  const fetchTask = async () => {
    try {
      const tks = await getTasks(user.id);
      setTasks(tks);
    } catch (error) {
      toast.error('Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    if (!telegramUser) return;
    fetchTask();
  }, [telegramUser]);

  const handleTaskClick = (task) => {
    // Open task link
    if (task.link.indexOf('t.me') >= 0) {
      webApp.openTelegramLink(task?.link);
    } else {
      webApp.openLink(task.link);
    }

    setLoadingTaskId(task.id);

    setTimeout(async () => {
      try {
        const result = await completeTask(currentUser.id, task?.id, 'no proof');
        toast.success(result.message);
        fetchTask();
      } catch (error) {
        toast.error(error?.response?.data?.error || 'An error occurred');
      } finally {
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
                    {checkedIn ? `Claim in ${countdown}` : 'Claim now'}
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

        {(currentUser?.username === 'Ossypechos' ||
          currentUser?.username === 'emmyojay') && (
          <Link className="mt-5 add-task-link" to="/dashboard/create-task">
            Add Task
          </Link>
        )}
      </Container>
    </div>
  );
}

export default Tasks;
