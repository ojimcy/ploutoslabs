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
import { useCurrentUser } from '../../../hooks/telegram';
import {
  completeTask,
  getTasks,
  getUserByTelegramID,
} from '../../../lib/server';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';
import './tasks.css';
import { useCheckInStatus } from '../../../lib/checkInStatus';
import { WebappContext } from '../../../context/telegram';

function Tasks() {
  const navigate = useNavigate();
  const { setUser } = useContext(WebappContext);
  const [tasks, setTasks] = useState([]);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();
  const { checkedIn, countdown } = useCheckInStatus(currentUser);

  const telegramId = localStorage.getItem('TELEGRAM_ID');

  useEffect(() => {
    if (!telegramId) {
      navigate('/auth');
      return;
    }

    const fetchUserData = async () => {
      try {
        const user = await getUserByTelegramID(telegramId);
        if (user) {
          setUser(user);
        } else {
          toast.error('Failed to fetch user data');
          navigate('/auth');
        }
      } catch (error) {
        toast.error('Error fetching user data');
        if (error.response?.status === 401) navigate('/auth');
      }
    };

    fetchUserData();
  }, [telegramId]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchTasks = async () => {
      try {
        const tks = await getTasks(currentUser.id);
        setTasks(tks);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch tasks.');
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  const handleTaskClick = async (task) => {
    if (task.link.startsWith('http')) {
      window.open(task.link, '_blank');
    } else {
      navigate(task.link);
    }

    setLoadingTaskId(task.id);

    try {
      const result = await completeTask(currentUser.id, task?.id, 'no proof');
      toast.success(result.message);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
      );
    } catch (error) {
      toast.error(error?.response?.data?.error || 'An error occurred');
    } finally {
      setLoadingTaskId(null);
    }
  };

  const taskIcons = {
    telegram: <FaTelegram className="task-icon" />,
    twitter: <FaTwitter className="task-icon" />,
    youtube: <FaYoutube className="task-icon" />,
    tiktok: <FaTiktok className="task-icon" />,
    medium: <FaMedium className="task-icon" />,
    others: <FaTasks className="task-icon" />,
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '200px' }}
      >
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div className="task-page">
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
                  <span className="task-title">Daily Check-in</span>
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
