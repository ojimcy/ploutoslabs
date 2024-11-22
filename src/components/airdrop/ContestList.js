/* eslint-disable react/prop-types */
import React from 'react';

function ContestList({ title, subtitle, data }) {
  return (
    <div>
      <h5 className="contest-title">{title}</h5>
      <p className="contest-subtitle">{subtitle}</p>
      {data.length > 0 ? (
        data.map((user, index) => (
          <div
            className="contest-card d-flex justify-content-between align-items-center mt-2"
            key={user.id || index}
          >
            <div className="contest-info d-flex align-items-center">
              <div className="contest-icon d-flex align-items-center justify-content-center">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.username} />
                ) : (
                  <span>{user.username?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="info d-flex flex-column">
                <span className="contest-username">
                  {user.username || 'Unknown'}
                </span>
                <span className="contest-count">
                  Referrals: {user.referrals}
                </span>
              </div>
            </div>
            <div className="position">{index + 1 <= 5 ? `🏆` : index + 1}</div>
          </div>
        ))
      ) : (
        <p className="text-center mt-4">No participants yet!</p>
      )}
    </div>
  );
}

export default ContestList;
