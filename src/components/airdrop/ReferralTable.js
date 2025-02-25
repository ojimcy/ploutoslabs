import React, { useState, useEffect } from 'react';
import {
  Table,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';
import './referral-table.css';
import { fetchReferrals } from '../../lib/server';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 20;

const ReferralTable = () => {
  const [firstGeneration, setFirstGeneration] = useState([]);
  const [secondGeneration, setSecondGeneration] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('first');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        setLoading(true);
        const result = await fetchReferrals();
        setFirstGeneration(result.firstGeneration || []);
        setSecondGeneration(result.secondGeneration || []);
      } catch (error) {
        console.log('Error in getReferrals', error);
        toast.error('Failed to get referrals');
      } finally {
        setLoading(false);
      }
    };
    loadReferrals();
  }, []);

  // Reset page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="referral-table-loading">
        <div className="loader"></div>
        <p>Loading referrals...</p>
      </div>
    );
  }

  const currentReferrals =
    activeTab === 'first' ? firstGeneration : secondGeneration;

  // Pagination calculations
  const totalPages = Math.ceil(currentReferrals.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReferrals = currentReferrals.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  console.log('firstGeneration', firstGeneration);
  
  return (
    <div className="referral-table-container">
      <Nav tabs className="referral-tabs">
        <NavItem>
          <NavLink
            className={activeTab === 'first' ? 'active' : ''}
            onClick={() => setActiveTab('first')}
          >
            Direct Referrals ({firstGeneration.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'second' ? 'active' : ''}
            onClick={() => setActiveTab('second')}
          >
            Indirect Referrals ({secondGeneration.length})
          </NavLink>
        </NavItem>
      </Nav>

      <Table className="referral-table" responsive dark>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReferrals.length > 0 ? (
            paginatedReferrals.map((referral, index) => (
              <tr key={referral.id}>
                <td>{startIndex + index + 1}</td>
                <td>
                  @
                  {referral.username ||
                    referral.firstName ||
                    referral.lastName ||
                    'NA'}
                </td>
                <td>
                  {referral.balance ? referral.balance?.toFixed(2) : '0'} GPLTL
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No {activeTab === 'first' ? 'direct' : 'indirect'} referrals
                yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination>
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink
                previous
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem active={currentPage === index + 1} key={index}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem disabled={currentPage === totalPages}>
              <PaginationLink
                next
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ReferralTable;
