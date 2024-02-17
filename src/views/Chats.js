// Chars.js dummy version

import { db } from '../Config';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, query, where, orderBy, limit } from '@firebase/firestore';
import { useState, useEffect, useRef } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function Chats() {

    const user = { //TODO: get real user from context
        uid:'QyDsy7V6jJTHCTOZVK82gxGN5xt1', //wxEAs77bfDMoqWGRgWBRtaA2XZh2
        name: 'fake user',
        photo: '', //TODO: get photo from user's context
      };

  const chatCollectionRef = collection(db, 'chats');
  const messageCollectionRef = collection(db, 'messages');
  const [chats, setChats] = useState();
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([{text: '111'}, {text: '222'}]);
  const formMessage = useRef();
  
  // get list of chats
  const ListChats = async () => {
    
    const qBuyer = query(chatCollectionRef,
        where('buyerId', "==", user.uid.toString()),
        //limit(100),
    );
    const resultBuyer = await getDocs(qBuyer);
    const resultBuyerDate = resultBuyer.docs.map(d => ({ ...d.data(), id: d.id }));
     
    const qSeller = query(chatCollectionRef,
        where('sellerId', "==", user.uid),
        //limit(100),
    );
    const resultSeller = await getDocs(qSeller);
    const resultSellerDate = resultSeller.docs.map(d => ({ ...d.data(), id: d.id }));

    let resultChats = [...resultBuyerDate, ...resultSellerDate];
    resultChats.sort((a, b) => b.lastMessage - a.lastMessage);
    setChats(resultChats);
  }


  //TODO: TEMP for testing purposes
const ChatFeed = async () => {
    for(let i = 0; i < 10; i++){
      let productid = Math.floor(Math.random() * 1000);
      await addDoc(chatCollectionRef, {
        productId: productid,
        productName: `Item ${productid}`,
        buyerId: user.uid,
        buyerName: user.name,
        sellerId: Math.floor(Math.random() * 1000).toString(),
        sellerName: `Name ${productid}`,
        lastMessage: Date.now(),
      })
      .then(() => {})
      .catch((error) => {
        console.error("Error creating product:", error);
      });

      productid = Math.floor(Math.random() * 1000);
      await addDoc(chatCollectionRef, {
        productId: productid,
        productName: `Item ${productid}`,
        sellerId: user.uid,
        sellerName: user.name,
        buyerId: Math.floor(Math.random() * 1000).toString(),
        buyerName: `Name ${productid}`,
        lastMessage: Date.now(),
      })
      .then(() => {})
      .catch((error) => {
        console.error("Error creating product:", error);
      })
    }
  }

  // get list of messages by getDoc
  const ListMessage = async () => {
    if (activeChat) {
        const qMessages = query(messageCollectionRef,
            where('chatId', "==", activeChat.id.toString()),
            limit(100)
        );
        const resultMessages = await getDocs(qMessages);
        let resultMessagesData = resultMessages.docs.map(d => ({ ...d.data(), id: d.id }));
        resultMessagesData.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(resultMessagesData);
    } else {
        setMessages(null);
    }
  }

  // send message by addDoc
  const SendMessage = async (event) => {
    event.preventDefault();

    if (!activeChat || !formMessage?.current?.value?.trim()) return;

    const message = {
        chatId: activeChat.id,
        text: formMessage.current.value,
        createdAt: Date.now(),
        authorID: user?.uid || 'anon', 
        authorPhoto: user?.photo || '',
    }

    await addDoc(messageCollectionRef, message)
    .then( () => {
      ListMessage(); // no await
      formMessage.current.value = '';
      formMessage.current.focus();
      (async () => {
        const chatDocRef = doc(chatCollectionRef, activeChat.id);
        await getDoc(chatDocRef);
        await updateDoc(chatDocRef, { lastMessage: Date.now() }); 
        await ListChats(); 
      })();
    })
    .catch( (error) => { console.error("Error creating message: ", error );
    });

  }

  // useEffect calls list of messages into messages var
  useEffect( () => { 
     (async () => { 
      await ListChats();
    })()
  },[]);

  // load messages for active chat
  useEffect( () => { 
    (async () => { 
     await ListMessage();
   })() 
 },[activeChat]);


  // output list of messages
  return (
    <div className="App">
      <h2>Chats <Button onClick={() => ChatFeed()}>Create test data</Button></h2>


      <Row>
        <Col xs={4}>
          {
            chats?.length && 
              chats.map(c => {
              return (
                <Row key={c.id} className={'pt-2 pb-2 ps-3 item-chat' + (c.id===activeChat?.id ? ' active-chat' : '' )}
                 title={JSON.stringify(c)} onClick={() => setActiveChat(c)}>
                  <Col xs={11}>
                    {c.productName}
                    {
                        c.buyerId === user.uid
                        ? <Col><span className='text-muted'>seller:</span> {c.sellerName}</Col>
                        : <Col><span className='text-muted'>buyer:</span> {c.buyerName}</Col>
                    }
                  </Col>
                </Row>
              )
            }) 
          }
        </Col>
        <Col xs={8} style={{'border':'1px solid #ccc'}}>
            {activeChat
            ? <><Row>
            {
              messages && messages.length
              ? <Col className='p-3 ps-4'>
                  {messages.map(m => {
                  return (
                    <Row key={m.id} className='pt-2 pb-2' title={JSON.stringify(m)}>
                      {m.authorID === user.uid
                        ? <Col align="right">
                            {m.text}<br/>
                            <small className='text-muted'>{(new Date(m.createdAt)).toLocaleString()}</small>
                          </Col>
                        : <Col align="left">
                            {m.text}<br/>
                            <small className='text-muted'>{(new Date(m.createdAt)).toLocaleString()}</small>
                          </Col>
                      }</Row>
                  )
                })}
                </Col>
              : <Col className='pt-2 pb-2'>There are no messages yet
                </Col> 
              }
            </Row>
  
            <hr/>
  
            <Form onSubmit={SendMessage}>
              <Row className='p-2'>
                <Form.Group className='mb-3'>
                  <Form.Control ref={formMessage} type='text' placeholder='Enter message' />
                </Form.Group>
              </Row>
              <Row>
                <Col>
                  <Button variant='outline-secondary' onClick={SendMessage}>Send</Button>
                </Col>
              </Row>
            </Form>
            </>
            : <>No active chat
            </>
            }
        </Col>
      </Row>

    </div>
  );
}

export default Chats;