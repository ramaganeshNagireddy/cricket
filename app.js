const express = require("express");
const app = express();
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

const initializerDB = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializerDB();
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
app.get("/players/:playerId/", async (request, response) => {
  const player_id = request.params;
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team
 WHERE
 player_id=${player_id};`;
  const playersArray = await database.get(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

app.post("/players/", async (request, response) => {
  const plyerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postplayer = `
    INSERT INTO
     cricket_team(playerName,jerseyNumber,role)
    VALUES
     ('${playerName}'
       '${jerseyNumber}'
       '${role}')`;
  const posttem = await db.run(postplayer);
  response.send("Player Added to ");
});
app.put("/players/:playerId/", async (request, response) => {
  const player_id = request.params;
  const plyerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const putplayer = `
    UPDATE
    cricket_team
    SET
    playerName='${playerName}',
    jerseyNumber='${jerseyNumber}'
    role='${role}'
    WHERE
    player_id=${player_id}`;
  await db.run(putplayer);
  response.send("Player Details Up");
});
app.delete("/players/:playerId/", async (request, response) => {
  const player_id = request.params;

  const deleteplayer = `DELETE FROM cricket_team WHERE player_id=${player_id}
    `;
  await db.run(deleteplayer);
  response.send("Player Removed");
});
module.exports = app;
