import React, { useEffect, useMemo, useState } from "react";
import ahmad from "./common/ahmadKaleem.png";
import random from "./common/random.png";
import io from "socket.io-client";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBIcon,
  MDBTextArea,
} from "mdb-react-ui-kit";
import ScrollToBottom from "react-scroll-to-bottom";

const socket = io.connect("http://localhost:3001");

export default function App() {

  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const joinRoom = () => {
    if (room !== "" && username !== ""){
      socket.emit("join_room", room);
    }
  }

  const sendMessage = async () => {
    if (currentMessage !== ""){
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      }
      setCurrentMessage("");
      await socket.emit("send_message", messageData);
      setMessageList((prevMessageList) => [...prevMessageList, messageData])
    }
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((prevMessageList) => [...prevMessageList, data])
    })
  }, [socket])

  return (
    <MDBContainer className="py-5">
      <MDBRow className="d-flex justify-content-center">
        <MDBCol md="8" lg="6" xl="4">

          <div style={{"alignItems": "center", "display": "flex", "justify-content": "center"}}>
          <input 
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username...."
            type="text" style={{borderRadius: "10px", width: "160px"}} />
          <input 
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Room..."
            type="text" style={{borderRadius: "10px", width: "100px"}} />
            <button 
            onClick={joinRoom}
            type="text" 
            style={{borderRadius: "10px", width: "50px", marginLeft: "20px"}}>Join</button>
          </div>
          <br />

          <MDBCard id="chat1" style={{ borderRadius: "15px" }}>
            <MDBCardHeader
              className="d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
              }}
            >
              <MDBIcon fas icon="angle-left" />
              <p className="mb-0 fw-bold">Live chat</p>
              <MDBIcon fas icon="times" />
            </MDBCardHeader>
            <ScrollToBottom>
            <div style={{height:300}}>
            {messageList?.map((message, index) => {
            return (
            <MDBCardBody key={index}>
              {message.author !== username ? 
              <div className="d-flex flex-row justify-content-start mb-4">
                <img
                  src={random}
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
                <div
                  className="p-3 ms-3"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: "rgba(57, 192, 237,.2)",
                  }}
                >
                  <div style={{fontSize: "15px", color: "blue"}}>{message.author}</div>
                  <p className="small mb-0">
                    <b>{message.message}</b>
                  </p>
                  <p style={{fontSize: "12px", color: "green"}} className="mb-0">
                    {message.time}
                  </p>
                </div>
              </div> :

              <div className="d-flex flex-row justify-content-end mb-4">
                <div
                  className="p-3 me-3 border"
                  style={{ borderRadius: "15px", backgroundColor: "#fbfbfb" }}
                >
                  <div style={{fontSize: "15px", color: "blue"}}>{message.author}</div>
                  <p className="small mb-0">
                    <b>{message.message}</b>
                  </p>
                  <p style={{fontSize: "12px", color: "green"}} className="mb-0">
                    {message.time}
                  </p>
                </div>
                <img
                  src={random}
                  alt="avatar 1"
                  style={{ width: "45px", height: "100%" }}
                />
              </div>}
            </MDBCardBody>
            )})}
            </div>
           </ScrollToBottom>
              <MDBTextArea
                className="form-outline"
                label="Type your message"
                id="textAreaExample"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(event) => 
                  {if (event.key === "Enter"){
                    sendMessage();
                    event.preventDefault();
                }}}
                rows={1}
              />
              <button onClick={sendMessage}>&#9658;</button>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}