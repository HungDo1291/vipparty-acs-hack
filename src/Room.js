import React, { useState, useEffect } from 'react';
import Video from 'twilio-video';
import Participant from './Participant';

const Room = ({ roomName, token, handleLogout }) => {

var jwt=require('jsonwebtoken');
var decoded=jwt.decode(token);
var identify=decoded.grants.identity;

console.log(decoded.grants.identity);

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = participant => {
    if(!participant.identity.includes('secondary_guest')){

      setParticipants(prevParticipants => [...prevParticipants, participant]);
      }
    };

    const participantDisconnected = participant => {
      setParticipants(prevParticipants =>
        prevParticipants.filter(p => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName
    }).then(room => {
      setRoom(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom(currentRoom => {
        if (currentRoom && currentRoom.localParticipant.state === 'connected') {
          currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);

  const remoteParticipants = participants.map(participant => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ''
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;

// const Room = ({ roomName, token, handleLogout }) => {
//   //console.log(token)
//   var jwt = require('jsonwebtoken');
//   var decoded = jwt.decode(token);
//   var identity = decoded.grants.identity
//   //console.log(decoded)
//   console.log(decoded.grants.identity)
//   const [room, setRoom] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   useEffect(() => {
//     const participantConnected = participant => {
//       if (!participant.identity.includes('secondary_guest')){
//         setParticipants(prevParticipants => [...prevParticipants, participant]);
//       }
//     };
//     const participantDisconnected = participant => {
//       setParticipants(prevParticipants =>
//         prevParticipants.filter(p => p !== participant)
//       );
//     };
//     Video.connect(token, {
//       name: roomName
//     }).then(room => {
//       setRoom(room);
//       room.on('participantConnected', participantConnected);
//       room.on('participantDisconnected', participantDisconnected);
//       room.participants.forEach(participantConnected);
//     });
//     return () => {
//       setRoom(currentRoom => {
//         console.log("currentRoom", currentRoom)
//         if (currentRoom && currentRoom.localParticipant.state === 'connected' ) {
//           currentRoom.localParticipant.tracks.forEach(function(trackPublication) {
//             trackPublication.track.stop();
//           });
//           currentRoom.disconnect();
//           return null;
//         } else {
//           return currentRoom;
//         }
//       });
//     };
//   }, [roomName, token]);
//   const remoteParticipants = participants.map(participant => (
//     <Participant key={participant.sid} participant={participant} />
//   ));
//   return (
//     <div className="room">
//       <h2>Room: {roomName}</h2>
//       <button onClick={handleLogout}>Log out</button>
//       <div className="local-participant">
//         {((!identity.includes('secondary_guest')) && room) ? (
//           <Participant
//             key={room.localParticipant.sid}
//             participant={room.localParticipant}
//           />
//         ) : (
//           ''
//         )}
//       </div>
//       <h3>Primary guests</h3>
//       <div className="remote-participants">{remoteParticipants}</div>
//     </div>
//   );
// };
// export default Room;
