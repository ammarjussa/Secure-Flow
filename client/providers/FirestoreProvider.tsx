import { ReactNode, createContext, useContext, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Props {
  children: ReactNode;
}

interface ContextProps {
  userData: any;
  fetchUserByEmail: any;
  participantData: any;
  fetchDataByApproval: any;
  allProdAdd: any;
  allProdAddData: any;
  allWholeAdd: any;
  allRetailAdd: any;
  fetchAddressesByParticipant: any;
}

const FirestoreContext = createContext<ContextProps>({
  userData: {},
  fetchUserByEmail: () => {},
  participantData: {},
  fetchDataByApproval: () => {},
  allProdAdd: [],
  allProdAddData: {},
  allWholeAdd: [],
  allRetailAdd: [],
  fetchAddressesByParticipant: () => {},
});

export const FirestoreProvider: React.FC<Props> = ({ children }) => {
  const [userData, setUserData] = useState<any>(null);
  const [participantData, setParticipantData] = useState<any>();
  const [allProdAdd, setAllProdAdd] = useState();
  const [allProdAddData, setAllProdAddData] = useState();
  const [allWholeAdd, setAllWholeAdd] = useState();
  const [allRetailAdd, setAllRetailAdd] = useState();

  const fetchUserByEmail = async (user: any) => {
    const collectionRef = collection(db, "participants");
    try {
      const qry = query(collectionRef, where("email", "==", user?.email));
      const docSnap = await getDocs(qry);
      setUserData(docSnap.docs[0].data());
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataByApproval = async () => {
    const dataArr: any[] = [];
    const collectionRef = collection(db, "participants");
    try {
      const qry = query(
        collectionRef,
        where("role", "!=", "Admin"),
        where("approved", "==", false)
      );
      const querySnapshot = await getDocs(qry);
      if (querySnapshot) {
        querySnapshot.forEach((doc) => {
          let obj = {
            id: doc.id,
            data: doc.data(),
          };
          dataArr.push(obj);
        });
        setParticipantData(dataArr);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAddressesByParticipant = async (participant: string) => {
    const collectionRef = collection(db, "participants");
    try {
      if (participant === "Manufacturer") {
        const qry = query(collectionRef, where("role", "==", "Manufacturer"));
        const querySnapshot = await getDocs(qry);
        const addrs: any = [];
        const addMap: any = {};
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            addrs.push(doc.data().walletAddress);
            addMap[doc.data().walletAddress] = doc.data();
          });
        }
        setAllProdAdd(addrs);
        setAllProdAddData(addMap);
      } else if (participant === "Wholesaler") {
        const qry = query(collectionRef, where("role", "==", "Wholesaler"));
        const querySnapshot = await getDocs(qry);
        const addrs: any = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            addrs.push(doc.data().walletAddress);
          });
        }
        setAllWholeAdd(addrs);
      } else if (participant === "Retailer") {
        const qry = query(collectionRef, where("role", "==", "Retailer"));
        const querySnapshot = await getDocs(qry);
        const addrs: any = [];
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            addrs.push(doc.data().walletAddress);
          });
        }
        setAllRetailAdd(addrs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FirestoreContext.Provider
      value={{
        userData,
        fetchUserByEmail,
        participantData,
        fetchDataByApproval,
        allProdAdd,
        allProdAddData,
        allWholeAdd,
        allRetailAdd,
        fetchAddressesByParticipant,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};

export function useFirestoreContext(): ContextProps {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error(
      "useFirestoreContext must be used within Firestore Provider"
    );
  }
  return context;
}
