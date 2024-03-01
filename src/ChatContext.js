// ChatContext.js

import { db } from './Config';
import { addDoc, collection, doc, getDoc, getDocs, updateDoc, query, where, orderBy, limit } from '@firebase/firestore';
import { createContext, useState, useEffect, useRef, useContext } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Modal from 'react-bootstrap/Modal';
import TimeAgo from 'react-timeago';

import { Context } from './AuthContext';

// For test and demo
import { faker } from '@faker-js/faker';

/*
//TODO:
Convert Chat as component
Convert Message as component
Add unreadMessages to Navbar
Add button on product item - DONE

Security rules for FireStore:
read/write chats: sellerId == auth.user.uid || buyerId == auth.user.uid
  - indices for filtering and sortning multi fields?
*/

// Collection Refs
const chatCollectionRef = collection(db, 'chats');

// https://firebase.google.com/docs/database/web/structure-data#flatten_data_structures
const messageCollectionRef = (chatId) => collection(db, 'chats-messages', chatId, 'messages')
const productCollectionRef = collection(db, 'products');

export const Chat = createContext();

export function ChatContext({ children }) {
  const { user } = useContext(Context);

  const [chats, setChats] = useState();
  const [activeChat, setActiveChat] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadChats, setUnreadChats] = useState(0);
  const [allowAutoRefresh, setAllowAutoRefresh] = useState(false);

  const windowMessage = useRef();
  const windowMessageFooter = useRef();
  const formMessage = useRef();

  // get list of chats
  const ListChats = async () => {
    const qBuyer = query(chatCollectionRef,
      where('buyerId', "==", user.uid.toString()),
      //limit(100), // need indices for sorting and filtering
    );
    const resultBuyer = await getDocs(qBuyer);
    const resultBuyerData = resultBuyer.docs.map(d => ({ ...d.data(), id: d.id }));

    const qSeller = query(chatCollectionRef,
      where('sellerId', "==", user.uid),
      //limit(100), // need indices for sorting and filtering
    );
    const resultSeller = await getDocs(qSeller);
    let resultSellerData = resultSeller.docs.map(d => ({ ...d.data(), id: d.id }));
    resultSellerData = resultSellerData.filter(d => (d.lastMessageAt > 0)); // buyer creates chat but hasn't sent yet
    let resultChats = [...resultBuyerData, ...resultSellerData];
    resultChats.sort((a, b) => b.lastMessage - a.lastMessage);
    setChats(resultChats);
  }

  const OpenChatWindow = async (product) => {
    if (!user?.uid) {
      console.error("Chat for authorizes users only");
      return;
    };

    if (product?.sellerID) {
      if (!product.sellerID) {
        alert("Wrong seller");
        return;
      }
      if (product.sellerID == user.uid) {
        alert("You try to talk with yourself");
        return;
      }
      // Get chat for the byer and the product
      const qChat = query(chatCollectionRef, where('buyerId', '==', user.uid));
      const chatDocs = await getDocs(qChat);
      const chatDocsData = chatDocs.docs.map(d => ({ ...d.data(), id: d.id }));
      const productChat = chatDocsData.find((d) => d.productId === product.id);
      if (productChat?.productName) {
        setActiveChat(productChat);
      } else { //add new chat
        const newDocData = {
          productId: product.id,
          productName: product.name,
          productPhoto: product.url || '',
          buyerId: user.uid,
          buyerName: user.name || user.displayName || '',
          buyerPhoto: user.photo || user.photoURL || '',
          sellerId: product.sellerID,
          sellerName: product.seller,
          sellerPhoto: product.sellerPhoto || '',
          lastMessageAt: 0,
          lastBuyerSeenAt: 0,
          lastSellerSeenAt: 0,
          createdAt: Date.now(),
        };
        const newChatDocRef = await addDoc(chatCollectionRef, newDocData);
        const newChatDoc = await getDoc(newChatDocRef); // get added chat along with its id
        const newChat = { ...newChatDoc.data(), id: newChatDoc.id };
        setActiveChat(newChat);
      }
    }

    setMessages(null); // Clean previous chat states
    await ListChats(); // Load new chat list
    setChatOpen(true); // Open modal window

  }

  // get list of messages by getDoc
  const ListMessage = async () => {
    if (activeChat) {
      const qMessages = query(
        messageCollectionRef(activeChat.id),
        limit(100)
      );
      const resultMessages = await getDocs(qMessages);
      let resultMessagesData = resultMessages.docs.map(d => ({ ...d.data(), id: d.id }));
      resultMessagesData.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(resultMessagesData);
      const lastMessageAt = resultMessagesData?.length > 0
        ? resultMessagesData[resultMessagesData.length - 1].createdAt
        : 0;
      updateLastSeen(lastMessageAt);
      scrollDownMessages();
    } else {
      setMessages(null);
    }
  }

  // refresh list of messages
  const RefreshMessages = async () => {
    if (chatOpen && activeChat) {
      const qMessages = query(
        messageCollectionRef(activeChat.id),
        limit(100)
      );
      const previousMessageCount = messages?.length;
      const resultMessages = await getDocs(qMessages);
      let resultMessagesData = resultMessages.docs.map(d => ({ ...d.data(), id: d.id }));
      resultMessagesData.sort((a, b) => a.createdAt - b.createdAt);
      const currentMessageCount = resultMessagesData?.length;
      setMessages(resultMessagesData);
      const lastMessageAt = resultMessagesData?.length > 0
        ? resultMessagesData[resultMessagesData.length - 1].createdAt
        : 0;
      updateLastSeen(lastMessageAt);
      if (currentMessageCount !== previousMessageCount) {
        scrollDownMessages();
      }
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
      text: formMessage.current.value.trim(),
      createdAt: Date.now(),
      authorId: user?.uid || 'anon',
      authorPhoto: user.photo || user.photoURL || '',
      authorName: user.name || user.displayName,
      media: [], // for future features
    }

    await addDoc(messageCollectionRef(activeChat.id), message)
      .then(() => {
        formMessage.current.value = '';
        formMessage.current.focus();
        (async () => {
          const chatDocRef = doc(chatCollectionRef, activeChat.id);
          await updateDoc(chatDocRef, { lastMessageAt: Date.now() });
        })();
      })
      .catch((error) => {
        console.error("Error creating message: ", error);
      });

    await ListChats();
    await ListMessage();
  }

  // scroll to element
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
  const scrollDownMessages = () => {
    setTimeout(() => {
      windowMessageFooter?.current?.scrollIntoView();
    }, 300)
  }

  const updateLastSeen = async (lastMessageAt) => {
    if (!user?.uid) return;
    if (!activeChat) return;

    const userLastSeenAt = activeChat.sellerId === user.uid
      ? activeChat.lastSellerSeenAt
      : activeChat.lastBuyerSeenAt;
    if (userLastSeenAt > lastMessageAt) return;

    const updateDate = (activeChat.sellerId === user.uid)
      ? { lastSellerSeenAt: Date.now() }
      : { lastBuyerSeenAt: Date.now() };

    const docRef = doc(chatCollectionRef, activeChat.id);
    updateDoc(docRef, updateDate)
      .then(() => {
        if (chats?.length) {
          let _chats = chats.slice().map(c => ({ ...c })); // copy array and copy fields on each elem
          for (let i = 0; i < _chats.length; i++) {
            if (_chats[i].id === activeChat?.id) {
              //const _activeChat = {...activeChat, ...updateDate};
              _chats[i] = { ..._chats[i], ...updateDate };
              //setActiveChat(_activeChat); // infinite loop
              setChats(_chats);
              break;
            }
          }
        }
      })
      .catch((err) => {
        console.error(`Error: ChatUpdateLastSeen: ${JSON.stringify(err)}`)
      });
  }

  const onActiveChatSelect = async (chatSelected) => {
    setActiveChat(chatSelected);
    await ListMessage();
  }

  // useEffect calls list of messages into messages var
  useEffect(() => {
    if (chatOpen && user?.uid) {
      (async () => { await ListChats() })()
    }
  }, [chatOpen]);

  // load messages for active chat
  useEffect(() => {
    if (chatOpen && user?.uid) {
      (async () => { await ListMessage() })()
    }
  }, [chatOpen, activeChat]);

  // reload messages for active chat
  useEffect(() => {
    const reloadTimer = setInterval(
      () => {
        if (chatOpen && activeChat && allowAutoRefresh) {
          (async () => { await RefreshMessages() })()
        }
      }, 10000
    );
    return () => clearInterval(reloadTimer);
  }, [chatOpen, activeChat, allowAutoRefresh]);

  // output list of messages
  return (
    <Chat.Provider value={{ OpenChatWindow, unreadChats }}>
      <Modal size="lg" show={chatOpen} onHide={() => setChatOpen(false)}
        aria-labelledby="example-modal-sizes-title-lg" className='chat-modal' >

        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Product Chat
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
                          className={'pt-1 pb-1 ps-1 pe-0 m-0' + (c.id === activeChat?.id ? ' active-chat' : ' item-chat')}
                          title={JSON.stringify(c, null, '\t')} onClick={async () => onActiveChatSelect(c)}>

                          <Col xs='auto'><Image src={c.productPhoto} alt={c.productName} className='chat-product-image' />
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
                                    ? <Row key={m.id} className='pt-1 pb-1 m-0' title={JSON.stringify(m, null, '\t')}>
                                      <Row className='text-end m-0 p-2 pb-0'>
                                        <span>{m.text}</span>
                                      </Row>
                                      <Row className='text-end m-0 p-2 pt-0'>
                                        <Col><i>{m.authorName || '-'}</i>,</Col>
                                        <Col xs='auto'><i><TimeAgo date={m.createdAt} minPeriod='30'></TimeAgo></i></Col>
                                      </Row>
                                    </Row>
                                    : <Row key={m.id} className='pt-1 pb-1 m-0' title={JSON.stringify(m, null, '\t')}>
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
                  {activeChat &&
                    <Form onSubmit={SendMessage} className="p-0" disabled={activeChat !== null}>
                      <Row className='ps-3 pe-3 pt-3 m-0'>
                        <Col>
                          <Form.Control ref={formMessage} type="text" placeholder="message text" />
                        </Col>
                        <Col xs='auto' className='ps-0'>
                          <Button variant="outline-secondary" type='submit' onClick={SendMessage}>Send</Button>
                          <Button className='ms-1' variant="secondary" onClick={RefreshMessages}>Reload</Button>
                        </Col>
                      </Row>
                    </Form>
                  }
                </>
                : <Row className="container d-flex align-items-center justify-content-center h-100 text-muted">Please select a chat</Row>
              }
            </Col>

          </Row>
        </Modal.Body>
      </Modal>
      {children}
    </Chat.Provider>
  );
}
