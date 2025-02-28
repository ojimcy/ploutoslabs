import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Table,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from 'reactstrap';
import './transactions.css';
import { getUtilityTransactions } from '../../../lib/server';
import { useNavigate } from 'react-router-dom';
import { formatTransactionType } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTransactions = async () => {
      // Fetch transactions from the server
      const result = await getUtilityTransactions();
      setTransactions(result);
    };

    fetchTransactions();
  }, []);

  const [filters, setFilters] = useState({
    date: '',
    status: '',
    type: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const { date, status, type } = filters;
    return (
      (!date || transaction.date === date) &&
      (!status || transaction.status === status) &&
      (!type || transaction.type === type)
    );
  });

  const handleTransactionClick = (transaction) => {
    navigate(`/dashboard/transaction-details?txID=${transaction.id}`);
  };

  const formatDate = (date) => {
    // Convert to milliseconds if timestamp is in seconds
    const dateObj =
      typeof date === 'number' ? new Date(date * 1000) : new Date(date);

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <Container className="transaction-page">
      <Row>
        <Col md={12} className="text-center mb-4">
          <h3>{t('portfolio.transactions')}</h3>
          <p>{t('utilities.viewAndManageTransactions')}</p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <Form className="d-flex align-items-center justify-content-center">
            <FormGroup className="mr-2">
              <Label for="filterDate" className="mr-2">
                {t('common.date')}
              </Label>
              <Input
                type="date"
                id="filterDate"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </FormGroup>
            <FormGroup className="mr-2">
              <Label for="filterStatus" className="mr-2">
                {t('common.status')}
              </Label>
              <Input
                type="select"
                id="filterStatus"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">{t('common.all')}</option>
                <option value="completed">{t('common.completed')}</option>
                <option value="failed">{t('common.failed')}</option>
                <option value="pending">{t('common.pending')}</option>
              </Input>
            </FormGroup>
            <FormGroup className="mr-2">
              <Label for="filterType" className="mr-2">
                {t('common.type')}
              </Label>
              <Input
                type="select"
                id="filterType"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">{t('common.all')}</option>
                <option value="Data">{t('utilities.data')}</option>
                <option value="Airtime">{t('utilities.airtime')}</option>
                <option value="Electricity">
                  {t('utilities.electricity')}
                </option>
              </Input>
            </FormGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Table className="styled-table" dark striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>{t('common.date')}</th>
                <th>{t('common.type')}</th>
                <th>{t('common.status')}</th>
                <th>{t('common.amount')}</th>
                <th>{t('common.action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{formatTransactionType(transaction.type)}</td>
                    <td>
                      <span
                        className={`status-${transaction.status.toLowerCase()}`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td>{transaction.amount}</td>
                    <td>
                      <Button
                        color="info"
                        size="sm"
                        onClick={() => handleTransactionClick(transaction)}
                      >
                        {t('common.details')}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    {t('utilities.noTransactionsFound')}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionPage;
