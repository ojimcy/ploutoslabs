import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import {
  FaCheck,
  FaGreaterThan,
  FaMedium,
  FaTasks,
  FaTelegram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { useCurrentUser, useTelegramUser, useWebApp } from '../../../hooks/telegram';
import { completeTask, getTasks, getUserByTelegramID } from '../../../lib/server';
import { toast } from 'react-toastify';

import logo from '../../../assets/images/logo.png';

import './tasks.css';
import TelegramBackButton from '../../../components/common/TelegramBackButton';

function Tasks() {
  const [tasks, setTasks] = useState([])
  const webApp = useWebApp();
  const currentUser = useCurrentUser();
  const telegramUser = useTelegramUser()

  useEffect(() => {
    if(!telegramUser) return;
    const fn = async () => {
      const user = await getUserByTelegramID(telegramUser.id)
      const tks = await getTasks(user.id)
      console.log('tks', tks)
      setTasks(tks)
    }

    fn()
  }, [telegramUser])

  const handleTaskClick = async (task) => {
    console.log(task)
    if (task.link.indexOf('t.me') >= 0) {
      webApp.openTelegramLink(task?.link);
    } else {
      webApp.openLink(task.link);
    }

    try {
      const result = await completeTask(currentUser.id, task?.id, 'no proof');
      toast({
        title: 'Done',
        description: result.message,
      });
    } catch (error) {
      toast({
        duration: 5000,
        title: 'Error',
        description: error?.response?.data?.error,
      });
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

  return (
    <div className="task-page">
      <TelegramBackButton/>
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
          {tasks.map((task) => (
            <Col xs={12} key={task.id}>
              <div
                onClick={() => handleTaskClick(task)}
                className="task-card d-flex justify-content-between align-items-center mt-4"
              >
                <div className="task-info d-flex align-items-center">
                  <div className="task-icon">{taskIcons[task.type]}</div>
                  <div className="info d-flex flex-column">
                    <span className="task-title">{task.name}</span>
                    <span className="task-reward">
                      <img src={logo} alt="" width={20} height={20} />{' '}
                      {task.reward} PLTL
                    </span>
                  </div>
                </div>
                <div className="task-status">
                  {task.completed ? <FaCheck /> : <FaGreaterThan />}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Tasks;
