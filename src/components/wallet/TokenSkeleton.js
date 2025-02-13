import React from 'react';
import { Col } from 'reactstrap';
import { Separator } from '../common/Seperator';
import './token-skeleton.css';

const TokenSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <React.Fragment key={item}>
          <Col xs="12" className="crypto-card">
            <div className="crypto-card-content mt-2">
              <div className="crypto-icon">
                <div className="skeleton-icon pulse" />
                <div className="crypto-info">
                  <div className="skeleton-symbol pulse" />
                  <div className="crypto-price-container">
                    <div className="skeleton-price pulse" />
                    <div className="skeleton-change pulse" />
                  </div>
                </div>
              </div>
              <div className="crypto-amount">
                <div className="skeleton-quantity pulse" />
                <div className="skeleton-value pulse" />
              </div>
            </div>
          </Col>
          <Separator />
        </React.Fragment>
      ))}
    </>
  );
};

export default TokenSkeleton;
