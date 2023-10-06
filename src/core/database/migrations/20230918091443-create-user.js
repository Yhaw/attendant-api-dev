'use strict';

const TABLE_NAME = 'users';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const tables = await queryInterface.showAllTables();

      if (!tables.includes(TABLE_NAME)) {
        await queryInterface.createTable(
          TABLE_NAME,
          {
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
              allowNull: false,
            },
            first_name: { type: Sequelize.STRING, allowNull: false },
            last_name: { type: Sequelize.STRING, allowNull: false },
            birthday: { type: Sequelize.DATE, allowNull: false },
            email: { type: Sequelize.STRING, unique: true, allowNull: false },
            password: { type: Sequelize.STRING, allowNull: false },
            phone_number: {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
            },
            username: {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
            },
            digital_address: { type: Sequelize.STRING, allowNull: false },
            gender: { type: Sequelize.STRING, allowNull: false },
            public_service_id: {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
            },
            ghana_card_id: {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
            },
            picture_url: { type: Sequelize.STRING, allowNull: true },
            profile_visibility: { type: Sequelize.BOOLEAN, allowNull: true },
            verified: {
              type: Sequelize.BOOLEAN,
              defaultValue: false,
              allowNull: true,
            },
            verifiedAt: { type: Sequelize.DATE, allowNull: true },
            isActive: {
              type: Sequelize.BOOLEAN,
              defaultValue: true,
              allowNull: true,
            },
            phoneVerifiedAt: { type: Sequelize.DATE, allowNull: true },
            passwordChangedAt: { type: Sequelize.DATE, allowNull: false },
            passwordResetToken: { type: Sequelize.STRING, allowNull: false },
            passwordResetExpires: { type: Sequelize.DATE, allowNull: false },
            created_at: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
              allowNull: false,
            },
            updated_at: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.NOW,
              allowNull: false,
            },
            deleted_at: { type: Sequelize.DATE, allowNull: true },
          },
          { transaction },
        );

        await queryInterface.addIndex(TABLE_NAME, ['id'], {
          fields: 'id',
          unique: true,
          transaction,
        });
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
