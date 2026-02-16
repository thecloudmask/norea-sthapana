import {
  collectionGroup,
  getDocs,
  query,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

export interface Donation {
  id?: string;
  projectId?: string;
  donorName: string;
  amount: number;
  currency: "USD" | "KHR";
  paymentMethod: "cash" | "qr" | "transfer";
  status?: "active" | "inactive";
  createdAt?: any;
  // ... other fields
}
import { db } from "~/utils/firebase";
import { ref } from "vue";

export const useDonations = () => {
  const donations = ref<Donation[]>([]);
  const loading = ref(false);

  // Fetch ALL donations from all projects
  const fetchAllDonations = async () => {
    loading.value = true;
    try {
      const q = query(collectionGroup(db, "donations"));
      const snapshot = await getDocs(q);
      const raw = snapshot.docs.map((d) => ({
        id: d.id,
        projectId: d.ref.parent.parent?.id,
        ...d.data(),
      })) as Donation[];

      donations.value = raw.sort((a: any, b: any) => {
        const da = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt || 0);
        const db = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt || 0);
        return db - da;
      });
    } catch (e) {
      console.error("Error fetching donations:", e);
    } finally {
      loading.value = false;
    }
  };

  const addDonation = async (
    projectId: string,
    donationData: Omit<Donation, "id" | "createdAt" | "projectId">
  ) => {
    const projectRef = doc(db, "projects", projectId);
    const donationsRef = collection(db, "projects", projectId, "donations");

    await runTransaction(db, async (transaction) => {
      const projectDoc = await transaction.get(projectRef);
      if (!projectDoc.exists()) throw new Error("Project does not exist");

      // Calculate value to add to project total (Normalized to USD)
      const amount = Number(donationData.amount);
      let incrementVal = amount;
      // Simple normalization: 4100 KHR = 1 USD
      if (donationData.currency === "KHR") {
        incrementVal = amount / 4100;
      }

      const currentAmount = projectDoc.data().currentAmount || 0;
      const newTotal = currentAmount + incrementVal;

      const newDonationRef = doc(donationsRef);

      transaction.set(newDonationRef, {
        ...donationData,
        createdAt: serverTimestamp(),
      });

      transaction.update(projectRef, {
        currentAmount: newTotal,
      });
    });

    // Refresh list if we are viewing it
    // But since list is global, we might not want to re-fetch all.
    // Just let the UI update or user refresh.
  };

  return { donations, loading, fetchAllDonations, addDonation };
};
