import React from "react";

const HomePage = ({ history }) => {
  return (
    <div>
      <div className="ui inverted vertical masthead center aligned segment">
        <h1 className="ui inverted stackable header">
          <img className="ui image massive" src="/assets/logo.png" alt="logo" />
          <div className="content">Re-vents</div>
        </h1>
      </div>
    </div>
  );
};

export default HomePage;
