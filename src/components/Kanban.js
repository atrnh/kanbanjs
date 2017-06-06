import React, { Component } from 'react';


const boards = [
  {
    title: 'To Do',
    desc: 'Stuff to do',
    jobs: [
      {
        title: 'Be Cool',
        tasks: [
          {
            title: 'Learn how to be cool',
            priority: 'none',
          },
        ],
      },
    ],
  },
  {
    title: 'Doing',
    desc: "Stuff I've done",
    jobs: [],
  },
  {
    title: 'Done',
    desc: 'Finished!',
    jobs: [],
  },
];

function Job(props) {
  return (
    <div className="job">
      <h2>{props.title}</h2>
    </div>
  );
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: props.jobs,
    };
  }

  render() {
    console.log(this.state);
    const jobs = this.state.jobs.map(job => {
      return (
        <Job {...job} />
      );
    });

    return (
      <div className="board">
        <h1>{this.props.title}</h1>
        <p>{this.props.desc}</p>
        {jobs}
      </div>
    );
  }
}

class Kanban extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: boards,
    };
  }

  render() {
    const boards = this.state.boards.map(board => {
      return (
        <Board {...board} />
      );
    });

    return (
      <div>
        {boards}
      </div>
    );
  }
}

export default Kanban;
