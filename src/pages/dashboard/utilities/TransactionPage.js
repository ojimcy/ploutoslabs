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
const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

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
          <h3>Transactions</h3>
          <p>View and manage your transactions</p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={12}>
          <Form className="d-flex align-items-center justify-content-center">
            <FormGroup className="mr-2">
              <Label for="filterDate" className="mr-2">
                Date
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
                Status
              </Label>
              <Input
                type="select"
                id="filterStatus"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </Input>
            </FormGroup>
            <FormGroup className="mr-2">
              <Label for="filterType" className="mr-2">
                Type
              </Label>
              <Input
                type="select"
                id="filterType"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="Data">Data</option>
                <option value="Airtime">Airtime</option>
                <option value="Electricity">Electricity</option>
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
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
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
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No transactions found.
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
