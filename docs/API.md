# JSON spec

# Phone

## Phone UI -> Phone Server

### Client Initialization `init`

Phone UI -> Phone Server initialization
Server responds with `player-configuration`

```json
{
  "type": "init"
}
```

### Create Guess `guess`

Phone UI -> Phone Server initialization
```json
{
  "type": "guess",
  "guess": {
    "itemId": 0,
    "playerId": "Unique Name",
    "gameId": "new-game-1581679350",
    "choices": [
      9,
      null,
      null,
      5,
      null,
      1
    ],
    "answers": [
      {
        "format": "number",
        "number": 1
      },
      {
        "format": "decimal"
      },
      {
        "format": "number",
        "number": 0
      },
      {
        "format": "number",
        "number": 0,
        "from": 4,
        "result": null
      }
    ]
  }
}
```

## Phone Server -> Phone UI

### Heartbeat  `heartbeat`
Phone Server -> Phone UI sends player state. 
Server has received `init` or `guess`
Server pushes on a timer
```json
{
  "type": "heartbeat",
  "game": {
    "id": "new-game-1581679350",
    "state": "active"
  }
}
```

### Player state  `player`
Phone Server -> Phone UI sends player state. 
Server has received `init` or `guess`
```json
{
  "type": "player",
  "player": {
    "id": "Unique Name",
    "username": "Unique Name",
    "avatar": {},
    "gameId": "new-game-1581679350",
    "score": 100,
    "lastRound": {
      "itemId": 0,
      "choices": [
        9,
        null,
        null,
        5,
        null,
        1
      ],
      "answers": [
        {
          "format": "number",
          "number": 1,
          "from": 1,
          "result": "correct"
        },
        {
          "format": "decimal"
        },
        {
          "format": "number",
          "number": 0,
          "from": 2,
          "result": "correct"
        },
        {
          "format": "number",
          "number": 0,
          "from": 4,
          "result": "correct"
        }
      ],
      "image": "/static/images/0.jpg",
      "points": 100
    },
    "currentRound": {
      "itemId": 1,
      "choices": [
        5,
        4,
        8,
        5,
        7,
        8
      ],
      "answers": [
        {
          "format": "number"
        },
        {
          "format": "decimal"
        },
        {
          "format": "number"
        },
        {
          "format": "number"
        }
      ],
      "image": "/static/images/1.jpg",
      "points": 100
    },
    "game": {
      "id": "new-game-1581679350",
      "state": "active"
    }
  }
}
```


# Leaderboard

## Leaderboard UI -> Leaderboard Server

### Client Initialization `init`

Leaderboard UI -> Leaderboard Server initialization
Server responds with `leaderboard`

```json
{
  "type": "init"
}
```

### Leaderboard  `leaderboard`
Leaderboard Server -> Leaderboard UI sends leaderboard state. 
Server has received `init`
Server pushes on a timer
```json
{
  "type": "leaderboard",
  "leaders": [
    {
      "player": "Unique Name 1",
      "score": 100,
      "achievements":  {}
    }
    //... 20 total ...
  ]
}
```

# Dashboard

## Dashboard UI -> Dashboard Server

### Client Initialization `init`

Dashboard UI -> Dashboard Server initialization
Server responds with `clusters`

```json
{
  "type": "init"
}
```

### Clusters  `Clusters`
Dashboard Server -> Dashboard UI sends player state. 
Server has received `init`
Server pushes on a timer
```json
{
  "type": "clusters",
  "clusters": [
    {
      "name": "West Coast 1",
      "status": "up",
      "incomingTraffic":  100,
      "outgoingTraffic": 100
    }
    //... all clusters ...
  ]
}
```
