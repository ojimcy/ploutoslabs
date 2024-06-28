/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';

import './Breadcrumb.css';

export default function Breadcrumb({ title, page }) {
  return (
    <section className="breadcrumb-area breadcrumb-bg">
      <Container>
        <Row className="justify-content-center">
          <Col lg="8">
            <div className="breadcrumb-content">
              <h2 className="title">{title}</h2>
              <nav aria-label="Breadcrumbs">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li> 
                  <li className="breadcrumb-item">
                    <Link to="#">{page}</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
