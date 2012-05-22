// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players."

Players = new Meteor.Collection("players");

if (Meteor.is_client) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };

  Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
  };

  Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
  };

  Template.leaderboard.events = {
    'click input.give1': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 1}});
    },

	'click input.give2': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 2}});
    },

	'click input.give3': function () {
      Players.update(Session.get("selected_player"), {$inc: {score: 3}});
    }
  };

  Template.player.events = {
    'click': function () {
      Session.set("selected_player", this._id);
    }
  };
}

// On server startup, create some players if the database is empty.
if (Meteor.is_server) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Jason Lim",
                   "Beckham Koh",
                   "Alan Tan",
                   "Tan Jiak Lang",
                   "Jessica Alba Ong",
                   "Bruno Venus Ng"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: 0});
	}
  });
}
