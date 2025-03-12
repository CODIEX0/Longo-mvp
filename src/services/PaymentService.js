import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  writeBatch, 
  arrayUnion, 
  updateDoc 
} from 'firebase/firestore';

const PAYFAST_CONFIG = {
  merchant_id: process.env.PAYFAST_MERCHANT_ID,
  merchant_key: process.env.PAYFAST_MERCHANT_KEY,
  passphrase: process.env.PAYFAST_PASSPHRASE,
  sandbox: process.env.NODE_ENV !== 'production'
};

class PaymentService {
  static generateSignature(data, passPhrase = null) {
    let pfOutput = '';
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] !== '') {
          pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
        }
      }
    }

    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}`;
    }

    return require('crypto').createHash('md5').update(getString).digest('hex');
  }

  static async createSubscription(userId, amount = 100.00) {
    try {
      // Get user details
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const paymentData = {
        merchant_id: PAYFAST_CONFIG.merchant_id,
        merchant_key: PAYFAST_CONFIG.merchant_key,
        return_url: `${process.env.APP_URL}/payment/success`,
        cancel_url: `${process.env.APP_URL}/payment/cancel`,
        notify_url: `${process.env.APP_URL}/api/payment/notify`,
        name_first: user.name.split(' ')[0],
        name_last: user.name.split(' ')[1] || '',
        email_address: user.email,
        m_payment_id: `${userId}_${Date.now()}`,
        amount: amount.toFixed(2),
        item_name: 'Service Provider Subscription',
        subscription_type: '1',
        billing_date: new Date().toISOString().split('T')[0],
        recurring_amount: amount.toFixed(2),
        frequency: '3',
        cycles: '0'
      };

      // Generate signature
      paymentData.signature = this.generateSignature(paymentData, PAYFAST_CONFIG.passphrase);

      // Store payment intent
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          user_id: userId,
          payment_id: paymentData.m_payment_id,
          amount: amount,
          status: 'pending',
          type: 'subscription'
        }]);

      if (paymentError) throw paymentError;

      return {
        paymentUrl: PAYFAST_CONFIG.sandbox ? 
          'https://sandbox.payfast.co.za/eng/process' : 
          'https://www.payfast.co.za/eng/process',
        paymentData
      };
    } catch (error) {
      throw error;
    }
  }

  static async handleNotification(notifyData) {
    try {
      // Verify payment data
      const { payment_status, m_payment_id, amount_gross, signature } = notifyData;
      
      // Verify signature
      const calculatedSignature = this.generateSignature(notifyData, PAYFAST_CONFIG.passphrase);
      if (signature !== calculatedSignature) {
        throw new Error('Invalid signature');
      }

      // Update payment status
      const { error } = await supabase
        .from('payments')
        .update({ 
          status: payment_status,
          amount_received: amount_gross,
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', m_payment_id);

      if (error) throw error;

      // If payment successful, update user subscription
      if (payment_status === 'COMPLETE') {
        await this.activateSubscription(m_payment_id);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async activateSubscription(paymentId) {
    try {
      // Get payment details
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('user_id')
        .eq('payment_id', paymentId)
        .single();

      if (paymentError) throw paymentError;

      // Update user subscription status
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          subscription_status: 'active',
          subscription_start: new Date().toISOString(),
          subscription_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('id', payment.user_id);

      if (userError) throw userError;

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async createPayment(userId, paymentData) {
    try {
      const payment = {
        ...paymentData,
        userId,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const batch = writeBatch(db);
      
      // Add payment record
      const paymentRef = await addDoc(collection(db, 'payments'), payment);
      
      // Update user's payment history
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, {
        lastPaymentDate: serverTimestamp(),
        paymentHistory: arrayUnion(paymentRef.id)
      });

      await batch.commit();
      return { id: paymentRef.id, ...payment };
    } catch (error) {
      throw error;
    }
  }

  static async getUserPayments(userId) {
    try {
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(paymentsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  static async updatePaymentStatus(paymentId, status) {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default PaymentService; 