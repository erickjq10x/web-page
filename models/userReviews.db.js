module.exports = (sequelize, Sequelize) => {
    const UserReview = sequelize.define("user_review",
        {   },
        {
            freezeTableName: true,
            timestamps: false
        }
    );
  return UserReview;
};