import { db } from '../authentication/Config';
import { collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { Context } from '../authentication/AuthContext';
import { useContext, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const productsReportCollectionRef = (prodId) => collection(db, 'products-reports', prodId, 'reports')

export function ProductReport({product}) {
  const { user } = useContext(Context);

  // https://react-bootstrap.netlify.app/docs/components/modal/#focus-on-specific-element
  const [show, setShow] = useState(false);
  const [prevReport, setPrevReport] = useState(null);

  const openReport = async () => {
    const reportDocRef = doc(productsReportCollectionRef(product.id), user.uid);
    const previousReport = await getDoc(reportDocRef);
    const prevReportData = previousReport.data();
    if (prevReportData?.reason) {
      setPrevReport(prevReportData);
    }
    setShow(true);
  }

  const closeReport = () => setShow(false);

  const formReason = useRef();

  const sendReport = async (event) => {
    event.preventDefault();
    if (!user?.uid) return;
    if (!formReason?.current?.value?.trim()) return;
    console.log(formReason.current.value.trim());

    const report = {
      reason: formReason.current.value.trim(),
      createdAt: Date.now(),
      authorId: user.uid || 'anon',
      authorName: user.name || user.displayName,
      status: 'recieved',
      productId: product.id,
      // Product snapshot:
      productName: product.name,
      productUrl: product.url,
      productDescription: product.description
    }

    const reportDocRef = doc(productsReportCollectionRef(product.id), user.uid);

    await setDoc(reportDocRef, report)
      .then(() => {
        closeReport();
        alert("Thank you!");
      })
      .catch((error) => {
        console.error("Error sending report: ", error);
        alert("Error sending report: ", error);
      });

  }

  return (
    <>
      {user?.uid !== product?.sellerID &&
        <Button variant="secondary" onClick={openReport} className="report">Report item</Button>}

      <Modal show={show} onHide={closeReport}>
        <Modal.Header closeButton>
          <Modal.Title>Report item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Enter reason for report</Form.Label>
              <Form.Control ref={formReason} as="textarea" rows={3} autoFocus defaultValue={prevReport?.reason}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeReport}>
            Close
          </Button>
          <Button variant="primary" onClick={sendReport}>
            {prevReport ? "Update " : "Send "} Report
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}