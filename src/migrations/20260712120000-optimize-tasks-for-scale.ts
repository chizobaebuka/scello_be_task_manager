import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    // Tasks.description was VARCHAR(255); any description over 255 chars fails the insert.
    await queryInterface.changeColumn('Tasks', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // Every task query filters by userId (owner scoping) - without an index this is
    // a full table scan per request once the table grows past a trivial size.
    await queryInterface.addIndex('Tasks', ['userId'], {
      name: 'tasks_user_id_idx',
    });

    // Speeds up the completion report (COUNT ... WHERE userId = ? AND status = ?).
    await queryInterface.addIndex('Tasks', ['userId', 'status'], {
      name: 'tasks_user_id_status_idx',
    });

    // Speeds up the time-tracking report (WHERE userId = ? AND createdAt BETWEEN ? AND ?).
    await queryInterface.addIndex('Tasks', ['userId', 'createdAt'], {
      name: 'tasks_user_id_created_at_idx',
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    await queryInterface.removeIndex('Tasks', 'tasks_user_id_created_at_idx');
    await queryInterface.removeIndex('Tasks', 'tasks_user_id_status_idx');
    await queryInterface.removeIndex('Tasks', 'tasks_user_id_idx');

    await queryInterface.changeColumn('Tasks', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
