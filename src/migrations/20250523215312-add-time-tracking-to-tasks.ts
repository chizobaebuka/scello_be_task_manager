import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    await queryInterface.addColumn('Tasks', 'startTime', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Tasks', 'endTime', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Tasks', 'durationMinutes', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: typeof DataTypes): Promise<void> {
    await queryInterface.removeColumn('Tasks', 'startTime');
    await queryInterface.removeColumn('Tasks', 'endTime');
    await queryInterface.removeColumn('Tasks', 'durationMinutes');
  },
};