const db = require("../models");
const gamesController = require('./games.controllers');

const Review = db.Review;
const Games = db.Games;
const User = db.User;
const UserReview = db.UserReview;
const GameReview = db.GameReview;

/* Routes */

exports.showCreate = async (req, res) => {
    const games = await Games.findAll();
    res.render('review/create', { games } );
}

exports.showAll = async (req, res) => { 
    const allReviews = await this.findAllWithForeignKeys();
    res.render('review/all', {allReviews});
};

exports.createReview = async (req, res) => {
    const account = req.user;
    const values = req.body;
    const gameTarget = await gamesController.findGameByName(values.gameName)

    if(values.title.length == 0 || values.review.length == 0|| values.gameName.length == 0){
        req.flash('messageFailure', "Rellena todos los campos");
        return res.redirect(301, "/review/create");
    }

    if(!gameTarget){
        req.flash('messageFailure', "El juego que introduciste no existe en nuestro registro de juegos.");
        return res.redirect(301, "/review/create");
    }
    
    const newReview = await this.newReview(values.title, values.description);
    await this.newUserReview(account.id, newReview.id);
    await this.newGameReview(gameTarget.id, newReview.id);

    req.flash('messageSuccess', "Bien capo");
    res.redirect(301, '/review/all');
}

/* Database */

exports.newReview = async (_title, _description) => {
    return await Review.create({ 
        raw: true,
        nest: true,
        title: _title,
        description: _description
    });
}

exports.newUserReview = async (_userId, _reviewId) => {
    return await UserReview.create({
        userId: _userId,
        reviewId: _reviewId
    });
}

exports.newGameReview = async (_gameId, _reviewId) => {
    return await GameReview.create({
        gameId: _gameId,
        reviewId: _reviewId
    });
}

exports.findAllUserReviews = async (_userId) => {
    return await Review.findAll({
        raw: true,
        nest: true,
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
            {
                model: User,
                as: "users",
                where: {
                    id : _userId
                }
            },
            {
                model: Games,
                as: "games",
                attributes: ['id', 'name', 'image']
            }
        ]
    });
}

exports.findAllWithForeignKeys = async () => {
    return await Review.findAll({
        raw: true,
        nest: true,
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
            {
                model: User,
                as: "users",
                attributes: ['id', 'name', 'surname', 'avatar']
            },
            {
                model: Games,
                as: "games",
                attributes: ['id', 'name', 'image']
            }
        ]
    });
}
