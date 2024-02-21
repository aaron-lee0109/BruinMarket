// Chars.js dummy version

import { db } from '../Config';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, query, where, orderBy, limit } from '@firebase/firestore';
import { useState, useEffect, useRef, useContext } from 'react';
import { Navbar } from '../Navbar';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
//import ToggleButton from 'react-bootstrap/ToggleButton';
import TimeAgo from 'react-timeago';

import { Context } from '../AuthContext';

// For test and demo
import { faker } from '@faker-js/faker';

/*
//TODO:
Convert Chat as component
Convert Message as component
Add unreadMessages to Navbar
Add button on product item

Security rules for FireStore:
read/write chats: sellerId == auth.user.uid || buyerId == auth.user.uid
  - indexes for filtering and sortning multi fields?

*/

// Collection Refs
const chatCollectionRef = collection(db, 'chats');
const messageCollectionRef = collection(db, 'messages');
const productCollectionRef = collection(db, 'products');


function Chats() {
  const { user } = useContext(Context);
  //  const user = { //TODO: get real user from context
  //      uid:'QyDsy7V6jJTHCTOZVK82gxGN5xt1', //wxEAs77bfDMoqWGRgWBRtaA2XZh2
  //      name: 'fake user',
  //      photo: '', //TODO: get photo from user's context
  //    };

  const [ chats, setChats ] = useState();
  const [ activeChat, setActiveChat ] = useState(null);
  const [ chatOpen, setChatOpen ] = useState(false);
  const [ messages, setMessages ] = useState([]);
  const [ unreadChats, setUnreadChats ] = useState(0);

  const windowMessage = useRef();
  const windowMessageFooter = useRef();
  
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

  const OpenChatWindow = async (productId) => {
    if (!user?.uid) {
      console.error("Chat for authorizes users only");
      return;
    };

    //Clean previous chat states
    setMessages(null)
    
    setChatOpen(true);
  }

  //TODO: TEMP for testing purposes
  const ChatFeed = async () => {
    if (!user?.uid) return;

    for(let i = 0; i < 10; i++){
      let productid = Math.floor(Math.random() * 1000);
      await addDoc(chatCollectionRef, {
        productId: faker.string.alpha(24),
        productName: faker.commerce.product(),
        productPhoto: faker.image.url(),
        buyerId: user.uid,
        buyerName: user.name || user.displayName || '',
        buyerPhoto: user.photo || user.photoURL || '',
        sellerId: faker.string.alpha(24),
        sellerName: faker.person.fullName(),
        sellerPhoto: faker.image.avatar(),
        lastMessageAt: 0,
        lastBuyerSeenAt: 0,
        lastSellerSeenAt: 0,
        createdAt: Date.now(),
      })
      .then(() => {})
      .catch((err) => {
        console.error("Error creating product:", err);
      });

      await addDoc(chatCollectionRef, {
        productId: faker.string.alpha(24),
        productName: faker.commerce.product(),
        productPhoto: faker.image.business(),
        sellerId: user.uid,
        sellerName: user.name || user.displayName || '',
        sellerPhoto: user.photo || user.photoURL || '',
        buyerId: faker.string.alpha(24),
        buyerName: faker.person.firstName(),
        buyerPhoto: faker.image.avatar(),
        lastMessageAt: 0,
        lastBuyerSeenAt: 0,
        lastSellerSeenAt: 0,
        createdAt: Date.now(),
      })
      .then(() => {})
      .catch((err) => {
        console.error("Error creating product:", err);
      })
    }

    ListChats();

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
        const lastMessageAt = resultMessagesData?.length > 0 
          ?  resultMessagesData[resultMessagesData.length-1].createdAt 
          : 0;
        updateLastSeen(lastMessageAt);
    } else {
        setMessages(null);
    }
  }

  // send message by addDoc
  const SendMessage = async (event) => {
    event.preventDefault();

    if (!user?.uid) return;
    if (!activeChat || !formMessage?.current?.value?.trim()) return;

    const message = {
        chatId: activeChat.id,
        text: formMessage.current.value,
        createdAt: Date.now(),
        authorId: user?.uid || 'anon', 
        authorPhoto: user.photo || user.photoURL || '',
        authorName: user.name || user.displayName,
        media: [], // for future features
    }

    await addDoc(messageCollectionRef, message)
    .then( () => {
      formMessage.current.value = '';
      formMessage.current.focus();
      (async () => {
        const chatDocRef = doc(chatCollectionRef, activeChat.id);
        await updateDoc(chatDocRef, { lastMessage: Date.now() }); 
        //await ListChats(); //return when there is no more fake
      })();
    })
    .catch( (error) => { console.error("Error creating message: ", error );
    });

    //TODO: TEMP for testing purposes
    const reply = {
      chatId: activeChat.id,
      text: faker.commerce.productDescription(),
      createdAt: Date.now(),
      authorId: activeChat.sellerId === user.uid ? activeChat.buyerId : activeChat.sellerId,
      authorName: activeChat.sellerId === user.uid ? activeChat.buyerName : activeChat.sellerName,
      authorPhoto: activeChat.sellerId === user.uid ? activeChat.buyerPhoto : activeChat.sellerPhoto,
      media: [],
    }
    await addDoc(messageCollectionRef, reply)
      .then(() => {
        (async () => {
          const chatDocRef = doc(chatCollectionRef, activeChat.id);
          await updateDoc(chatDocRef, { lastMessageAt: reply.createdAt });
        })();
      })
      .catch((err) => {
        console.error("Error creating document:", err);
          });
    // End of fake answer

    await ListChats();
    await ListMessage();
  }

  const updateLastSeen = async (lastMessageAt) => {
    console.log('UpdateLastseen');
  /*  //TODO: Review! Wrong behavior
    if (!user?.uid) return;
    if (!activeChat) return;

    const userLastSeenAt = activeChat.sellerId === user.uid
      ? activeChat.lastSellerSeenAt
      : activeChat.lastBuyerSeenAt;
    if (userLastSeenAt > lastMessageAt) return;

    const updateDate = (activeChat.sellerId === user.uid)
      ? {lastSellerSeenAt: Date.now()}
      : {lastBuyerSeenAt: Date.now()};

      const docRef = doc(chatCollectionRef, activeChat.id);

      updateDoc(docRef, updateDate)
        .then(() => {
          if (chats?.length) {
            let _chats = chats.slice().map(c => ({...c})); // copy array and copy fields on each elem
            for (let i = 0; i < _chats.length; i++) {
              if (_chats[i].id === activeChat?.id) {
                // update only the required states
                const _activeChat = {...activeChat, ...updateDate};
                _chats[i] = {..._chats[i], ...updateDate};
                setActiveChat(_activeChat);
                setChats(_chats);
                break;
              }
            }
          }
        })
        .catch((err) => {
          console.error(`Error: ChatUpdateLastSeen: ${JSON.stringify(err)}`)
        });
  */  
  }

  const onActiveChatSelect = async (chatSelected) => {
    console.log('ativechatselected: ' + chatSelected.id);
    setActiveChat(chatSelected);
    await ListMessage();

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
    <>
    <Navbar />
      <h1>Messages
        <Button onClick={async () => {OpenChatWindow()}}>open chat window</Button>
      </h1>

      <Modal size="lg" show={chatOpen} onHide={() => setChatOpen(false)}
        aria-labelledby="example-modal-sizes-title-lg" className='chat-modal' >

        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Product Chat
            <Button onClick={ChatFeed}>Create fake chats</Button>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className='p-0'>
          <Row className='m-0'>
            
            <Col xs={4} className='p-0 chats-window'>
              {chats?.length
              ? <Col className='chats-list'>
                {chats?.length
                  && chats.map(c => {
                    return (
                      <Row key={c.id}
                        className={'pt-1 pb-1 ps-1 pe-0 m-0' + (c.id===activeChat?.id ? ' active-chat':' item-chat')} 
                        title={JSON.stringify(c,null,'\t')} onClick={async () => onActiveChatSelect(c)}>
                        
                        <Col xs='auto'><Image src={c.productPhoto} alt={c.productName} className='chat-product-image'/>
                        </Col>

                        <Col className='pe-0'>
                          <Row className='' title={c.productName}>
                            <Col className='p-0' xs='auto'>{c.productName}</Col>
                            {
                              c.buyerId === user?.uid
                              ? c.lastBuyerSeenAt < c.lastMessageAt && 
                                <Col className='p-0'><Badge pill bg="warning" className='ms-2 chat-badge' title='New unread messages'></Badge></Col>
                              : c.lastSellerSeenAt < c.lastMessageAt && 
                                <Col className='p-0'><Badge pill bg="warning" className='ms-2 chat-badge' title='New unread messages'></Badge></Col>
                            }
                            
                          </Row>
                          <Row className=''>
                            <Col className='p-0' xs='auto'>{
                              c.buyerId === user?.uid
                              ? <i>{c.sellerName}</i>
                              : <i>{c.buyerName}</i>
                            },</Col>
                            <Col><i><TimeAgo date={c.lastMessage} minPeriod='30'></TimeAgo></i></Col>
                          </Row>
                        </Col>

                      </Row>
                    )
                  })
                }
                </Col>
              : <Row><span>There are no chats yet. Please use the product card to start conversation with sellers.</span></Row>
              }
            </Col>

            <Col xs={8} className='m-0 p-0'>
              {activeChat
              ? <>
                  <Row className='m-0 ps-4 pt-3 pb-3 message-window' ref={windowMessage}>
                    <Col className=''>
                    {messages?.length
                    ? <>
                       <Row>
                        {messages.map(m => {
                          return (
                            activeChat?.id === m.chatId && (
                            m.authorId === user?.uid 
                            ? <Row key={m.id} className='pt-1 pb-1 m-0' title={JSON.stringify(m,null,'\t')}>
                                <Row className='text-end m-0 p-2 pb-0'>
                                  <span>{m.text}</span>
                                </Row>
                                <Row className='text-end m-0 p-2 pt-0'>
                                  <Col><i>{m.authorName || '-'}</i>,</Col>
                                  <Col xs='auto'><i><TimeAgo date={m.createdAt} minPeriod='30'></TimeAgo></i></Col>
                                </Row>
                              </Row>
                            : <Row key={m.id} className='pt-1 pb-1 m-0' title={JSON.stringify(m,null,'\t')}>
                                <Row className='m-0 p-2 pb-0'>
                                  <span>{m.text}</span>
                                </Row>
                                <Row className='m-0 p-2 pt-0'>
                                  <Col xs='auto'><i>{m.authorName || '-'}</i>,</Col>
                                  <Col><i><TimeAgo date={m.createdAt} minPeriod='30'></TimeAgo></i></Col>
                                </Row>
                              </Row>
                            ))
                        })}
                        </Row>
                      </>
                      : <Row>There are no messages yet</Row>
                      }
                      <Row className='p-0 m-0' ref={windowMessageFooter}>{/* Im here to handle to scroll down and CheckSeenLastMessage() */}</Row>
                    </Col>
                  </Row>

                  <Form onSubmit={SendMessage} className="p-0" disabled={activeChat !== null}>
                    <Row className='ps-3 pe-3 pt-3 m-0'>
                      <Col>
                        <Form.Control ref={formMessage} type="text" placeholder="message text" />
                      </Col>
                      <Col xs='auto' className='ps-0'>
                        <Button variant="outline-secondary" type='submit' onClick={SendMessage}><i className="fa-regular fa-paper-plane" />Send</Button>
                      </Col>
                    </Row>
                  </Form>

                </>
              : <Row className="container d-flex align-items-center justify-content-center h-100 text-muted">Please select a chat</Row>
              }
            </Col>

          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Chats;