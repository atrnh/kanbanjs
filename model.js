const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres:///kanban');

const Board = sequelize.define('board', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  desc: {
    type: Sequelize.TEXT,
  }
}, {underscored: true});

const Job = sequelize.define('job', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  desc: {
    type: Sequelize.TEXT,
  },
  complete: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {underscored: true});

const Priority = sequelize.define('priority', {
  code: {
    type: Sequelize.STRING(4),
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    unique: true,
  },
}, {
  name: {
    singular: 'priority',
    plural: 'priorities',
  },
  underscored: true,
});

const Task = sequelize.define('task', {
  title: {
    type: Sequelize.STRING,
  },
  complete: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {underscored: true});

const BoardJobs = sequelize.define('boardJobs', {}, {
  tableName: 'board_jobs',
  underscored: true,
});

// Associations
Priority.hasMany(Task, {as: 'Tasks', foreignKey: 'priority_code', sourceKey: 'code'});
Task.belongsTo(Priority, {as: 'Priority', foreignKey: 'priority_code', targetKey: 'code'});
Board.belongsToMany(Job, {through: BoardJobs});
Job.belongsToMany(Board, {through: BoardJobs});

sequelize.sync({force: true}).then(() => {
  const priorities = Priority.bulkCreate([
    { code: 'none', title: 'None' },
    { code: 'min', title: 'Minor' },
    { code: 'med', title: 'Medium' },
    { code: 'urg', title: 'Urgent' }
  ]);

  const boards = Board.bulkCreate([
    { title: 'To Do', desc: 'Things to do' },
    { title: 'Doing', desc: "Things I'm working on" },
    { title: 'Done', desc: 'Completed tasks' }
  ]);

  const job = Job.create({
    title: 'Be cool',
    desc: 'Gotta learn how to be a cool person'
  });

  const task = Task
    .create({
      title: 'Get sunglasses'
    })
    .then((task) => {
      task.setPriority('min').then((task) => {
        // Let's see if we can get priority-min's task
        priorities.then((priorities) => {
          priorities[1].getTasks().then((tasks) => { // The min priority
            tasks.map(task => {
              console.log(task.get({plain: true}));
            });
          });
        });
      });
    });
});
