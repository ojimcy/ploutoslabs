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
import PropTypes from 'prop-types';
import { t } from 'i18next';
const ITEMS_PER_PAGE = 20;

const ReferralTable = ({ firstGeneration, secondGeneration, loading }) => {
  const [activeTab, setActiveTab] = useState('first');
  const [currentPage, setCurrentPage] = useState(1);

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

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time

    // Always show first page
    items.push(
      <PaginationItem active={currentPage === 1} key={1}>
        <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
      </PaginationItem>
    );

    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem active={currentPage === i} key={i}>
            <PaginationLink onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show ellipsis and limited pages
      if (currentPage > 3) {
        items.push(
          <PaginationItem disabled key="start-ellipsis">
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }

      // Show pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(currentPage + 1, totalPages - 1);
        i++
      ) {
        items.push(
          <PaginationItem active={currentPage === i} key={i}>
            <PaginationLink onClick={() => handlePageChange(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem disabled key="end-ellipsis">
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem active={currentPage === totalPages} key={totalPages}>
            <PaginationLink onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="referral-table-container">
      <Nav tabs className="referral-tabs">
        <NavItem>
          <NavLink
            className={activeTab === 'first' ? 'active' : ''}
            onClick={() => setActiveTab('first')}
          >
            {t('referral.directReferrals')} ({firstGeneration.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === 'second' ? 'active' : ''}
            onClick={() => setActiveTab('second')}
          >
            {t('referral.indirectReferrals')} ({secondGeneration.length})
          </NavLink>
        </NavItem>
      </Nav>

      <Table className="referral-table" responsive dark>
        <thead>
          <tr>
            <th>#</th>
            <th>{t('common.username')}</th>
            <th>{t('common.balance')}</th>
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
                {t('common.no')} {activeTab === 'first' ? t('common.direct') : t('common.indirect')}{' '}
                {t('referral.referralsYet')}
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

            {renderPaginationItems()}

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

ReferralTable.propTypes = {
  firstGeneration: PropTypes.array.isRequired,
  secondGeneration: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default ReferralTable;
