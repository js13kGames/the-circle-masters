//@ts-ignore
const serverStorage = storage
const playersPerTeam = 2
const games = []

function getGame() {
	if (games.length > 0 && games[0].players.length < playersPerTeam * 2)
		return games[0]
	
	const game = {
		id: 'room' + games.length,
		players: []
	}

	games.unshift(game)

	serverStorage.get('games', 0).then(games => {
		serverStorage.set('games', games + 1)
	})

	return game
}

module.exports = {

	io: (player) => {
		const game = getGame()
		const id = game.players.length
		
		game.players.push(player)

		player.join(game.id)

		console.log('Player ' + player.id + ' id: '+ id + ' in ' + game.id)
		
		player.emit('prepare', game.players.length, JSON.stringify(
			game.players.map(e => e.data).filter(e => e)
		))
		
		if (game.players.length === playersPerTeam * 2) setTimeout(() => {
			console.log('Start ' + game.id)
			player.emit('start')
			player.to(game.id).emit('start')
		}, 4000)

		const events = {
			disconnect: () => {
				console.log('Disconnected: ' + player.id)
				player.to(game.id).emit('end', -1)
	
				game.players.forEach(p => p.disconnect())
	
				game.players.length = playersPerTeam * 2
			},
			hello: (playerName, playerClass) => {
				player.data = [playerName, playerClass]
	
				console.log('Player ' + id + ' ' + playerName + ' ' + playerClass)
				
				player.to(game.id).emit('hello', playerName, playerClass)
			},
			target: (x, y) => {
				console.log('Target ' + game.id + ', player ' + id + '  ' + x + ' ' + y)
	
				player.emit('target', id, x, y).to(game.id).emit('target', id, x, y)
			},
			end: (i) => {
				console.log('End ' + game.id + ', player ' + id + ' winner ' + i)
				
				player.to(game.id).emit('end', id)
			}
		}

		for (const key in events) if (events.hasOwnProperty(key))
			player.on(key, events[key])
	}
}
