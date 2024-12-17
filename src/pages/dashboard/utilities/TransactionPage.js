import React, { useState } from 'react';
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
import TelegramBackButton from '../../../components/common/TelegramBackButton';
import './transactions.css';
import TransactionDetailsModal from '../../../components/modal/TransactionDetailsModal';

const TransactionPage = () => {
  const [transactions] = useState([
    {
      id: 1,
      date: '2024-12-10',
      type: 'Data',
      status: 'Successful',
      details: { plan: '1GB', provider: 'Provider A' },
    },
    {
      id: 2,
      date: '2024-12-11',
      type: 'Airtime',
      status: 'Failed',
      details: { amount: '500 NGN', provider: 'Provider B' },
    },
    {
      id: 3,
      date: '2024-12-12',
      type: 'Electricity',
      status: 'Pending',
      details: { token: '1234-5678-9101-1121', meter: '12345678' },
    },
  ]);

  const [filters, setFilters] = useState({
    date: '',
    status: '',
    type: '',
  });

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Container className="transaction-page">
      <TelegramBackButton />
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
                <option value="Successful">Successful</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
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
          <Table className="styled-table" striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <tr key={transaction.id}>
                    <td>{index + 1}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.type}</td>
                    <td
                      className={`status-${transaction.status.toLowerCase()}`}
                    >
                      {transaction.status}
                    </td>
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
                  <td colSpan="5" className="text-center">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <TransactionDetailsModal
        isOpen={isModalOpen}
        toggle={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
        onCopy={handleCopy}
      />
    </Container>
  );
};

export default TransactionPage;
